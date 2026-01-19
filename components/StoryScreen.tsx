import React, { useState } from 'react';
import { StoryResponse, StoryStep, Character } from '../types';
import { useTextReader } from '../hooks/useTextReader';

interface StoryScreenProps {
  scene: StoryResponse | null;
  imageUrl: string | null;
  debugPrompt: string | null;
  refImageUrl: string | null;
  refDebugPrompt: string | null;
  onChoice: (choice: string) => void;
  onBack: () => void;
  onRestart: () => void;
  isLoading: boolean;
  currentDepth: number;
  prefetchCache: Record<string, StoryStep>;
  unlockedCharacter: Character | null;
  onDismissUnlock: () => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({
  scene,
  imageUrl,
  debugPrompt,
  refImageUrl,
  refDebugPrompt,
  onChoice,
  onBack,
  onRestart,
  isLoading,
  currentDepth,
  prefetchCache,
  unlockedCharacter,
  onDismissUnlock
}) => {
  const [showDebug, setShowDebug] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);

  // --- Text Reader Integration ---
  const { speak, pause, resume, cancel, isPlaying, isPaused, currentWordIndex, supported } = useTextReader();

  // Handle auto-read on scene change
  React.useEffect(() => {
    if (autoReadEnabled && scene?.scene_text) {
      speak(scene.scene_text);
    } else if (!autoReadEnabled) {
      cancel();
    }
  }, [scene?.scene_text, autoReadEnabled, speak, cancel]);

  // Stop reading when component unmounts
  React.useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  if (!scene) return null;

  const hasImageFailed = !isLoading && !imageUrl;
  const isOption1Ready = scene.option_1 && prefetchCache[`${currentDepth}-${scene.option_1}`];
  const isOption2Ready = scene.option_2 && prefetchCache[`${currentDepth}-${scene.option_2}`];

