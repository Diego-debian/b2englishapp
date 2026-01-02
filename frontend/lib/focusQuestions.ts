// Local question bank for Practice Focus Mode
// Frontend-only, no backend

export interface FocusQuestion {
    id: string;
    tenseSlug: string;
    type: "mcq" | "fill_blank" | "order_words";
    prompt: string;
    choices?: string[];
    tokens?: string[];
    answer: string;
    explanation: string;
}

// Present Simple Question Bank
export const PRESENT_SIMPLE_QUESTIONS: FocusQuestion[] = [
    {
        id: "ps_001",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "She ______ to work every day.",
        choices: ["go", "goes", "going", "gone"],
        answer: "goes",
        explanation: "Use 'goes' for third person singular (he/she/it) in Present Simple."
    },
    {
        id: "ps_002",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "They ______ coffee in the morning.",
        choices: ["drinks", "drink", "drinking", "drank"],
        answer: "drink",
        explanation: "Use base form 'drink' for plural subjects (they/we) in Present Simple."
    },
    {
        id: "ps_003",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "______ she like pizza?",
        choices: ["Do", "Does", "Is", "Are"],
        answer: "Does",
        explanation: "Use 'Does' for questions with third person singular (he/she/it)."
    },
    {
        id: "ps_004",
        tenseSlug: "present-simple",
        type: "fill_blank",
        prompt: "My brother ______ (play) soccer every weekend.",
        answer: "plays",
        explanation: "Add '-s' to the verb for third person singular: play → plays."
    },
    {
        id: "ps_005",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "We ______ TV every evening.",
        choices: ["watches", "watch", "watching", "to watch"],
        answer: "watch",
        explanation: "Use base form 'watch' for plural subjects (we) in Present Simple."
    },
    {
        id: "ps_006",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "He ______ breakfast at 7 AM.",
        choices: ["have", "has", "having", "had"],
        answer: "has",
        explanation: "Use 'has' for third person singular (he/she/it) in Present Simple."
    },
    {
        id: "ps_007",
        tenseSlug: "present-simple",
        type: "fill_blank",
        prompt: "I ______ (not/like) spicy food.",
        answer: "don't like",
        explanation: "Use 'don't' + base verb for negatives with I/you/we/they."
    },
    {
        id: "ps_008",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "The sun ______ in the east.",
        choices: ["rise", "rises", "rising", "rose"],
        answer: "rises",
        explanation: "Use 'rises' for third person singular (it) in Present Simple. This is a general truth."
    },
    {
        id: "ps_009",
        tenseSlug: "present-simple",
        type: "order_words",
        prompt: "Order the words to form a correct sentence:",
        tokens: ["studies", "English", "She", "every", "day"],
        answer: "She studies English every day",
        explanation: "Subject (She) + verb with -s (studies) + object (English) + time expression (every day)."
    },
    {
        id: "ps_010",
        tenseSlug: "present-simple",
        type: "order_words",
        prompt: "Order the words to form a correct question:",
        tokens: ["like", "you", "Do", "coffee", "?"],
        answer: "Do you like coffee?",
        explanation: "Questions in Present Simple: Do/Does + subject + base verb. 'Do' is used with 'you'."
    },
    {
        id: "ps_011",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "He ______ know the answer.",
        choices: ["don't", "doesn't", "isn't", "not"],
        answer: "doesn't",
        explanation: "Use 'doesn't' (does not) for negative sentences with third person singular (he/she/it)."
    },
    {
        id: "ps_012",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "Where ______ your parents live?",
        choices: ["do", "does", "are", "have"],
        answer: "do",
        explanation: "Use 'do' with plural subjects (parents = they) in questions."
    },
    {
        id: "ps_013",
        tenseSlug: "present-simple",
        type: "fill_blank",
        prompt: "______ (you/study) Spanish?",
        answer: "Do you study",
        explanation: "Form questions with 'Do' + subject + base verb."
    },
    {
        id: "ps_014",
        tenseSlug: "present-simple",
        type: "fill_blank",
        prompt: "The baby ______ (cry) when he is hungry.",
        answer: "cries",
        explanation: "For verbs ending in consonant + y, change 'y' to 'i' and add 'es'."
    },
    {
        id: "ps_015",
        tenseSlug: "present-simple",
        type: "fill_blank",
        prompt: "The library ______ (open) at 8 AM.",
        answer: "opens",
        explanation: "Use the -s form for singular subjects (the library = it)."
    },
    {
        id: "ps_016",
        tenseSlug: "present-simple",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["not", "play", "tennis", "I", "do"],
        answer: "I do not play tennis",
        explanation: "Standard negative structure: Subject + do/does + not + base verb + object."
    },
    {
        id: "ps_017",
        tenseSlug: "present-simple",
        type: "order_words",
        prompt: "Order the words to form a correct sentence:",
        tokens: ["always", "early", "He", "arrives"],
        answer: "He always arrives early",
        explanation: "Frequency adverbs (always) usually go before the main verb."
    }
];

// Map of all question banks by tense slug
export const FOCUS_QUESTION_BANKS: Record<string, FocusQuestion[]> = {
    "present-simple": PRESENT_SIMPLE_QUESTIONS,
    // Other tenses: coming soon
};
