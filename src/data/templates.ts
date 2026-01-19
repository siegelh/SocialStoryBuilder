import { SocialStoryTemplate } from '../types';

/**
 * Social Story Templates Library
 * 
 * Each template defines a common scenario that children may encounter.
 * Templates guide the AI in generating appropriate, structured social stories.
 */

export const SOCIAL_STORY_TEMPLATES: SocialStoryTemplate[] = [
    // ============================================================================
    // MEDICAL SCENARIOS
    // ============================================================================
    {
        id: 'dentist-visit',
        title: 'Going to the Dentist',
        category: 'medical',
        description: 'A visit to the dentist for a checkup and cleaning',
        icon: '🦷',
        estimatedScenes: 7,
        keyPeople: ['dentist', 'dental hygienist', 'receptionist'],
        commonFears: ['pain', 'loud noises', 'unfamiliar tools', 'bright lights'],
        ageRange: [3, 10]
    },
    {
        id: 'doctor-checkup',
        title: 'Doctor Checkup',
        category: 'medical',
        description: 'A routine visit to the doctor for a health checkup',
        icon: '🏥',
        estimatedScenes: 6,
        keyPeople: ['doctor', 'nurse', 'receptionist'],
        commonFears: ['shots', 'stethoscope', 'being examined', 'waiting'],
        ageRange: [3, 10]
    },
    {
        id: 'getting-shot',
        title: 'Getting a Vaccine',
        category: 'medical',
        description: 'Getting a vaccination or shot at the doctor\'s office',
        icon: '💉',
        estimatedScenes: 5,
        keyPeople: ['nurse', 'doctor'],
        commonFears: ['needle', 'pain', 'crying'],
        ageRange: [4, 10]
    },

    // ============================================================================
    // SCHOOL SCENARIOS
    // ============================================================================
    {
        id: 'first-day-school',
        title: 'First Day of School',
        category: 'school',
        description: 'Starting a new school year or attending school for the first time',
        icon: '🏫',
        estimatedScenes: 8,
        keyPeople: ['teacher', 'principal', 'classmates'],
        commonFears: ['separation from parents', 'new people', 'not knowing what to do', 'getting lost'],
        ageRange: [4, 8]
    },
    {
        id: 'school-bus',
        title: 'Riding the School Bus',
        category: 'school',
        description: 'Taking the school bus for the first time',
        icon: '🚌',
        estimatedScenes: 6,
        keyPeople: ['bus driver', 'bus monitor'],
        commonFears: ['loud noises', 'bumpy ride', 'finding a seat', 'missing the stop'],
        ageRange: [5, 10]
    },
    {
        id: 'fire-drill',
        title: 'Fire Drill at School',
        category: 'school',
        description: 'Participating in a fire drill at school',
        icon: '🚨',
        estimatedScenes: 5,
        keyPeople: ['teacher', 'firefighter'],
        commonFears: ['loud alarm', 'rushing', 'leaving belongings', 'standing outside'],
        ageRange: [5, 10]
    },

    // ============================================================================
    // DAILY ROUTINES
    // ============================================================================
    {
        id: 'haircut',
        title: 'Getting a Haircut',
        category: 'daily-routine',
        description: 'Visiting a hair salon or barber for a haircut',
        icon: '💇',
        estimatedScenes: 6,
        keyPeople: ['hairstylist', 'barber'],
        commonFears: ['scissors', 'buzzing clippers', 'sitting still', 'cape around neck', 'hair in face'],
        ageRange: [3, 10]
    },
    {
        id: 'grocery-store',
        title: 'Going to the Grocery Store',
        category: 'daily-routine',
        description: 'Shopping at the grocery store with a parent',
        icon: '🛒',
        estimatedScenes: 5,
        keyPeople: ['cashier', 'store clerk'],
        commonFears: ['crowds', 'loud noises', 'waiting in line', 'not getting treats'],
        ageRange: [3, 8]
    },
    {
        id: 'restaurant',
        title: 'Eating at a Restaurant',
        category: 'daily-routine',
        description: 'Going out to eat at a restaurant',
        icon: '🍽️',
        estimatedScenes: 6,
        keyPeople: ['server', 'host'],
        commonFears: ['waiting for food', 'unfamiliar foods', 'sitting still', 'loud environment'],
        ageRange: [3, 10]
    },

    // ============================================================================
    // TRAVEL SCENARIOS
    // ============================================================================
    {
        id: 'airplane',
        title: 'Flying on an Airplane',
        category: 'travel',
        description: 'Taking a flight on an airplane',
        icon: '✈️',
        estimatedScenes: 8,
        keyPeople: ['flight attendant', 'pilot', 'security officer'],
        commonFears: ['takeoff', 'landing', 'loud engine', 'ear pressure', 'turbulence', 'security screening'],
        ageRange: [4, 12]
    },
    {
        id: 'hotel-stay',
        title: 'Staying at a Hotel',
        category: 'travel',
        description: 'Spending the night at a hotel',
        icon: '🏨',
        estimatedScenes: 6,
        keyPeople: ['hotel clerk', 'bellhop'],
        commonFears: ['new bed', 'unfamiliar room', 'strange noises', 'elevators'],
        ageRange: [4, 10]
    },
    {
        id: 'car-ride',
        title: 'Long Car Ride',
        category: 'travel',
        description: 'Taking a long car trip',
        icon: '🚗',
        estimatedScenes: 5,
        keyPeople: [],
        commonFears: ['boredom', 'car sickness', 'needing bathroom', 'being restrained in car seat'],
        ageRange: [3, 10]
    },

    // ============================================================================
    // SOCIAL EVENTS
    // ============================================================================
    {
        id: 'birthday-party',
        title: 'Going to a Birthday Party',
        category: 'social',
        description: 'Attending a friend\'s birthday party',
        icon: '🎂',
        estimatedScenes: 7,
        keyPeople: ['birthday child', 'other kids', 'parents'],
        commonFears: ['loud singing', 'games', 'sharing', 'cake mess', 'leaving without parent'],
        ageRange: [3, 10]
    },
    {
        id: 'playdate',
        title: 'Having a Playdate',
        category: 'social',
        description: 'Going to a friend\'s house to play',
        icon: '🎮',
        estimatedScenes: 6,
        keyPeople: ['friend', 'friend\'s parent'],
        commonFears: ['new house', 'sharing toys', 'different rules', 'parent leaving'],
        ageRange: [3, 8]
    },
    {
        id: 'library',
        title: 'Visiting the Library',
        category: 'daily-routine',
        description: 'Going to the public library',
        icon: '📚',
        estimatedScenes: 5,
        keyPeople: ['librarian'],
        commonFears: ['being quiet', 'getting lost', 'choosing books', 'checkout process'],
        ageRange: [4, 10]
    }
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): SocialStoryTemplate | undefined {
    return SOCIAL_STORY_TEMPLATES.find(t => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: SocialStoryTemplate['category']): SocialStoryTemplate[] {
    return SOCIAL_STORY_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get templates suitable for a specific age
 */
export function getTemplatesForAge(age: number): SocialStoryTemplate[] {
    return SOCIAL_STORY_TEMPLATES.filter(t => age >= t.ageRange[0] && age <= t.ageRange[1]);
}
