import { SavedSocialStory, SocialStoryState, SocialStoryConfig, SocialStoryTemplate, CustomScenarioInput } from '../src/types';

const STORAGE_KEY = 'social_story_builder_stories';

/**
 * Convert SocialStoryState to SavedSocialStory format
 */
export function convertToSavedStory(
    socialStory: SocialStoryState,
    config: SocialStoryConfig,
    template: SocialStoryTemplate | null,
    customScenario: CustomScenarioInput | null
): SavedSocialStory {
    const now = Date.now();

    return {
        id: crypto.randomUUID(),
        templateId: template?.id,
        customTitle: customScenario?.title,
        childName: config.childName,
        createdAt: now,
        lastViewed: now,
        scenes: socialStory.scenes,
        childCharacterRef: socialStory.childCharacterRef || '',
        peopleRefs: Object.fromEntries(socialStory.peopleRefs), // Convert Map to Record
        thumbnail: socialStory.scenes[0]?.imageUrl // First scene image as thumbnail
    };
}

/**
 * Save a story to localStorage
 */
export function saveStory(
    socialStory: SocialStoryState,
    config: SocialStoryConfig,
    template: SocialStoryTemplate | null,
    customScenario: CustomScenarioInput | null
): SavedSocialStory | null {
    try {
        const savedStory = convertToSavedStory(socialStory, config, template, customScenario);
        const existingStories = getSavedStories();

        // Add new story to the beginning of the array
        const updatedStories = [savedStory, ...existingStories];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
        console.log('Story saved successfully:', savedStory.id);

        return savedStory;
    } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Cannot save story.');
            alert('Storage limit reached. Please delete some saved stories to save new ones.');
        } else {
            console.error('Failed to save story:', error);
        }
        return null;
    }
}

/**
 * Get all saved stories from localStorage
 */
export function getSavedStories(): SavedSocialStory[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const stories = JSON.parse(stored) as SavedSocialStory[];

        // Sort by lastViewed (most recent first)
        return stories.sort((a, b) => b.lastViewed - a.lastViewed);
    } catch (error) {
        console.error('Failed to load saved stories:', error);
        return [];
    }
}

/**
 * Get a specific story by ID
 */
export function getStoryById(id: string): SavedSocialStory | null {
    const stories = getSavedStories();
    return stories.find(story => story.id === id) || null;
}

/**
 * Delete a story from localStorage
 */
export function deleteStory(id: string): boolean {
    try {
        const stories = getSavedStories();
        const updatedStories = stories.filter(story => story.id !== id);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
        console.log('Story deleted successfully:', id);

        return true;
    } catch (error) {
        console.error('Failed to delete story:', error);
        return false;
    }
}

/**
 * Update the lastViewed timestamp for a story
 */
export function updateLastViewed(id: string): void {
    try {
        const stories = getSavedStories();
        const storyIndex = stories.findIndex(story => story.id === id);

        if (storyIndex !== -1) {
            stories[storyIndex].lastViewed = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
        }
    } catch (error) {
        console.error('Failed to update lastViewed:', error);
    }
}

/**
 * Get the count of saved stories
 */
export function getSavedStoriesCount(): number {
    return getSavedStories().length;
}
