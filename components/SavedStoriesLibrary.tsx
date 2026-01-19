import React from 'react';
import { SavedSocialStory } from '../src/types';

interface SavedStoriesLibraryProps {
    savedStories: SavedSocialStory[];
    onViewStory: (story: SavedSocialStory) => void;
    onDeleteStory: (id: string) => void;
    onBack: () => void;
    onCreateNew: () => void;
}

const SavedStoriesLibrary: React.FC<SavedStoriesLibraryProps> = ({
    savedStories,
    onViewStory,
    onDeleteStory,
    onBack,
    onCreateNew
}) => {
    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const handleDelete = (e: React.MouseEvent, id: string, childName: string) => {
        e.stopPropagation(); // Prevent triggering onViewStory

        if (window.confirm(`Are you sure you want to delete ${childName}'s story? This cannot be undone.`)) {
            onDeleteStory(id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Scenarios
                    </button>

                    <h1 className="text-4xl font-bold text-indigo-900 mb-2">My Stories</h1>
                    <p className="text-slate-600">
                        {savedStories.length === 0
                            ? 'No saved stories yet'
                            : `${savedStories.length} ${savedStories.length === 1 ? 'story' : 'stories'} saved`}
                    </p>
                </div>

                {/* Empty State */}
                {savedStories.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Saved Stories Yet</h2>
                        <p className="text-slate-600 mb-6">
                            Create your first social story to see it here!
                        </p>
                        <button
                            onClick={onCreateNew}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Create Your First Story
                        </button>
                    </div>
                ) : (
                    /* Stories Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedStories.map((story) => (
                            <div
                                key={story.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer"
                                onClick={() => onViewStory(story)}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100">
                                    {story.thumbnail ? (
                                        <img
                                            src={story.thumbnail}
                                            alt={`${story.childName}'s story`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-20 h-20 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Story Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                                        {story.customTitle || `Story for ${story.childName}`}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>{story.childName}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <span>{story.scenes.length} scenes</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatDate(story.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onViewStory(story)}
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                        >
                                            View Story
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, story.id, story.childName)}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                                            title="Delete story"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedStoriesLibrary;
