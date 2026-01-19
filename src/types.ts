
// ============================================================================
// SOCIAL STORY TYPES
// ============================================================================

export interface SocialStoryTemplate {
  id: string;
  title: string;
  category: 'medical' | 'school' | 'social' | 'daily-routine' | 'travel';
  description: string;
  icon: string; // emoji
  estimatedScenes: number;
  keyPeople: string[]; // e.g., ["dentist", "dental hygienist", "receptionist"]
  commonFears: string[]; // e.g., ["pain", "loud noises", "unfamiliar people"]
  ageRange: [number, number]; // e.g., [3, 8]
}

export interface SocialStoryConfig {
  templateId?: string; // undefined for custom scenarios
  isExample?: boolean; // true for pre-made examples
  exampleId?: string; // ID of example story
  childName: string;
  childAppearance: string; // Physical description for character generation
  childAge?: number;
  customizations?: {
    specificLocation?: string; // e.g., "Dr. Smith's office on Main Street"
    specificPeople?: { role: string; name: string }[]; // e.g., [{role: "dentist", name: "Dr. Garcia"}]
    additionalConcerns?: string[]; // Parent can add specific worries
  };
  artStyle: string;
}

export interface CustomScenarioInput {
  title: string; // e.g., "Going to Grandma's House"
  category: string; // Dropdown: medical, school, social, etc.
  description: string; // What happens in this scenario
  estimatedScenes: number; // Slider: 4-10 scenes
  keyPeople?: string[]; // Who will the child meet?
  commonConcerns?: string[]; // What might worry the child?
  specificDetails?: string; // Any special instructions
}

export interface PersonIntroduced {
  role: string; // e.g., "dentist"
  name: string;
  description: string; // Visual appearance
  what_they_do: string; // Their role in this scenario
}

export interface SocialStoryScene {
  scene_number: number;
  scene_title: string; // e.g., "Arriving at the Office"
  scene_text: string; // 2-4 sentences, present tense, second-person
  image_description: string;
  educational_note?: string; // Optional tip for parents
  person_introduced?: PersonIntroduced;
  is_final_scene: boolean;
}

export interface SocialStorySceneStep {
  scene: SocialStoryScene;
  imageUrl: string;
  debugPrompt: string;
}

export interface SocialStoryState {
  currentSceneIndex: number;
  scenes: SocialStorySceneStep[];
  childCharacterRef: string | null; // URL to child's character reference
  peopleRefs: Map<string, string>; // role -> reference image URL
  isComplete: boolean;
  isGenerating: boolean;
}

export interface PreMadeStory {
  id: string;
  templateId: string;
  title: string;
  description: string;
  isExample: true;
  childName: string; // Generic name like "Alex"
  scenes: {
    scene_number: number;
    scene_title: string;
    scene_text: string;
    imageUrl: string; // Pre-generated and stored in /public/examples/
    educational_note?: string;
  }[];
  tags: string[];
}

export interface SavedSocialStory {
  id: string;
  templateId?: string;
  customTitle?: string; // For custom scenarios
  childName: string;
  createdAt: number;
  lastViewed: number;
  scenes: SocialStorySceneStep[];
  childCharacterRef: string;
  peopleRefs: Record<string, string>; // Serialized version of Map
  thumbnail?: string; // First scene image
}

export interface SavedCustomScenario extends CustomScenarioInput {
  id: string;
  createdAt: number;
  usageCount: number;
  isTemplate: false;
}

// ============================================================================
// LEGACY DREAMWEAVER TYPES (Keep for reference, will be removed later)
// ============================================================================

export interface StoryConfig {
  startingSentence: string;
  artStyle: string;
  selectedCharacterIds?: string[];
}

export interface NewCharacterInfo {
  name: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  collectedAt: number;
}

export interface StoryResponse {
  scene_text: string;
  image_description: string;
  character_concept?: string; // For the main character (Depth 0)
  character_name?: string;    // Name of the main character (Depth 0)
  new_character?: NewCharacterInfo; // For new characters found during the story
  option_1: string | null;
  option_2: string | null;
  is_ending: boolean;
}

export interface StoryStep {
  scene: StoryResponse;
  imageUrl: string;
  debugPrompt: string;
  activeParty: string[]; // Snapshot of the party members (URLs) at this step
  referenceImageUrl: string | null; // The composite reference used for this step
}

export interface StoryState {
  currentDepth: number;
  currentIndex: number;
  path: string[];
  history: StoryStep[];
  currentScene: StoryResponse | null;
  currentImageUrl: string | null;
  currentDebugPrompt: string | null;
  referenceImageUrl: string | null;
  activeParty: string[]; // List of character image URLs currently in the party
  refDebugPrompt: string | null;
  isEnding: boolean;
  prefetchCache: Record<string, StoryStep>;
}

export interface ImageGenerationResult {
  imageUrl: string;
  debugPrompt: string;
}

export interface ApiConfig {
  textEndpoint: string;
  textKey: string;
  fluxGenEndpoint: string;
  fluxEditEndpoint: string;
  fluxKey: string;
}
