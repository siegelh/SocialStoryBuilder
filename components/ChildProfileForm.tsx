import React, { useState } from 'react';
import { SocialStoryConfig, SocialStoryTemplate } from '../src/types';

interface ChildProfileFormProps {
    selectedTemplate: SocialStoryTemplate;
    onSubmit: (config: SocialStoryConfig) => void;
    onBack: () => void;
}

const ChildProfileForm: React.FC<ChildProfileFormProps> = ({
    selectedTemplate,
    onSubmit,
    onBack
}) => {
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState<number>(5);
    const [hairColor, setHairColor] = useState('');
    const [skinTone, setSkinTone] = useState('');
    const [eyeColor, setEyeColor] = useState('');
    const [additionalFeatures, setAdditionalFeatures] = useState('');
    const [artStyle, setArtStyle] = useState('Gentle watercolor illustration with soft colors and friendly characters');

    // Customization fields
    const [specificLocation, setSpecificLocation] = useState('');
    const [specificPeople, setSpecificPeople] = useState<{ role: string; name: string }[]>([]);
    const [additionalConcerns, setAdditionalConcerns] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build appearance description
        const appearanceParts = [
            `A ${childAge}-year-old child`,
            hairColor && `with ${hairColor} hair`,
            eyeColor && `and ${eyeColor} eyes`,
            skinTone && `with ${skinTone} skin`,
            additionalFeatures
        ].filter(Boolean);

        const childAppearance = appearanceParts.join(', ');

        const config: SocialStoryConfig = {
            templateId: selectedTemplate.id,
            childName,
            childAppearance,
            childAge,
            customizations: {
                specificLocation: specificLocation || undefined,
                specificPeople: specificPeople.length > 0 ? specificPeople : undefined,
                additionalConcerns: additionalConcerns ? additionalConcerns.split(',').map(c => c.trim()) : undefined
            },
            artStyle
        };

        onSubmit(config);
    };

    const addSpecificPerson = () => {
        const role = prompt('What is their role? (e.g., dentist, teacher)');
        const name = prompt('What is their name?');
        if (role && name) {
            setSpecificPeople([...specificPeople, { role, name }]);
        }
    };

    const removePerson = (index: number) => {
        setSpecificPeople(specificPeople.filter((_, i) => i !== index));
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

                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{selectedTemplate.icon}</span>
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-900">
                                {selectedTemplate.title}
                            </h1>
                            <p className="text-slate-600">{selectedTemplate.description}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-indigo-900 mb-6">
                        Tell us about your child
                    </h2>

                    {/* Basic Information */}
                    <div className="space-y-6 mb-8">
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
                                min={selectedTemplate.ageRange[0]}
                                max={selectedTemplate.ageRange[1]}
                                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Recommended: {selectedTemplate.ageRange[0]}-{selectedTemplate.ageRange[1]} years
                            </p>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            Appearance (helps create accurate images)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Hair Color
                                </label>
                                <input
                                    type="text"
                                    value={hairColor}
                                    onChange={(e) => setHairColor(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="e.g., brown, blonde, black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Eye Color
                                </label>
                                <input
                                    type="text"
                                    value={eyeColor}
                                    onChange={(e) => setEyeColor(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="e.g., blue, brown, green"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Skin Tone
                                </label>
                                <input
                                    type="text"
                                    value={skinTone}
                                    onChange={(e) => setSkinTone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="e.g., light, tan, brown, dark"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Special Features
                                </label>
                                <input
                                    type="text"
                                    value={additionalFeatures}
                                    onChange={(e) => setAdditionalFeatures(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="e.g., glasses, freckles"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Customizations (Optional) */}
                    <div className="mb-8 p-6 bg-indigo-50 rounded-xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            Customizations (Optional)
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Specific Location
                                </label>
                                <input
                                    type="text"
                                    value={specificLocation}
                                    onChange={(e) => setSpecificLocation(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                                    placeholder="e.g., Dr. Smith's office on Main Street"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Specific People
                                </label>
                                {specificPeople.length > 0 && (
                                    <div className="mb-3 space-y-2">
                                        {specificPeople.map((person, index) => (
                                            <div key={index} className="flex items-center justify-between bg-white px-4 py-2 rounded-lg">
                                                <span className="text-sm">
                                                    <strong>{person.name}</strong> ({person.role})
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removePerson(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={addSpecificPerson}
                                    className="px-4 py-2 bg-white border-2 border-indigo-300 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
                                >
                                    + Add Person
                                </button>
                                <p className="text-xs text-slate-600 mt-2">
                                    e.g., "Dr. Garcia" as the dentist, "Ms. Johnson" as the teacher
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Additional Concerns
                                </label>
                                <textarea
                                    value={additionalConcerns}
                                    onChange={(e) => setAdditionalConcerns(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                                    rows={3}
                                    placeholder="Comma-separated concerns (e.g., loud noises, being touched, waiting)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
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
                            disabled={!childName}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Create Story →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChildProfileForm;
