
import React, { useState, useRef, useEffect } from 'react';
import { StoryConfig, Character } from '../types';
import { isConfigured } from '../config';

interface StartScreenProps {
  onStart: (config: StoryConfig) => void;
  isLoading: boolean;
  savedCharacters: Character[];
  onDeleteCharacter: (id: string) => void;
}

const KID_FRIENDLY_PROMPTS = [
  "A brave little raccoon finds a glowing map in the attic.",
  "A tiny dragon learns to breathe glitter instead of fire.",
  "A robot who loves to garden finds a mysterious seed.",
  "A cat detective solves the mystery of the missing tuna.",
  "A magical library where books fly like birds.",
  "A polar bear who wants to learn how to surf.",
  "A squirrel who accidentally becomes king of the forest.",
  "A young wizard loses their wand in a candy forest.",
  "A puppy discovers a secret door in the doghouse.",
  "A friendly ghost wants to join a marching band.",
  "A mermaid explores a sunken city made of lego blocks.",

  // --- 100 NEW PROMPTS ---
  "A shy unicorn paints rainbows in the sky when no one is looking.",
  "A baby owl tries to stay awake for the first sunrise.",
  "A penguin invents a flying machine made of ice.",
  "A tiny pirate sails across a bathtub ocean.",
  "A bunny finds boots that let it jump over mountains.",
  "A hamster astronaut discovers cheese-shaped planets.",
  "A young witch’s broom keeps giggling and floating away.",
  "A mouse builds a tiny hotel inside an old boot.",
  "A fox learns it can talk to fireflies.",
  "A dragon who’s allergic to treasure goes on a quest for tissues.",
  "A bear cub finds a snow globe that controls the weather.",
  "A turtle trains for the world’s slowest race.",
  "A cloud that wants to become a pillow floats to Earth.",
  "A brave ant leads an expedition into the giant’s picnic.",
  "A lion who loves ballet gets stage fright.",
  "A giraffe discovers a secret elevator to the moon.",
  "A frog opens the first swamp bakery.",
  "A puppy becomes invisible every time it sneezes.",
  "A dolphin finds a magical seashell that sings.",
  "A hedgehog becomes a famous painter using its quills as brushes.",
  "A snowman dreams of going to summer camp.",
  "A kangaroo finds a treasure chest inside its pouch.",
  "A baby dragon befriends a knight who is scared of everything.",
  "A group of vegetables plan a daring escape from the fridge.",
  "A wizard’s hat runs away to become a cowboy hat.",
  "A young wolf wants to learn how to play the flute.",
  "A ladybug discovers a hidden city under a leaf.",
  "A cat opens a café that serves warm milk and cookies.",
  "A chipmunk finds headphones that let it hear tree whispers.",
  "A squirrel builds a roller coaster for acorns.",
  "A fox cub wishes upon a star and grows wings.",
  "A snail decides to run a marathon… eventually.",
  "A snowflake tries not to melt on its first big adventure.",
  "A moose discovers a magical hot cocoa fountain.",
  "A young witch accidentally turns her shadow into a pet.",
  "A puppy explorer finds a map drawn in pawprints.",
  "A unicorn babysits a group of mischievous kittens.",
  "A firefly becomes the lighthouse keeper of the forest.",
  "A robot learns how to dream.",
  "A sloth finds a magic alarm clock that makes everything too fast.",
  "A bee invents a new kind of honey that sparkles.",
  "A raccoon forms a band using trash-can instruments.",
  "A dragon tries to enter a sandcastle contest without melting anything.",
  "A seal discovers a treasure chest of lost socks.",
  "A little girl becomes friends with the wind.",
  "A star falls from the sky and asks for help finding its way home.",
  "A parrot becomes a detective for jungle mysteries.",
  "A fox and a hedgehog start a secret bakery in a tree stump.",
  "A baby yeti wants to learn how to whistle.",
  "A magical elevator in a tree takes animals to different seasons.",
  "A raccoon finds an old camera that shows the future.",
  "A duck builds a boat powered by quacks.",
  "A shy monster is scared of human children.",
  "A sheep who can't fall asleep tries counting humans.",
  "A kangaroo opens a bounce house made of clouds.",
  "A mouse knight sets off on a quest riding a beetle.",
  "A penguin writes letters to creatures on land.",
  "A young troll wants to become a poet.",
  "A tiger learns how to paint stripes on other animals.",
  "A koala discovers a magical eucalyptus tree.",
  "A baby dragon dreams of becoming a librarian.",
  "A fox invents a machine that turns dreams into drawings.",
  "A parakeet becomes the conductor of a bird orchestra.",
  "A mischievous cloud keeps raining confetti.",
  "A moose wants to enter a baking competition.",
  "A mer-kitten swims through coral mazes looking for clues.",
  "A firefly lantern guides lost toys home.",
  "A llama becomes an explorer of ancient alpaca ruins.",
  "A squirrel discovers a portal inside a hollow acorn.",
  "A puppy joins a team of magical mail carriers.",
  "A cat astronaut finds a floating yarn ball in space.",
  "A dragon opens a hot cocoa stand atop a mountain.",
  "A polar bear cub teaches snowmen how to dance.",
  "A baby whale hears an echo that talks back.",
  "A fox and a raccoon find a tree that grows glowing berries.",
  "A robot chef tries to make the perfect pancake.",
  "A tiny knight defends a castle made of blocks.",
  "A group of stars form a band in the night sky.",
  "A cactus learns how to hug without poking anyone.",
  "A little girl opens a door in her closet to a world of floating islands.",
  "A penguin discovers a cave full of singing crystals.",
  "A fish wants to fly and teams up with a seagull.",
  "A dragon egg hatches into twins—one fiery, one frosty.",
  "A group of crayons come to life and draw adventures.",
  "A frog becomes mayor of a lily-pad village.",
  "A puppy wants to win the 'Best Howl' contest.",
  "A fox finds a glowing pebble that grants small wishes.",
  "A chipmunk starts a detective agency.",
  "A friendly monster opens a bedtime story clinic.",
  "A young wizard plants a garden of magical fruits.",
  "A turtle builds an underwater amusement park.",
  "A cloud learns how to make shapes on purpose.",
  "A flock of birds discovers a floating treehouse.",
  "A starfish writes secret messages in the tide.",
  "A snow leopard cub finds a scarf that changes colors.",
  "A tiny dragon goes to its first day of school.",
  "A squirrel becomes a space explorer on a rocket acorn.",
  "A fox befriends the moon and visits it every night."
];


