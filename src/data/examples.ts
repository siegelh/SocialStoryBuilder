import { SocialStoryConfig } from '../types';

export interface ExampleStory {
    id: string;
    title: string;
    icon: string;
    description: string;
    templateId: string;
    config: SocialStoryConfig;
}

export const EXAMPLE_STORIES_DATA: ExampleStory[] = [
    {
        id: 'alex-dentist',
        title: 'Alex Goes to the Dentist',
        icon: '🦷',
        description: 'Watch Alex overcome his fear of the dentist chair.',
        templateId: 'dentist-visit',
        config: {
            childName: 'Alex',
            childAge: 6,
            childAppearance: 'A young boy with messy red hair, freckles, and a blue striped t-shirt',
            artStyle: 'cartoon storybook illustration',
            templateId: 'dentist-visit',
            customizations: {}
        }
    },
    {
        id: 'sam-school',
        title: 'Sam\'s First Day of School',
        icon: '🏫',
        description: 'Join Sam as she gets ready for her very first day.',
        templateId: 'first-day-school',
        config: {
            childName: 'Sam',
            childAge: 5,
            childAppearance: 'A cute girl with dark skin, two pigtails with pink bows, and a yellow dress',
            artStyle: 'cartoon storybook illustration',
            templateId: 'first-day-school',
            customizations: {}
        }
    },
    {
        id: 'jordan-airplane',
        title: 'Jordan Flies on an Airplane',
        icon: '✈️',
        description: 'See how Jordan handles the loud noises of an airplane.',
        templateId: 'airplane',
        config: {
            childName: 'Jordan',
            childAge: 7,
            childAppearance: 'A cool boy with curly brown hair, wearing red headphones and a green hoodie',
            artStyle: 'cartoon storybook illustration',
            templateId: 'airplane',
            customizations: {}
        }
    }
];
