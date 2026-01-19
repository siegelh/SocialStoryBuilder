import React, { useState } from 'react';
import { CustomScenarioInput, SocialStoryConfig } from '../src/types';

interface CustomScenarioFormProps {
    onSubmit: (scenarioInput: CustomScenarioInput, childConfig: Partial<SocialStoryConfig>) => void;
    onBack: () => void;
}

const CustomScenarioForm: React.FC<CustomScenarioFormProps> = ({
    onSubmit,
    onBack
}) => {
    // Scenario fields
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('social');
    const [description, setDescription] = useState('');
    const [estimatedScenes, setEstimatedScenes] = useState(6);
    const [keyPeople, setKeyPeople] = useState('');
    const [commonConcerns, setCommonConcerns] = useState('');
    const [specificDetails, setSpecificDetails] = useState('');

    // Child fields (simplified for custom scenarios)
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState<number>(5);
    const [childAppearance, setChildAppearance] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const scenarioInput: CustomScenarioInput = {
            title,
            category,
            description,
            estimatedScenes,
            keyPeople: keyPeople ? keyPeople.split(',').map(p => p.trim()) : undefined,
            commonConcerns: commonConcerns ? commonConcerns.split(',').map(c => c.trim()) : undefined,
            specificDetails: specificDetails || undefined
        };

        const childConfig: Partial<SocialStoryConfig> = {
            childName,
            childAge,
            childAppearance: childAppearance || `A ${childAge}-year-old child`,
            artStyle: 'Gentle watercolor illustration with soft colors and friendly characters'
        };

        onSubmit(scenarioInput, childConfig);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <button
                        onClick={onBack}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Scenarios
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="text-5xl">✨</span>
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-900">
                                Create Custom Scenario
                            </h1>
                            <p className="text-slate-600">Design a social story for any situation</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Scenario Information */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-indigo-900 mb-6">
                            Scenario Details
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Story Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="e.g., Going to Grandma's House"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                >
                                    <option value="medical">Medical</option>
                                    <option value="school">School</option>
                                    <option value="daily-routine">Daily Routine</option>
                                    <option value="travel">Travel</option>
                                    <option value="social">Social</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    What happens in this scenario? *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    rows={4}
                                    placeholder="Describe what will happen during this experience. Be specific about the sequence of events."
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Example: "We're visiting Grandma who just moved to a new house. She has a big dog named Max. We'll stay for dinner and might sleep over."
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Who will your child meet?
                                </label>
                                <input
                                    type="text"
                                    value={keyPeople}
                                    onChange={(e) => setKeyPeople(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="Comma-separated (e.g., Grandma, Uncle Joe, Max the dog)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    What might worry your child?
                                </label>
                                <textarea
                                    value={commonConcerns}
                                    onChange={(e) => setCommonConcerns(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    rows={3}
                                    placeholder="Comma-separated concerns (e.g., big dog, new place, being away from home)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Number of Scenes: {estimatedScenes}
                                </label>
                                <input
                                    type="range"
                                    min="4"
                                    max="10"
                                    value={estimatedScenes}
                                    onChange={(e) => setEstimatedScenes(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>4 (shorter)</span>
                                    <span>10 (detailed)</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Additional Details (Optional)
                                </label>
                                <textarea
                                    value={specificDetails}
                                    onChange={(e) => setSpecificDetails(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    rows={2}
                                    placeholder="Any special instructions or important details to include"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Child Information */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-indigo-900 mb-6">
                            About Your Child
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Child's Name *
                                </label>
                                <input
                                    type="text"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="e.g., Emma"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    value={childAge}
                                    onChange={(e) => setChildAge(parseInt(e.target.value))}
                                    min={3}
                                    max={12}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Appearance (Optional)
                                </label>
                                <textarea
                                    value={childAppearance}
                                    onChange={(e) => setChildAppearance(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    rows={2}
                                    placeholder="e.g., Brown hair, blue eyes, glasses, light skin"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 rounded-lg font-semibold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title || !description || !childName}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                Create Custom Story →
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomScenarioForm;