const StartScreen: React.FC<StartScreenProps> = ({ onStart, isLoading, savedCharacters, onDeleteCharacter }) => {
  const [sentence, setSentence] = useState(() => {
    const randomIndex = Math.floor(Math.random() * KID_FRIENDLY_PROMPTS.length);
    return KID_FRIENDLY_PROMPTS[randomIndex];
  });

  const [isListening, setIsListening] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // Track selected characters for new story
  const [searchQuery, setSearchQuery] = useState("");

  const recognitionRef = useRef<any>(null);

  const configReady = isConfigured();

  // Reset search when modal closes
  useEffect(() => {
    if (!showCollection) {
      setSearchQuery("");
    }
  }, [showCollection]);

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * KID_FRIENDLY_PROMPTS.length);
    setSentence(KID_FRIENDLY_PROMPTS[randomIndex]);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSentence((prev) => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} ${transcript}` : transcript;
      });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sentence.trim()) {
      onStart({
        startingSentence: sentence,
        artStyle: 'Ghibli-inspired watercolor but with clean outlines'
      });
    }
  };

  // Toggle selection in collection
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 3) {
          return prev; // Max 3
        }
        return [...prev, id];
      }
    });
  };

  // Start adventure with selected characters
  const handleStartWithSelection = () => {
    const selectedChars = savedCharacters.filter(c => selectedIds.includes(c.id));
    if (selectedChars.length === 0) return;

    const names = selectedChars.map(c => c.name);
    let prompt = "";

    if (names.length === 1) {
      prompt = `${names[0]} went on a magical adventure to find a secret treasure.`;
    } else if (names.length === 2) {
      prompt = `${names[0]} and ${names[1]} teamed up to solve a mysterious puzzle.`;
    } else {
      const last = names.pop();
      prompt = `${names.join(', ')}, and ${last} joined forces for an epic journey.`;
    }

    setShowCollection(false);
    // Note: We do NOT clear selectedIds here so they can be passed to onStart
    onStart({
      startingSentence: prompt,
      artStyle: 'Ghibli-inspired watercolor but with clean outlines',
      selectedCharacterIds: selectedIds // Pass the explicit IDs
    });
    setSelectedIds([]); // Reset after start
  };

  if (!configReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-red-50 border-2 border-red-200 rounded-xl mx-4 mt-10">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Configuration Needed</h2>
        <p className="text-red-600 mb-4">
          The Azure API keys and endpoints have not been configured yet.
        </p>
        <p className="text-slate-600 mb-6">
          Please open <code>config.ts</code> in your code editor and replace the placeholders.
        </p>
      </div>
    );
  }

  // Filter characters for display
  const filteredCharacters = savedCharacters.filter(char => {
    const q = searchQuery.toLowerCase();
    return char.name.toLowerCase().includes(q) || char.description.toLowerCase().includes(q);
  });

  // --- Collection Modal ---
  if (showCollection) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#fffdf5] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">

          <div className="p-6 border-b border-amber-200 bg-amber-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-story font-bold text-indigo-900">My Character Collection</h2>
                <p className="text-sm text-slate-500 font-ui mt-1">Select up to 3 friends to start a story!</p>
              </div>
              <button
                onClick={() => {
                  setShowCollection(false);
                  setSelectedIds([]);
                }}
                className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 hover:bg-slate-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-indigo-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none bg-white/80 font-ui text-indigo-900 placeholder-indigo-300 transition-all"
                placeholder="Search by name or description..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pb-24">
            {savedCharacters.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <span className="text-6xl mb-4">📖</span>
                <p className="text-2xl font-story text-slate-500">Your collection is empty.</p>
                <p className="text-slate-400 mt-2">Go on adventures to meet new friends!</p>
              </div>
            ) : filteredCharacters.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <span className="text-4xl mb-4">🔍</span>
                <p className="text-xl font-story text-slate-500">No friends found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 font-bold font-ui underline"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredCharacters.map(char => {
                  const isSelected = selectedIds.includes(char.id);
                  return (
                    <div
                      key={char.id}
                      onClick={() => toggleSelection(char.id)}
                      className={`bg-white rounded-xl shadow-lg border overflow-hidden group relative cursor-pointer transition-all duration-300
                        ${isSelected ? 'ring-4 ring-indigo-500 transform scale-105 border-indigo-500' : 'border-slate-100 hover:border-indigo-200'}
                      `}
                    >
                      <div className="aspect-square bg-slate-100 overflow-hidden relative">
                        <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />

                        {/* Selected Indicator Overlay */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-indigo-600 text-white rounded-full p-2 shadow-lg animate-pop-in">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className={`text-lg font-bold font-ui mb-1 ${isSelected ? 'text-indigo-600' : 'text-indigo-900'}`}>{char.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{char.description}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCharacter(char.id);
                          if (isSelected) toggleSelection(char.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-slate-300 hover:text-red-500 shadow-sm transition-all hover:bg-red-50"
                        title="Remove from collection"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-slate-200 flex justify-between items-center shadow-lg">
            <div className="text-sm font-ui text-slate-500 px-2">
              {selectedIds.length > 0
                ? `${selectedIds.length} friend${selectedIds.length > 1 ? 's' : ''} selected`
                : 'Select friends to start'}
            </div>
            <button
              disabled={selectedIds.length === 0}
              onClick={handleStartWithSelection}
              className={`px-8 py-3 rounded-xl font-bold font-ui text-lg transition-all shadow-md flex items-center gap-2
                 ${selectedIds.length > 0
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
               `}
            >
              Go on an adventure! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Start Screen ---
  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] bg-amber-50 rounded-r-lg md:rounded-r-3xl relative perspective-1000 mt-10 animate-pop-in">

      {/* Left Page (Decoration) */}
      <div className="w-full md:w-1/2 p-10 border-b-2 md:border-b-0 md:border-r-2 border-amber-200/50 bg-[#fffdf5] rounded-t-lg md:rounded-l-3xl md:rounded-tr-none relative overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center mt-8">
          <h1 className="text-5xl lg:text-6xl font-story font-bold text-indigo-900 mb-4 tracking-tight">
            Dream<span className="text-indigo-600">Weaver</span>
          </h1>
          <p className="text-slate-500 font-ui text-lg italic">Where stories come to life</p>
        </div>

        <div className="relative z-10 flex justify-center my-6">
          {/* Collection Button */}
          <button
            onClick={() => setShowCollection(true)}
            className="flex flex-col items-center gap-2 group"
            title="View Collected Characters"
          >
            <div className="relative">
              <div className="w-16 h-20 bg-indigo-600 rounded-md shadow-md group-hover:rotate-3 transition-transform duration-300 border-2 border-white flex items-center justify-center">
                <span className="text-2xl">📒</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {savedCharacters.length}
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 group-hover:text-indigo-600">My Collection</span>
          </button>
        </div>

        <div className="relative z-10 text-center text-amber-800/40 text-sm font-serif">
          Vol. 1 &bull; First Edition
        </div>
      </div>

      {/* Right Page (Interaction) */}
      <div className="w-full md:w-1/2 p-10 bg-[#fffdf5] rounded-b-lg md:rounded-r-3xl md:rounded-bl-none relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 h-full flex flex-col justify-center space-y-8">

          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="block text-xl font-story text-slate-800">
                Once upon a time...
              </label>
              <button
                type="button"
                onClick={handleRandomize}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-bold flex items-center gap-1 transition-colors font-ui uppercase tracking-wide bg-indigo-50 px-2 py-1 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Shuffle Idea
              </button>
            </div>

            <div className="relative group">
              <textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="w-full p-6 pb-14 rounded-xl border-2 border-transparent bg-indigo-50/50 hover:bg-white focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-story text-2xl leading-relaxed resize-none text-slate-700 shadow-inner custom-scrollbar"
                rows={5}
                placeholder="Write your story idea here..."
                disabled={isLoading}
                style={{ backgroundImage: 'linear-gradient(transparent, transparent 31px, #e0e7ff 31px, #e0e7ff 32px)', backgroundSize: '100% 32px', lineHeight: '32px' }}
              />

              <button
                type="button"
                onClick={handleVoiceInput}
                className={`absolute left-4 bottom-4 p-2 rounded-full transition-all duration-300 z-20 flex items-center gap-2 group/mic ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-red-300/50 shadow-lg'
                    : 'bg-white/80 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 shadow-sm border border-indigo-100'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isListening ? 'animate-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isListening && <span className="text-xs font-bold pr-1">Listening...</span>}
              </button>

              <div className={`absolute -right-4 -bottom-4 transition-transform duration-700 ${isLoading ? 'translate-x-10 -translate-y-20 rotate-12 opacity-0' : 'opacity-100'}`}>
                <span className="text-4xl">🪶</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-xl font-ui shadow-lg transform transition-all relative overflow-hidden group
              ${isLoading
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0'
              }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Writing the story...
                </>
              ) : (
                'Start Adventure ✨'
              )}
            </span>
          </button>

          {isLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
              <div className="animate-scribble text-6xl">🪶</div>
            </div>
          )}
        </form>
      </div>
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 shadow-inner rounded-sm z-20"></div>
    </div>
  );
};

export default StartScreen;
