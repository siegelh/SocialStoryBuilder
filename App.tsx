
import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import StoryScreen from './components/StoryScreen';
import ScenarioSelector from './components/ScenarioSelector';
import ChildProfileForm from './components/ChildProfileForm';
import CustomScenarioForm from './components/CustomScenarioForm';
import SocialStoryViewer from './components/SocialStoryViewer';
import SavedStoriesLibrary from './components/SavedStoriesLibrary';
import { StoryConfig, StoryState, StoryStep, Character, SocialStoryTemplate, SocialStoryConfig, CustomScenarioInput, SocialStoryScene, SocialStorySceneStep, SocialStoryState, SavedSocialStory } from './src/types';
import { generateSocialStoryScene, generateCharacterReference, generateImage } from './services/socialStoryApi';
import { mergeMultipleImages } from './utils/imageUtils';
import { saveStory, getSavedStories, deleteStory, updateLastViewed, getSavedStoriesCount } from './services/storageService';
import { EXAMPLE_STORIES_DATA } from './src/data/examples';
import { getTemplateById } from './src/data/templates';

const INITIAL_STATE: StoryState = {
  currentDepth: 0,
  currentIndex: -1,
  path: [],
  history: [],
  currentScene: null,
  currentImageUrl: null,
  currentDebugPrompt: null,
  referenceImageUrl: null,
  activeParty: [], // New: Tracks valid reference URLs for current party
  refDebugPrompt: null,
  isEnding: false,
  prefetchCache: {}
};

