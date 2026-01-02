// Local question bank for Practice Focus Mode
// Frontend-only, no backend

export interface FocusQuestion {
    id: string;
    tenseSlug: string;
    type: "mcq" | "fill_blank";
    prompt: string;
    choices?: string[];
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
    }
];

// Map of all question banks by tense slug
export const FOCUS_QUESTION_BANKS: Record<string, FocusQuestion[]> = {
    "present-simple": PRESENT_SIMPLE_QUESTIONS,
    // Other tenses: coming soon
};
