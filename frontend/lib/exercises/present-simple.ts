import { Exercise } from '../types';

export const presentSimpleExercises: Exercise[] = [
    // --- Habits & Routines ---
    {
        id: 'ps_mcq_001',
        tenseSlug: 'present-simple',
        type: 'mcq',
        level: 'easy',
        prompt: 'I usually ______ coffee in the morning.',
        choices: ['drink', 'drinks', 'drinking', 'drank'],
        answer: 'drink',
        explanation:
            "We use the base form 'drink' with 'I' for habits. 'Usually' is a common keyword for Present Simple.",
    },
    {
        id: 'ps_fib_002',
        tenseSlug: 'present-simple',
        type: 'fill_blank',
        level: 'medium',
        prompt: 'She ______ (to brush) her teeth twice a day.',
        answer: 'brushes',
        explanation:
            "For 'she', we add 'es' to verbs ending in 'sh'. So 'brush' becomes 'brushes'.",
    },
    {
        id: 'ps_ord_003',
        tenseSlug: 'present-simple',
        type: 'order_words',
        level: 'easy',
        prompt: 'Form a sentence about a daily routine.',
        choices: ['bus', 'school', 'take', 'to', 'they', 'the'],
        answer: 'They take the bus to school',
        explanation:
            'Standard word order: Subject (They) + Verb (take) + Object (the bus) + Destination (to school).',
    },

    // --- General Truths ---
    {
        id: 'ps_mcq_004',
        tenseSlug: 'present-simple',
        type: 'mcq',
        level: 'medium',
        prompt: 'Water ______ at 100 degrees Celsius.',
        choices: ['boil', 'boils', 'boiling', 'boiled'],
        answer: 'boils',
        explanation:
            "This is a scientific fact (general truth). We use the third person singular 'boils' because 'water' is an uncountable noun (it).",
    },
    {
        id: 'ps_fib_005',
        tenseSlug: 'present-simple',
        type: 'fill_blank',
        level: 'hard',
        prompt: 'The sun ______ (to rise) in the east.',
        answer: 'rises',
        explanation: "General truth: The sun (singular subject) 'rises'.",
    },

    // --- Permanent Situations ---
    {
        id: 'ps_mcq_006',
        tenseSlug: 'present-simple',
        type: 'mcq',
        level: 'easy',
        prompt: 'Where ______ you live?',
        choices: ['do', 'does', 'are', 'is'],
        answer: 'do',
        explanation:
            "In questions with 'you' and a main verb ('live'), we use the auxiliary 'do'.",
    },
    {
        id: 'ps_fib_007',
        tenseSlug: 'present-simple',
        type: 'fill_blank',
        level: 'medium',
        prompt: 'He ______ (not / to work) in London anymore.',
        answer: "doesn't work",
        explanation:
            "For negatives in third person singular (He), we use 'doesn't' + base verb.",
    },
    {
        id: 'ps_ord_008',
        tenseSlug: 'present-simple',
        type: 'order_words',
        level: 'hard',
        prompt: 'State a permanent fact about someone.',
        choices: ['speak', 'parents', 'my', 'Spanish', 'fluently'],
        answer: 'My parents speak Spanish fluently',
        explanation:
            'Subject (My parents - plural) + Verb (speak) + Object (Spanish) + Adverb (fluently).',
    },

    // --- Schedules & Timetables ---
    {
        id: 'ps_mcq_009',
        tenseSlug: 'present-simple',
        type: 'mcq',
        level: 'medium',
        prompt: 'The train ______ at 9 PM tonight.',
        choices: ['leaves', 'leave', 'leaving', 'is leave'],
        answer: 'leaves',
        explanation:
            'We use Present Simple for fixed schedules and timetables, even for the future.',
    },
    {
        id: 'ps_fib_010',
        tenseSlug: 'present-simple',
        type: 'fill_blank',
        level: 'hard',
        prompt: 'What time ______ (the class / to start)?',
        answer: 'does the class start',
        explanation:
            "For questions with a singular subject ('the class'), we use 'does' + subject + base verb.",
    },
    {
        id: 'ps_ord_011',
        tenseSlug: 'present-simple',
        type: 'order_words',
        level: 'medium',
        prompt: 'Ask about a schedule.',
        choices: ['the', 'close', 'what', 'does', 'time', 'bank', '?'],
        answer: 'What time does the bank close?',
        explanation:
            "Wh-question structure: Question word (What time) + Auxiliary (does) + Subject (the bank) + Verb (close)?",
    },

    // --- Mixed / Additional Practice ---
    {
        id: 'ps_mcq_012',
        tenseSlug: 'present-simple',
        type: 'mcq',
        level: 'hard',
        prompt: 'Which sentence is correct?',
        choices: [
            'She don’t like pizza.',
            'She doesn’t likes pizza.',
            'She doesn’t like pizza.',
            'She no like pizza.',
        ],
        answer: 'She doesn’t like pizza.',
        explanation:
            "Correct negative form: Subject + doesn't + base verb. 'Like' should not have an 's' after 'doesn't'.",
    },
    {
        id: 'ps_fib_013',
        tenseSlug: 'present-simple',
        type: 'fill_blank',
        level: 'easy',
        prompt: 'We ______ (to love) English grammar!',
        answer: 'love',
        explanation:
            "With 'We', we use the base form of the verb 'love'.",
    },
    {
        id: 'ps_ord_014',
        tenseSlug: 'present-simple',
        type: 'order_words',
        level: 'hard',
        prompt: 'Create a frequency sentence.',
        choices: ['often', 'go', 'we', 'cinema', 'the', 'to'],
        answer: 'We often go to the cinema',
        explanation:
            "Frequency adverbs (often) usually go between the Subject (We) and the Main Verb (go).",
    },
];