function App() {
  // Social Story Builder State
  const [selectedTemplate, setSelectedTemplate] = useState<SocialStoryTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'selector' | 'profile' | 'custom' | 'story' | 'library'>('selector');
  const [customScenario, setCustomScenario] = useState<CustomScenarioInput | null>(null);
  const [socialStoryConfig, setSocialStoryConfig] = useState<SocialStoryConfig | null>(null);

  // Saved Stories State
  const [savedStories, setSavedStories] = useState<SavedSocialStory[]>([]);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const [storySaved, setStorySaved] = useState(false);

  // Social Story State
  const [socialStory, setSocialStory] = useState<SocialStoryState>({
    currentSceneIndex: 0,
    scenes: [],
    childCharacterRef: null,
    peopleRefs: new Map(),
    isComplete: false,
    isGenerating: false
  });

  // Legacy DreamWeaver State (will be removed later)
  const [gameState, setGameState] = useState<StoryState>(INITIAL_STATE);
  const [config, setConfig] = useState<StoryConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collection State
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [justUnlockedCharacter, setJustUnlockedCharacter] = useState<Character | null>(null);

  // Load characters from local storage on mount
  useEffect(() => {
    const loaded = localStorage.getItem('dreamweaver_characters');
    if (loaded) {
      try {
        setSavedCharacters(JSON.parse(loaded));
      } catch (e) {
        console.error("Failed to load collected characters", e);
      }
    }

    // Load saved social stories
    const stories = getSavedStories();
    setSavedStories(stories);
    console.log(`Loaded ${stories.length} saved stories`);

    // Debug: Check environment variables
    fetch('/api/debug')
      .then(res => res.json())
      .then(data => console.log("Environment Variable Status:", data))
      .catch(err => console.error("Failed to check env vars:", err));
  }, []);

  // Save characters whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('dreamweaver_characters', JSON.stringify(savedCharacters));
    } catch (e) {
      console.warn("Failed to save characters to localStorage (likely quota exceeded). This is expected with large images.", e);
    }
  }, [savedCharacters]);

  const handleDeleteCharacter = (id: string) => {
    if (window.confirm("Are you sure you want to remove this friend from your collection?")) {
      setSavedCharacters(prev => prev.filter(c => c.id !== id));
    }
  };

  /**
   * Helper: Relaxed search for characters.
   * Matches if either name contains the other (case-insensitive).
   * E.g. "Benny" matches "Benny the Gummy Bear"
   */
  const findMatchingCharacter = (name: string): Character | undefined => {
    const search = name.trim().toLowerCase();
    return savedCharacters.find(c => {
      const stored = c.name.trim().toLowerCase();
      return stored === search || stored.includes(search) || search.includes(stored);
    });
  };

  // Background Prefetching Logic
  useEffect(() => {
    const doPrefetch = async () => {
      if (!config || !gameState.currentScene || gameState.isEnding || !gameState.referenceImageUrl) return;

      const scene = gameState.currentScene;
      const currentDepth = gameState.currentDepth;

      const options = [scene.option_1, scene.option_2].filter(Boolean) as string[];

      for (const optText of options) {
        const cacheKey = `${currentDepth}-${optText}`;
        if (gameState.prefetchCache[cacheKey]) continue;

        try {
          const nextSceneData = await generateStoryStep(
            config.startingSentence,
            config.artStyle,
            gameState,
            optText,
            [] // No new known characters to inject during prefetch
          );

          // IMPORTANT: If a new character is detected, we CANNOT pre-generate the image
          // because we don't have their reference sheet yet (user must unlock it).
          // So we skip image generation in prefetch for unlock steps.
          if (nextSceneData.new_character) {
            console.log(`[Prefetch] New character '${nextSceneData.new_character.name}' detected for "${optText}". Skipping image generation.`);
            continue;
          }

          const { imageUrl, debugPrompt } = await generateImage(
            nextSceneData.image_description,
            config.artStyle,
            gameState.referenceImageUrl
          );

          const prefetchedStep: StoryStep = {
            scene: nextSceneData,
            imageUrl: imageUrl,
            debugPrompt: debugPrompt,
            activeParty: gameState.activeParty, // Assume same party
            referenceImageUrl: gameState.referenceImageUrl // Assume same ref
          };

          setGameState(prev => ({
            ...prev,
            prefetchCache: {
              ...prev.prefetchCache,
              [cacheKey]: prefetchedStep
            }
          }));
        } catch (err) {
          console.warn(`[Prefetch] Failed for option "${optText}":`, err);
        }
      }
    };

    const timer = setTimeout(doPrefetch, 1000);
    return () => clearTimeout(timer);
  }, [gameState.currentScene, gameState.currentDepth, gameState.referenceImageUrl, config, gameState.isEnding, gameState.activeParty]);


  const startStory = async (userConfig: StoryConfig) => {
    setConfig(userConfig);
    setIsLoading(true);
    setError(null);
    setJustUnlockedCharacter(null);

    try {
      // 1. IDENTIFY KNOWN CHARACTERS BEFORE GENERATION
      // This prevents the AI from hallucinating a "Fox" description for a character named "Flurry" who is actually a Snowman.
      const preLoadedCharacters: Character[] = [];
      const initialPartyMap = new Map<string, Character | { imageUrl: string, name: string }>();

      // A. Explicit Selection
      if (userConfig.selectedCharacterIds) {
        userConfig.selectedCharacterIds.forEach(id => {
          const c = savedCharacters.find(char => char.id === id);
          if (c) {
            preLoadedCharacters.push(c);
            initialPartyMap.set(c.id, c);
          }
        });
      }

      // B. Scan Prompt for existing characters
      const promptLower = userConfig.startingSentence.toLowerCase();
      savedCharacters.forEach(c => {
        // Avoid duplicates if already selected
        if (initialPartyMap.has(c.id)) return;

        // Use word boundary to avoid matching "Cat" in "Catherine"
        const regex = new RegExp(`\\b${c.name.toLowerCase()}\\b`);
        if (regex.test(promptLower)) {
          console.log(`Found existing character in prompt text: ${c.name}`);
          preLoadedCharacters.push(c);
          initialPartyMap.set(c.id, c);
        }
      });

      // Prepare context for API
      const knownCharContext = preLoadedCharacters.map(c => ({
        name: c.name,
        description: c.description
      }));

      // 2. GENERATE TEXT FOR FIRST SCENE
      const sceneData = await generateStoryStep(
        userConfig.startingSentence,
        userConfig.artStyle,
        INITIAL_STATE,
        null,
        knownCharContext // Pass the known descriptions!
      );

      // 3. BUILD INITIAL PARTY & REFERENCE IMAGE
      let refImageUrl: string = "";
      let refDebug: string = "";

      // C. HANDLE MAIN CHARACTER FROM AI RESPONSE
      if (sceneData.character_concept) {
        const mainCharName = sceneData.character_name || "Main Character";

        // Check if this "Main Character" identified by AI matches anyone already in our party?
        // Using relaxed matching to catch "Benny" == "Benny the Gummy Bear"
        const existingPartyMember = Array.from(initialPartyMap.values()).find(c => {
          const cName = c.name.toLowerCase();
          const mName = mainCharName.toLowerCase();
          return cName.includes(mName) || mName.includes(cName);
        });

        if (existingPartyMember) {
          console.log(`AI Main Character '${mainCharName}' matched to party member '${existingPartyMember.name}'`);
          refDebug += `Matched Party Member: ${existingPartyMember.name} (AI said: ${mainCharName}). `;
        } else {
          // If not in current party, check if they exist in global DB?
          const existingGlobal = findMatchingCharacter(mainCharName);

          if (existingGlobal) {
            console.log(`AI Main Character '${mainCharName}' matched to global collection '${existingGlobal.name}'`);
            initialPartyMap.set(existingGlobal.id, existingGlobal);
            refDebug += `Matched Global Collection: ${existingGlobal.name}. `;
          } else {
            // Truly new character -> Generate
            console.log(`Generating NEW Main Character: ${mainCharName}`);
            const refResult = await generateCharacterReference(
              sceneData.character_concept,
              userConfig.artStyle
            );

            if (refResult.imageUrl) {
              refDebug += `Generated New Main: ${mainCharName}. `;

              // Save this new main character immediately
              const newChar: Character = {
                id: crypto.randomUUID(),
                name: mainCharName,
                description: sceneData.character_concept,
                imageUrl: refResult.imageUrl,
                collectedAt: Date.now()
              };
              setSavedCharacters(prev => [newChar, ...prev]);
              setJustUnlockedCharacter(newChar); // Show unlock celebration

              // Add to party
              initialPartyMap.set(newChar.id, newChar);
            }
          }
        }
      } else {
        // Fallback: If no character concept returned (rare), and party is empty
        if (initialPartyMap.size === 0) {
          const refResult = await generateCharacterReference(
            "A cute character fitting the story: " + userConfig.startingSentence,
            userConfig.artStyle
          );
          if (refResult.imageUrl) {
            refDebug += "Fallback Gen. ";
            initialPartyMap.set("fallback", { name: "Hero", imageUrl: refResult.imageUrl });
          }
        }
      }

      // D. MERGE IMAGES
      const partyImages = Array.from(initialPartyMap.values()).map(c => c.imageUrl);

      if (partyImages.length > 1) {
        refDebug += `Merging ${partyImages.length} characters.`;
        refImageUrl = await mergeMultipleImages(partyImages);
      } else if (partyImages.length === 1) {
        refImageUrl = partyImages[0];
      }

      // 4. GENERATE SCENE IMAGE
      const { imageUrl, debugPrompt } = await generateImage(
        sceneData.image_description,
        userConfig.artStyle,
        refImageUrl
      );

      const newStep: StoryStep = {
        scene: sceneData,
        imageUrl: imageUrl,
        debugPrompt: debugPrompt,
        activeParty: partyImages,
        referenceImageUrl: refImageUrl
      };

      setGameState({
        ...INITIAL_STATE,
        currentDepth: 1,
        currentIndex: 0,
        history: [newStep],
        path: [],
        currentScene: sceneData,
        currentImageUrl: imageUrl,
        currentDebugPrompt: debugPrompt,
        referenceImageUrl: refImageUrl,
        activeParty: partyImages,
        refDebugPrompt: refDebug,
      });

    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred starting the story.";
      console.error(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice: string) => {
    if (!config) return;
    setError(null);
    setJustUnlockedCharacter(null);

    // 1. CHECK CACHE
    const cacheKey = `${gameState.currentDepth}-${choice}`;
    const cachedStep = gameState.prefetchCache[cacheKey];

    let nextSceneData;
    let nextImageUrl;
    let nextDebugPrompt;

    // We start with the current party/reference
    let nextParty = [...gameState.activeParty];
    let nextReferenceImage = gameState.referenceImageUrl;

    // A. GET TEXT (Either from cache or fetch)
    if (cachedStep) {
      nextSceneData = cachedStep.scene;
      // We might have image too, but we need to verify if party matches
      nextImageUrl = cachedStep.imageUrl;
      nextDebugPrompt = cachedStep.debugPrompt;
    } else {
      setIsLoading(true);
      try {
        nextSceneData = await generateStoryStep(
          config.startingSentence,
          config.artStyle,
          gameState,
          choice,
          [] // No specific known characters to inject mid-story
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error generating story");
        setIsLoading(false);
        return;
      }
    }

    // B. CHECK FOR NEW CHARACTER UNLOCK (OR RETURNING FRIEND)
    if (nextSceneData.new_character) {
      const newName = nextSceneData.new_character.name;

      // Use relaxed matching here too
      const existingCharacter = findMatchingCharacter(newName);

      // Flag to track if we need to regenerate the composite reference
      let partyUpdated = false;

      if (existingCharacter) {
        console.log(`Returning friend detected: ${newName} -> ${existingCharacter.name}`);
        // Check if they are already in the party to avoid duplicates
        if (!nextParty.includes(existingCharacter.imageUrl)) {
          nextParty.push(existingCharacter.imageUrl);
          partyUpdated = true;
          // Show them as "Unlocked" to acknowledge their arrival
          setJustUnlockedCharacter(existingCharacter);
        }
      } else {
        // TRULY NEW CHARACTER
        setIsLoading(true);
        try {
          console.log(`Generating reference for new character: ${newName}`);
          const charResult = await generateCharacterReference(
            nextSceneData.new_character.description,
            config.artStyle
          );

          if (charResult.imageUrl) {
            const newChar: Character = {
              id: crypto.randomUUID(),
              name: newName,
              description: nextSceneData.new_character.description,
              imageUrl: charResult.imageUrl,
              collectedAt: Date.now()
            };

            setSavedCharacters(prev => [newChar, ...prev]);
            setJustUnlockedCharacter(newChar);

            // Add new friend to the party list
            nextParty.push(charResult.imageUrl);
            partyUpdated = true;
          }
        } catch (e) {
          console.error("Failed to generate unlock card", e);
        }
      }

      // If the party changed (new or returning), we MUST merge and clear cached image
      if (partyUpdated) {
        console.log("Merging updated party images:", nextParty.length);
        try {
          const compositeRef = await mergeMultipleImages(nextParty);
          nextReferenceImage = compositeRef;
          // Invalidate cached image because reference changed
          nextImageUrl = undefined;
        } catch (e) {
          console.error("Failed to merge party images", e);
        }
      }
    }

    // C. GENERATE SCENE IMAGE (If needed)
    if (!nextImageUrl) {
      setIsLoading(true);
      try {
        const imgResult = await generateImage(
          nextSceneData!.image_description,
          config.artStyle,
          nextReferenceImage
        );
        nextImageUrl = imgResult.imageUrl;
        nextDebugPrompt = imgResult.debugPrompt;
      } catch (err) {
        console.error(err);
      }
    }

    // D. UPDATE STATE
    const nextDepth = gameState.currentDepth + 1;

    // Store snapshot of party state in this step
    const newStep: StoryStep = {
      scene: nextSceneData!,
      imageUrl: nextImageUrl!,
      debugPrompt: nextDebugPrompt!,
      activeParty: nextParty,
      referenceImageUrl: nextReferenceImage
    };

    const historyUpToNow = gameState.history.slice(0, gameState.currentIndex + 1);
    const pathUpToNow = gameState.path.slice(0, gameState.currentIndex);

    setGameState(prev => ({
      ...prev,
      currentDepth: nextDepth,
      currentIndex: prev.currentIndex + 1,
      path: [...pathUpToNow, choice],
      history: [...historyUpToNow, newStep],
      currentScene: nextSceneData!,
      currentImageUrl: nextImageUrl!,
      currentDebugPrompt: nextDebugPrompt!,

      // Update persistent tracker to new state
      activeParty: nextParty,
      referenceImageUrl: nextReferenceImage,

      isEnding: nextSceneData!.is_ending
    }));

    setIsLoading(false);
  };

  const handleBack = () => {
    if (gameState.currentIndex <= 0) {
      restart();
      return;
    }
    const newIndex = gameState.currentIndex - 1;
    const previousStep = gameState.history[newIndex];

    setGameState(prev => ({
      ...prev,
      currentDepth: prev.currentDepth - 1,
      currentIndex: newIndex,
      currentScene: previousStep.scene,
      currentImageUrl: previousStep.imageUrl,
      currentDebugPrompt: previousStep.debugPrompt,

      // CRITICAL: Restore the party state from that moment in history
      activeParty: previousStep.activeParty || [],
      referenceImageUrl: previousStep.referenceImageUrl,

      isEnding: false
    }));
  };

  const restart = () => {
    setGameState(INITIAL_STATE);
    setConfig(null);
    setError(null);
    setJustUnlockedCharacter(null);
  };


  // Handlers for ScenarioSelector
  const handleSelectTemplate = (template: SocialStoryTemplate) => {
    console.log('Selected template:', template);
    setSelectedTemplate(template);
    setStorySaved(false); // Reset save status
    setCurrentStoryId(null); // Reset current story ID
    setViewMode('profile'); // Will show child profile form next
  };

  const handleSelectCustom = () => {
    console.log('Creating custom scenario');
    setStorySaved(false); // Reset save status
    setCurrentStoryId(null); // Reset current story ID
    setViewMode('custom'); // Will show custom scenario form next
  };

  const handleSelectExample = (exampleId: string) => {
    console.log('Selected example:', exampleId);

    const example = EXAMPLE_STORIES_DATA.find(e => e.id === exampleId);
    if (!example) {
      console.error('Example not found:', exampleId);
      return;
    }

    const template = getTemplateById(example.templateId);
    if (!template) {
      console.error('Template not found for example:', example.templateId);
      return;
    }

    // Set state for "New Story" mode
    setStorySaved(false);
    setCurrentStoryId(null);
    setSelectedTemplate(template);
    setCustomScenario(null);

    // Trigger generation immediately with example config
    generateStory(example.config, template, null);
  };

  // Handlers for Saved Stories
  const handleViewLibrary = () => {
    console.log('Viewing saved stories library');
    setViewMode('library');
  };

  const handleSaveStory = () => {
    if (!socialStoryConfig) return;

    const savedStory = saveStory(socialStory, socialStoryConfig, selectedTemplate, customScenario);

    if (savedStory) {
      setStorySaved(true);
      setCurrentStoryId(savedStory.id);
      // Reload saved stories list
      setSavedStories(getSavedStories());
      alert('Story saved successfully! ✅');
    }
  };

  const handleViewSavedStory = (story: SavedSocialStory) => {
    console.log('Viewing saved story:', story.id);

    // Update last viewed timestamp
    updateLastViewed(story.id);
    setSavedStories(getSavedStories());

    // Convert saved story back to active state
    setSocialStory({
      currentSceneIndex: 0,
      scenes: story.scenes,
      childCharacterRef: story.childCharacterRef,
      peopleRefs: new Map(Object.entries(story.peopleRefs)), // Convert Record back to Map
      isComplete: true,
      isGenerating: false
    });

    // Set config from saved story
    setSocialStoryConfig({
      childName: story.childName,
      childAppearance: '', // Not stored in saved story
      artStyle: 'children\'s book illustration', // Default
      templateId: story.templateId,
      customizations: {}
    });

    setCurrentStoryId(story.id);
    setStorySaved(true);
    setViewMode('story');
  };

  const handleDeleteStory = (id: string) => {
    const success = deleteStory(id);
    if (success) {
      setSavedStories(getSavedStories());
      console.log('Story deleted:', id);
    }
  };

  const generateStory = async (config: SocialStoryConfig, template: SocialStoryTemplate | null, custom: CustomScenarioInput | null) => {
    setIsLoading(true);
    setError(null);
    setSocialStoryConfig(config);
    setViewMode('story');

    try {
      const totalScenes = template?.estimatedScenes || custom?.estimatedScenes || 6;
      const generatedScenes: SocialStoryScene[] = [];

      // STAGE 5: Generate child character reference first
      console.log('Generating child character reference...');
      const childRefResult = await generateCharacterReference(
        config.childAppearance,
        config.artStyle
      );

      // Store child reference URL in local variable for immediate use
      const childCharacterRefUrl = childRefResult.imageUrl;

      setSocialStory(prev => ({
        ...prev,
        childCharacterRef: childCharacterRefUrl
      }));

      console.log('Child character reference created:', childCharacterRefUrl);

      // Track people references in local Map for immediate access
      const peopleRefsMap = new Map<string, string>();

      // Generate all scenes sequentially
      for (let i = 1; i <= totalScenes; i++) {
        console.log(`Generating scene ${i} of ${totalScenes}...`);

        const scene = await generateSocialStoryScene(
          i,
          totalScenes,
          template,
          custom,
          config.childName,
          generatedScenes
        );

        generatedScenes.push(scene);

        // STAGE 5: Generate character reference for newly introduced people
        if (scene.person_introduced) {
          // CHECK: Do we already have a reference for this role?
          if (peopleRefsMap.has(scene.person_introduced.role)) {
            console.log(`Skipping reference generation for ${scene.person_introduced.role} (already exists).`);
          } else {
            console.log(`Generating NEW reference for ${scene.person_introduced.name} (${scene.person_introduced.role})...`);

            const personRefResult = await generateCharacterReference(
              scene.person_introduced.description,
              config.artStyle
            );

            // Store in local map for immediate use
            peopleRefsMap.set(scene.person_introduced.role, personRefResult.imageUrl);

            setSocialStory(prev => {
              const newPeopleRefs = new Map(prev.peopleRefs);
              newPeopleRefs.set(scene.person_introduced!.role, personRefResult.imageUrl);
              return {
                ...prev,
                peopleRefs: newPeopleRefs
              };
            });

            console.log(`Reference created for ${scene.person_introduced.role}:`, personRefResult.imageUrl);
          }
        }

        // STAGE 6: Generate scene image with character references
        console.log(`Generating image for scene ${i}...`);

        // Collect character references for this scene
        const characterRefsForScene: string[] = [];

        // Always include the child (use local variable, not state)
        if (childCharacterRefUrl) {
          characterRefsForScene.push(childCharacterRefUrl);
        }

        // Only add the person relevant to THIS scene (if any)
        // We do NOT add all previously introduced people, as that confuses the AI 
        // regarding who is who in the reference sheet.
        if (scene.person_introduced) {
          const peopleRef = peopleRefsMap.get(scene.person_introduced.role);
          if (peopleRef) {
            characterRefsForScene.push(peopleRef);
          }
        }

        // Merge character references into composite
        let compositeRef: string | null = null;
        if (characterRefsForScene.length > 0) {
          console.log(`Merging ${characterRefsForScene.length} character references...`);
          compositeRef = await mergeMultipleImages(characterRefsForScene);
        }

        // ENHANCE PROMPT: Explicitly inject character descriptions
        // This ensures the model knows "The Doctor" is "Old, white hair" even if the reference is weak.
        let enhancedPrompt = "";

        // 1. Add Child Description
        enhancedPrompt += `${config.childName} is ${config.childAppearance}. `;

        // 2. Add Other Person Description (if applicable)
        if (scene.person_introduced) {
          enhancedPrompt += `${scene.person_introduced.name} (${scene.person_introduced.role}) is ${scene.person_introduced.description}. `;
        } else {
          // For scenes with recurring characters, we might need to look them up from previous scenes
          // checking generatedScenes to find the description of the role
          const sceneText = scene.scene_text + " " + scene.image_description;
          peopleRefsMap.forEach((url, role) => {
            // If the role is mentioned in this scene, try to find their description
            if (sceneText.toLowerCase().includes(role.toLowerCase())) {
              const originalIntroduction = generatedScenes.find(s => s.person_introduced?.role === role);
              if (originalIntroduction && originalIntroduction.person_introduced) {
                enhancedPrompt += `${originalIntroduction.person_introduced.name} is ${originalIntroduction.person_introduced.description}. `;
              }
            }
          });
        }

        enhancedPrompt += scene.image_description;

        console.log(`Enhanced Prompt for Scene ${i}:`, enhancedPrompt);

        // Generate scene image using composite reference AND enhanced text prompt
        const sceneImageResult = await generateImage(
          enhancedPrompt,
          config.artStyle,
          compositeRef
        );

        console.log(`Scene ${i} image generated:`, sceneImageResult.imageUrl);

        // Update state with new scene including image
        setSocialStory(prev => ({
          ...prev,
          scenes: [...prev.scenes, {
            scene: scene,
            imageUrl: sceneImageResult.imageUrl,
            debugPrompt: sceneImageResult.debugPrompt
          }],
          isGenerating: i < totalScenes
        }));
      }

      setSocialStory(prev => ({
        ...prev,
        isComplete: true,
        isGenerating: false
      }));

      console.log('Story generation complete!', generatedScenes);

    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred generating the story.";
      console.error(err);
      setError(msg);
      setViewMode('selector'); // Go back on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = (config: SocialStoryConfig) => {
    console.log('Profile submitted:', config);
    generateStory(config, selectedTemplate, null);
  };

  const handleCustomSubmit = (scenarioInput: CustomScenarioInput, childConfig: Partial<SocialStoryConfig>) => {
    console.log('Custom scenario submitted:', scenarioInput, childConfig);
    setCustomScenario(scenarioInput);

    const fullConfig: SocialStoryConfig = {
      childName: childConfig.childName!,
      childAppearance: childConfig.childAppearance!,
      childAge: childConfig.childAge,
      artStyle: childConfig.artStyle!
    };

    generateStory(fullConfig, null, scenarioInput);
  };

  return (
    <div>
      {viewMode === 'selector' && (
        <ScenarioSelector
          onSelectTemplate={handleSelectTemplate}
          onSelectCustom={handleSelectCustom}
          onSelectExample={handleSelectExample}
          onViewLibrary={handleViewLibrary}
          savedStoriesCount={savedStories.length}
        />
      )}

      {viewMode === 'profile' && selectedTemplate && (
        <ChildProfileForm
          selectedTemplate={selectedTemplate}
          onSubmit={handleProfileSubmit}
          onBack={() => setViewMode('selector')}
        />
      )}

      {viewMode === 'custom' && (
        <CustomScenarioForm
          onSubmit={handleCustomSubmit}
          onBack={() => setViewMode('selector')}
        />
      )}

      {viewMode === 'library' && (
        <SavedStoriesLibrary
          savedStories={savedStories}
          onViewStory={handleViewSavedStory}
          onDeleteStory={handleDeleteStory}
          onBack={() => setViewMode('selector')}
          onCreateNew={() => setViewMode('selector')}
        />
      )}

      {viewMode === 'story' && socialStoryConfig && (
        <SocialStoryViewer
          socialStory={socialStory}
          config={socialStoryConfig}
          isLoading={isLoading}
          onSave={!storySaved && !currentStoryId ? handleSaveStory : undefined}
          isSavedStory={!!currentStoryId}
          onBack={() => {
            if (currentStoryId) {
              // If viewing a saved story, go back to library
              setViewMode('library');
            } else {
              // If viewing a newly generated story, go back to selector
              setViewMode('selector');
            }
            setSocialStory({
              currentSceneIndex: 0,
              scenes: [],
              childCharacterRef: null,
              peopleRefs: new Map(),
              isComplete: false,
              isGenerating: false
            });
            setCurrentStoryId(null);
            setStorySaved(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