  // --- Unlock Overlay ---
  if (unlockedCharacter) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="bg-white max-w-sm w-full rounded-3xl p-2 shadow-2xl animate-bounce-in relative overflow-hidden">
          {/* Confetti / Burst Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,223,0,0.2)_0%,rgba(255,255,255,0)_70%)] pointer-events-none"></div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-center text-white relative z-10">
            <h2 className="text-2xl font-bold font-ui mb-2 uppercase tracking-widest text-yellow-300 drop-shadow-sm">New Friend Found!</h2>

            <div className="bg-white p-2 rounded-xl shadow-lg my-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src={unlockedCharacter.imageUrl}
                alt={unlockedCharacter.name}
                className="w-full aspect-square object-cover rounded-lg border border-slate-100"
              />
            </div>

            <h3 className="text-3xl font-story font-bold mb-2">{unlockedCharacter.name}</h3>
            <p className="text-indigo-100 text-sm mb-6 px-4">{unlockedCharacter.description}</p>

            <button
              onClick={onDismissUnlock}
              className="w-full py-3 bg-yellow-400 text-indigo-900 font-bold font-ui rounded-xl shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all"
            >
              Add to Collection & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleReadAloud = () => {
    setAutoReadEnabled(prev => !prev);
  };

  const renderHighlightedText = (text: string) => {
    if (!isPlaying && !isPaused) return text;

    const words = text.split(' ');
    return words.map((word, index) => {
      const isCurrent = index === currentWordIndex;
      return (
        <span
          key={index}
          className={`transition-colors duration-200 ${isCurrent ? 'bg-yellow-200 text-slate-900 px-1 rounded' : ''
            }`}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-10">

      {/* Header: Progress + Back Button */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-3 text-indigo-900 font-bold font-ui rounded-xl bg-white/50 hover:bg-white transition-colors disabled:opacity-50 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full transition-all duration-500 shadow-sm border border-indigo-900/10
                ${step <= currentDepth ? 'bg-indigo-600 scale-110' : 'bg-white/60'}`}
            />
          ))}
        </div>

        <div className="w-20"></div>
      </div>

      {/* Main Story Card (Paper style) */}
      <div className="bg-white rounded-lg sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden p-6 sm:p-10 relative">

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="bg-indigo-50 p-6 rounded-full mb-6 animate-pulse">
              <svg className="h-16 w-16 text-indigo-600 animate-bounce" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19C12 19 8 16 8 12C8 8 12 2 12 2C12 2 16 8 16 12C16 16 12 19 12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-2xl font-story font-bold text-indigo-900 animate-pulse">Writing the next chapter...</p>
            <p className="text-sm font-ui text-indigo-500 mt-2">Generating illustrations & choices</p>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-video sm:aspect-[4/3] w-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 mb-8 group">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Story scene"
              className="w-full h-full object-cover animate-fade-in"
            />
          )}

          {hasImageFailed && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-400 p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-ui text-xl font-bold text-red-800">Image Generation Failed</span>
            </div>
          )}

          {/* Read Aloud Button (Overlaid on Image) */}
          {supported && (
            <button
              onClick={handleReadAloud}
              className={`absolute bottom-4 right-4 backdrop-blur-md p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10 ${autoReadEnabled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white/80 text-indigo-900 hover:bg-white'
                }`}
              title={autoReadEnabled ? "Stop Auto-Read" : "Start Auto-Read"}
            >
              {autoReadEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Story Text */}
        <div className="mb-10 text-center px-2 sm:px-8">
          <p className="font-story text-2xl sm:text-3xl leading-relaxed text-slate-800">
            {renderHighlightedText(scene.scene_text)}
          </p>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {!scene.is_ending ? (
            <>
              <button
                onClick={() => onChoice(scene.option_1!)}
                disabled={isLoading}
                className="p-6 text-left bg-indigo-50/50 rounded-2xl border-2 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-100 transition-all transform hover:-translate-y-1 active:translate-y-0 group relative overflow-hidden"
              >
                {isOption1Ready && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-pop-in z-10 border border-green-200">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>READY</span>
                  </div>
                )}
                <span className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 group-hover:text-indigo-600">Option 1</span>
                <span className="block text-xl font-ui font-bold text-slate-800 group-hover:text-indigo-900 leading-snug">{scene.option_1}</span>
              </button>

              <button
                onClick={() => onChoice(scene.option_2!)}
                disabled={isLoading}
                className="p-6 text-left bg-purple-50/50 rounded-2xl border-2 border-purple-100 hover:border-purple-400 hover:bg-purple-100 transition-all transform hover:-translate-y-1 active:translate-y-0 group relative overflow-hidden"
              >
                {isOption2Ready && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-pop-in z-10 border border-green-200">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>READY</span>
                  </div>
                )}
                <span className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 group-hover:text-purple-600">Option 2</span>
                <span className="block text-xl font-ui font-bold text-slate-800 group-hover:text-purple-900 leading-snug">{scene.option_2}</span>
              </button>
            </>
          ) : (
            <div className="col-span-full text-center pt-4">
              <h3 className="font-ui text-4xl font-bold text-indigo-400 mb-8">The End</h3>
              <button
                onClick={onRestart}
                className="px-10 py-4 bg-indigo-600 text-white font-bold font-ui text-xl rounded-full hover:bg-indigo-700 shadow-xl transition-transform hover:scale-105"
              >
                Start New Story
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Debug Info Toggle */}
      <div className="mt-8 pt-4 px-4">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs text-indigo-900/40 font-mono hover:text-indigo-900/70 flex items-center gap-1 bg-white/30 px-3 py-1 rounded-full"
        >
          {showDebug ? '▼ Hide Debug Info' : '▶ Show Debug Info'}
        </button>

        {showDebug && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 rounded-lg text-left overflow-hidden shadow-lg border border-slate-700">
              <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Current Scene Generation Log:</h4>
              <pre className="text-green-400 font-mono text-[10px] sm:text-xs whitespace-pre-wrap break-words leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                {debugPrompt || "No debug info available."}
              </pre>
            </div>
            {refImageUrl && (
              <div className="p-4 bg-slate-800 rounded-lg text-left overflow-hidden shadow-lg border border-slate-700">
                <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Character Reference Sheet (Step 1):</h4>
                <div className="flex gap-4">
                  <div className="w-1/3 flex-shrink-0">
                    <img src={refImageUrl} alt="Reference" className="w-full h-auto rounded border border-slate-600" />
                  </div>
                  <div className="w-2/3">
                    <pre className="text-blue-300 font-mono text-[10px] sm:text-xs whitespace-pre-wrap break-words leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                      {refDebugPrompt || "No reference debug info."}
                    </pre>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 bg-slate-800 rounded-lg text-left overflow-hidden shadow-lg border border-slate-700 lg:col-span-2">
              <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Prefetch Cache Status:</h4>
              <div className="text-xs font-mono text-slate-300">
                Cached Steps: {Object.keys(prefetchCache).length}
                <ul className="mt-2 list-disc pl-4 text-slate-400">
                  {Object.keys(prefetchCache).map(k => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryScreen;