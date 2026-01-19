import React, { useState } from 'react';
import { SocialStoryTemplate } from '../src/types';
import { SOCIAL_STORY_TEMPLATES, getTemplatesByCategory } from '../src/data/templates';

interface ScenarioSelectorProps {
    onSelectTemplate: (template: SocialStoryTemplate) => void;
    onSelectCustom: () => void;
    onSelectExample?: (exampleId: string) => void;
    onViewLibrary?: () => void;
    savedStoriesCount?: number;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
    onSelectTemplate,
    onSelectCustom,
    onSelectExample,
    onViewLibrary,
    savedStoriesCount = 0
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = [
        { id: 'all', label: 'All Scenarios', icon: '📚' },
        { id: 'medical', label: 'Medical', icon: '🏥' },
        { id: 'school', label: 'School', icon: '🏫' },
        { id: 'daily-routine', label: 'Daily Life', icon: '🏠' },
        { id: 'travel', label: 'Travel', icon: '✈️' },
        { id: 'social', label: 'Social', icon: '🎉' }
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? SOCIAL_STORY_TEMPLATES
        : getTemplatesByCategory(selectedCategory as SocialStoryTemplate['category']);

    // Example stories (placeholder for now)
    const exampleStories = [
        { id: 'alex-dentist', title: 'Alex Goes to the Dentist', icon: '🦷', description: 'See an example story' },
        { id: 'sam-school', title: 'Sam\'s First Day of School', icon: '🏫', description: 'See an example story' },
        { id: 'jordan-airplane', title: 'Jordan Flies on an Airplane', icon: '✈️', description: 'See an example story' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1"></div>
                        <div className="flex-1">
                            <h1 className="text-5xl font-bold text-indigo-900 mb-4">
                                Social Story Builder
                            </h1>
                        </div>
                        <div className="flex-1 flex justify-end">
                            {onViewLibrary && (
                                <button
                                    onClick={onViewLibrary}
                                    className="bg-white px-6 py-3 rounded-xl font-semibold text-indigo-600 hover:bg-indigo-50 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    My Stories
                                    {savedStoriesCount > 0 && (
                                        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {savedStoriesCount}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Create personalized stories to help your child prepare for new experiences
                    </p>
                </div>

                {/* Example Stories Section */}
                {onSelectExample && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">📖</span>
                            <h2 className="text-2xl font-bold text-indigo-900">Try an Example Story</h2>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                No setup required!
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {exampleStories.map(example => (
                                <button
                                    key={example.id}
                                    onClick={() => onSelectExample(example.id)}
                                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-green-200 hover:border-green-400 text-left group"
                                >
                                    <div className="text-4xl mb-3">{example.icon}</div>
                                    <h3 className="text-lg font-bold text-indigo-900 mb-2 group-hover:text-green-600">
                                        {example.title}
                                    </h3>
                                    <p className="text-sm text-slate-500">{example.description}</p>
                                    <div className="mt-4 flex items-center text-green-600 text-sm font-semibold">
                                        <span>View now</span>
                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="relative my-12">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-600 font-semibold">
                            Or create a personalized story
                        </span>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${selectedCategory === cat.id
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white text-slate-700 hover:bg-indigo-50 shadow-md'
                                }`}
                        >
                            <span className="mr-2">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredTemplates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => onSelectTemplate(template)}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 text-left group border-2 border-transparent hover:border-indigo-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-5xl">{template.icon}</span>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                                    Ages {template.ageRange[0]}-{template.ageRange[1]}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-indigo-900 mb-2 group-hover:text-indigo-600">
                                {template.title}
                            </h3>

                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                {template.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{template.estimatedScenes} scenes</span>
                                <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    <span>Create story</span>
                                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Custom Scenario Button */}
                <div className="text-center">
                    <button
                        onClick={onSelectCustom}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-3"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Custom Scenario
                    </button>
                    <p className="text-sm text-slate-500 mt-3">
                        Don't see what you need? Create your own social story!
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ScenarioSelector;
