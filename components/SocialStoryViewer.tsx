import React from 'react';
import { SocialStoryState, SocialStoryConfig } from '../src/types';

interface SocialStoryViewerProps {
    socialStory: SocialStoryState;
    config: SocialStoryConfig;
    isLoading: boolean;
    onBack: () => void;
    onSave?: () => void; // Optional: only for newly generated stories
    isSavedStory?: boolean; // Flag to indicate if viewing a saved story
}

const SocialStoryViewer: React.FC<SocialStoryViewerProps> = ({
    socialStory,
    config,
    isLoading,
    onBack,
    onSave,
    isSavedStory = false
}) => {
    const currentScene = socialStory.scenes[socialStory.currentSceneIndex];
    const totalScenes = socialStory.scenes.length;

    if (socialStory.scenes.length === 0 && !isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl">
                    <p className="text-center text-slate-600">No scenes generated yet.</p>
                    <button
                        onClick={onBack}
                        className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                    >
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <button
                        onClick={onBack}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Scenarios
                    </button>

                    <h1 className="text-2xl font-bold text-indigo-900">
                        {config.childName}'s Story
                        {isSavedStory && (
                            <span className="ml-3 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                Saved Story
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-600">
                        {isLoading ? 'Generating...' : `${totalScenes} scenes`}
                    </p>
                </div>

                {/* Character References (Stage 5) - Hide for saved stories */}
                {!isSavedStory && (socialStory.childCharacterRef || socialStory.peopleRefs.size > 0) && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            🎭 Character References (Stage 5)
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Child Character */}
                            {socialStory.childCharacterRef && (
                                <div className="text-center">
                                    <img
                                        src={socialStory.childCharacterRef}
                                        alt={`${config.childName}'s character reference`}
                                        className="w-full h-32 object-contain bg-slate-50 rounded-lg mb-2"
                                    />
                                    <p className="text-sm font-semibold text-slate-700">{config.childName}</p>
                                    <p className="text-xs text-slate-500">Child</p>
                                </div>
                            )}

                            {/* People Characters */}
                            {Array.from(socialStory.peopleRefs.entries()).map(([role, imageUrl]) => (
                                <div key={role} className="text-center">
                                    <img
                                        src={imageUrl}
                                        alt={`${role} character reference`}
                                        className="w-full h-32 object-contain bg-slate-50 rounded-lg mb-2"
                                    />
                                    <p className="text-sm font-semibold text-slate-700 capitalize">{role}</p>
                                    <p className="text-xs text-slate-500">Person</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold text-slate-700">
                            Generating scene {totalScenes + 1}...
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                            This may take a moment
                        </p>
                    </div>
                )}

                {/* Scenes List (Text Only) */}
                {socialStory.scenes.length > 0 && (
                    <div className="space-y-6">
                        {socialStory.scenes.map((sceneStep, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl"
                            >
                                {/* Scene Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-sm font-semibold text-indigo-600">
                                            Scene {sceneStep.scene.scene_number}
                                        </span>
                                        <h2 className="text-2xl font-bold text-slate-800">
                                            {sceneStep.scene.scene_title}
                                        </h2>
                                    </div>
                                    {sceneStep.scene.is_final_scene && (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            Final Scene
                                        </span>
                                    )}
                                </div>

                                {/* Scene Text */}
                                <div className="prose prose-lg max-w-none mb-6">
                                    <p className="text-slate-700 leading-relaxed text-lg">
                                        {sceneStep.scene.scene_text}
                                    </p>
                                </div>

                                {/* Scene Image */}
                                {sceneStep.imageUrl ? (
                                    <div className="mb-6">
                                        <img
                                            src={sceneStep.imageUrl}
                                            alt={sceneStep.scene.scene_title}
                                            className="w-full rounded-xl shadow-lg"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-slate-100 rounded-xl p-12 mb-6 text-center">
                                        <svg className="w-16 h-16 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm text-slate-500">
                                            Generating image...
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {sceneStep.scene.image_description}
                                        </p>
                                    </div>
                                )}

                                {/* Person Introduced */}
                                {sceneStep.scene.person_introduced && (
                                    <div className="bg-purple-50 rounded-xl p-6 mb-6">
                                        <h3 className="text-lg font-bold text-purple-900 mb-2">
                                            👋 Meet {sceneStep.scene.person_introduced.name}
                                        </h3>
                                        <p className="text-purple-700 mb-2">
                                            <strong>Role:</strong> {sceneStep.scene.person_introduced.role}
                                        </p>
                                        <p className="text-purple-700">
                                            {sceneStep.scene.person_introduced.what_they_do}
                                        </p>
                                    </div>
                                )}

                                {/* Parent Tips */}
                                {sceneStep.scene.educational_note && (
                                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
                                        <h3 className="text-sm font-bold text-blue-900 mb-2">
                                            💡 Parent Tip
                                        </h3>
                                        <p className="text-blue-700 text-sm">
                                            {sceneStep.scene.educational_note}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Complete Message */}
                {socialStory.isComplete && !isLoading && (
                    <div className="bg-green-50 rounded-2xl shadow-xl p-8 mt-6 text-center border-2 border-green-200">
                        <div className="text-5xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-green-900 mb-2">
                            Story Complete!
                        </h2>
                        <p className="text-green-700 mb-6">
                            {config.childName}'s story has been generated with {totalScenes} scenes.
                        </p>
                        <div className="flex gap-4 justify-center">
                            {onSave && !isSavedStory && (
                                <button
                                    onClick={onSave}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                >
                                    💾 Save Story
                                </button>
                            )}
                            <button
                                onClick={onBack}
                                className="px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-lg font-semibold hover:bg-green-50"
                            >
                                {isSavedStory ? 'Back to Library' : 'Create Another Story'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialStoryViewer;
