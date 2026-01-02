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

// Present Continuous Question Bank
export const PRESENT_CONTINUOUS_QUESTIONS: FocusQuestion[] = [
    {
        id: "pc_001",
        tenseSlug: "present-continuous",
        type: "mcq",
        prompt: "Listen! The baby ______.",
        choices: ["cries", "is crying", "cry", "crying"],
        answer: "is crying",
        explanation: "Use Present Continuous (is + verb-ing) for actions happening right now."
    },
    {
        id: "pc_002",
        tenseSlug: "present-continuous",
        type: "mcq",
        prompt: "They ______ for the bus at the moment.",
        choices: ["wait", "waiting", "are waiting", "waits"],
        answer: "are waiting",
        explanation: "Use 'are' + verb-ing for plural subjects (they) describing a current action."
    },
    {
        id: "pc_003",
        tenseSlug: "present-continuous",
        type: "fill_blank",
        prompt: "I ______ (read) a really interesting book these days.",
        answer: "am reading",
        explanation: "Use Present Continuous (am reading) for temporary actions around now, even if not exactly at this moment."
    },
    {
        id: "pc_004",
        tenseSlug: "present-continuous",
        type: "mcq",
        prompt: "______ (you/work) on the project now?",
        choices: ["Do you work", "Are you working", "Is you working", "You working"],
        answer: "Are you working",
        explanation: "In questions, put 'Are' before the subject 'you': Are + subject + verb-ing."
    },
    {
        id: "pc_005",
        tenseSlug: "present-continuous",
        type: "fill_blank",
        prompt: "She ______ (not/wear) a coat today because it's warm.",
        answer: "is not wearing",
        explanation: "For negatives, use is/am/are + not + verb-ing. 'isn't wearing' is also correct."
    },
    {
        id: "pc_006",
        tenseSlug: "present-continuous",
        type: "order_words",
        prompt: "Order the words to form a correct sentence:",
        tokens: ["coming", "bus", "is", "The", "now"],
        answer: "The bus is coming now",
        explanation: "Subject (The bus) + is + verb-ing (coming) + time marker (now)."
    },
    {
        id: "pc_007",
        tenseSlug: "present-continuous",
        type: "mcq",
        prompt: "Why ______ a coat? It's hot inside!",
        choices: ["do you wear", "are you wearing", "you wearing", "is you wearing"],
        answer: "are you wearing",
        explanation: "Use Present Continuous for actions happening around now. Structure: Why + are + subject + verb-ing."
    },
    {
        id: "pc_008",
        tenseSlug: "present-continuous",
        type: "fill_blank",
        prompt: "We ______ (stay) at a hotel until our house is ready.",
        answer: "are staying",
        explanation: "Use Present Continuous for temporary situations. 'We' takes 'are'."
    },
    {
        id: "pc_009",
        tenseSlug: "present-continuous",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["you", "Are", "listening", "to", "me", "?"],
        answer: "Are you listening to me?",
        explanation: "Question structure: Are + subject + verb-ing + object."
    },
    {
        id: "pc_010",
        tenseSlug: "present-continuous",
        type: "mcq",
        prompt: "My brother ______ video games right now.",
        choices: ["is playing", "plays", "play", "are playing"],
        answer: "is playing",
        explanation: "Use 'is playing' because the subject 'My brother' is singular (he) and it's happening now."
    },
    {
        id: "pc_011",
        tenseSlug: "present-continuous",
        type: "fill_blank",
        prompt: "Look at the sky! It ______ (rain).",
        answer: "is raining",
        explanation: "Use 'is' + verb-ing (raining) for singular subjects (it) happening now."
    },
    {
        id: "pc_012",
        tenseSlug: "present-continuous",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["not", "is", "working", "He", "today"],
        answer: "He is not working today",
        explanation: "Negative structure: Subject + is/am/are + not + verb-ing."
    },
    {
        id: "pc_013",
        tenseSlug: "present-continuous",
        type: "mcq",
        prompt: "I ______ to music.",
        choices: ["listening", "am listening", "is listening", "listen"],
        answer: "am listening",
        explanation: "Always use 'am' with 'I' in Present Continuous: I am listening."
    },
    {
        id: "pc_014",
        tenseSlug: "present-continuous",
        type: "fill_blank",
        prompt: "The children ______ (sleep) currently, please be quiet.",
        answer: "are sleeping",
        explanation: "Plural subject (children = they) takes 'are' + verb-ing (sleeping)."
    },
    {
        id: "pc_015",
        tenseSlug: "present-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["learning", "am", "I", "French", "this", "year"],
        answer: "I am learning French this year",
        explanation: "Use Present Continuous for long-term temporary actions (this year)."
    }

];

// Present Perfect Question Bank
export const PRESENT_PERFECT_QUESTIONS: FocusQuestion[] = [
    {
        id: "pp_001",
        tenseSlug: "present-perfect",
        type: "mcq",
        prompt: "I ______ sushi before.",
        choices: ["have eaten", "ate", "eating", "eat"],
        answer: "have eaten",
        explanation: "Use Present Perfect (have + past participle) for general life experiences (unspecified time)."
    },
    {
        id: "pp_002",
        tenseSlug: "present-perfect",
        type: "mcq",
        prompt: "She ______ her keys. She can't open the door.",
        choices: ["has lost", "lost", "have lost", "lose"],
        answer: "has lost",
        explanation: "Use Present Perfect for past actions with a result in the present (She can't open the door now)."
    },
    {
        id: "pp_003",
        tenseSlug: "present-perfect",
        type: "fill_blank",
        prompt: "We ______ (not/see) him today.",
        answer: "have not seen",
        explanation: "Use Present Perfect with unfinished time periods like 'today'. 'Haven't seen' is also correct."
    },
    {
        id: "pp_004",
        tenseSlug: "present-perfect",
        type: "mcq",
        prompt: "______ you seen this movie?",
        choices: ["Have", "Did", "Has", "Do"],
        answer: "Have",
        explanation: "Question form: Have/Has + subject + past participle."
    },
    {
        id: "pp_005",
        tenseSlug: "present-perfect",
        type: "fill_blank",
        prompt: "She ______ (write) three books so far.",
        answer: "has written",
        explanation: "Use Present Perfect for achievements or quantities 'so far'."
    },
    {
        id: "pp_006",
        tenseSlug: "present-perfect",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["already", "lunch", "eaten", "have", "I"],
        answer: "I have already eaten lunch",
        explanation: "'Already' usually goes between the auxiliary 'have' and the main verb 'eaten'."
    },
    {
        id: "pp_007",
        tenseSlug: "present-perfect",
        type: "mcq",
        prompt: "They ______ here for ten years.",
        choices: ["have lived", "lived", "live", "living"],
        answer: "have lived",
        explanation: "Use Present Perfect with 'for' or 'since' to describe situations that started in the past and continue now."
    },
    {
        id: "pp_008",
        tenseSlug: "present-perfect",
        type: "fill_blank",
        prompt: "______ (you/ever/be) to Paris?",
        answer: "Have you ever been",
        explanation: "Use 'Have you ever been' to ask about life experiences."
    },
    {
        id: "pp_009",
        tenseSlug: "present-perfect",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["yet", "finished", "Have", "they", "?"],
        answer: "Have they finished yet?",
        explanation: "'Yet' is used in questions and negatives, usually at the end of the sentence."
    },
    {
        id: "pp_010",
        tenseSlug: "present-perfect",
        type: "mcq",
        prompt: "He ______ just finished his homework.",
        choices: ["has", "have", "is", "did"],
        answer: "has",
        explanation: "Use 'has' (third person singular) + 'just' + past participle for very recent actions."
    },
    {
        id: "pp_011",
        tenseSlug: "present-perfect",
        type: "fill_blank",
        prompt: "I ______ (know) him since 2010.",
        answer: "have known",
        explanation: "Stative verbs like 'know' often use Present Perfect with 'since' to show duration."
    },
    {
        id: "pp_012",
        tenseSlug: "present-perfect",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["never", "We", "to", "been", "have", "Spain"],
        answer: "We have never been to Spain",
        explanation: "'Never' goes between 'have' and the past participle 'been'."
    },
    {
        id: "pp_013",
        tenseSlug: "present-perfect",
        type: "mcq",
        prompt: "Look! Someone ______ the window.",
        choices: ["has broken", "broke", "breaks", "is breaking"],
        answer: "has broken",
        explanation: "Use Present Perfect for a past action with visible evidence now (broken window)."
    },
    {
        id: "pp_014",
        tenseSlug: "present-perfect",
        type: "fill_blank",
        prompt: "They ______ (eat) all the cake!",
        answer: "have eaten",
        explanation: "Result in the present: There is no cake left."
    },
    {
        id: "pp_015",
        tenseSlug: "present-perfect",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["not", "My", "has", "arrived", "package", "yet"],
        answer: "My package has not arrived yet",
        explanation: "Negative form: Subject + has + not + past participle + yet."
    }

];

// Present Perfect Continuous Question Bank
export const PRESENT_PERFECT_CONTINUOUS_QUESTIONS: FocusQuestion[] = [
    {
        id: "ppc_001",
        tenseSlug: "present-perfect-continuous",
        type: "mcq",
        prompt: "My hands are dirty. I ______ the car.",
        choices: ["have been repairing", "repaired", "have repaired", "repair"],
        answer: "have been repairing",
        explanation: "Use Present Perfect Continuous for a past activity with visible results now (dirty hands)."
    },
    {
        id: "ppc_002",
        tenseSlug: "present-perfect-continuous",
        type: "mcq",
        prompt: "She ______ tennis for three years.",
        choices: ["has been playing", "is playing", "plays", "played"],
        answer: "has been playing",
        explanation: "Use Present Perfect Continuous with 'for' to emphasize duration of an action starting in the past and continuing."
    },
    {
        id: "ppc_003",
        tenseSlug: "present-perfect-continuous",
        type: "fill_blank",
        prompt: "It ______ (rain) all day.",
        answer: "has been raining",
        explanation: "Emphasize the duration of the activity (all day) with Present Perfect Continuous."
    },
    {
        id: "ppc_004",
        tenseSlug: "present-perfect-continuous",
        type: "mcq",
        prompt: "Why are you tired? ______ you ______?",
        choices: ["Have / been running", "Have / run", "Did / run", "Do / run"],
        answer: "Have / been running",
        explanation: "Use Present Perfect Continuous for recent activities explaining a present state (tiredness)."
    },
    {
        id: "ppc_005",
        tenseSlug: "present-perfect-continuous",
        type: "fill_blank",
        prompt: "We ______ (wait) for the bus since 2 PM.",
        answer: "have been waiting",
        explanation: "Action started in the past (2 PM) and is still continuing. Use have been + verb-ing."
    },
    {
        id: "ppc_006",
        tenseSlug: "present-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["working", "here", "I", "been", "have", "since", "2015"],
        answer: "I have been working here since 2015",
        explanation: "Subject + have/has been + verb-ing + duration (since 2015)."
    },
    {
        id: "ppc_007",
        tenseSlug: "present-perfect-continuous",
        type: "mcq",
        prompt: "They ______ TV for hours.",
        choices: ["have been watching", "are watching", "watched", "have watched"],
        answer: "have been watching",
        explanation: "Use Present Perfect Continuous to emphasize the length of time (for hours)."
    },
    {
        id: "ppc_008",
        tenseSlug: "present-perfect-continuous",
        type: "fill_blank",
        prompt: "______ (you/feel) okay lately?",
        answer: "Have you been feeling",
        explanation: "Question about recent continuous state: Have + subject + been + verb-ing."
    },
    {
        id: "ppc_009",
        tenseSlug: "present-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["been", "How", "learning", "long", "you", "have", "English", "?"],
        answer: "How long have you been learning English?",
        explanation: "Standard duration question: How long + have/has + subject + been + verb-ing."
    },
    {
        id: "ppc_010",
        tenseSlug: "present-perfect-continuous",
        type: "mcq",
        prompt: "He ______ too much recently. He gained weight.",
        choices: ["has been eating", "eats", "ate", "is eating"],
        answer: "has been eating",
        explanation: "Recent repetitive action with a present result (gained weight)."
    },
    {
        id: "ppc_011",
        tenseSlug: "present-perfect-continuous",
        type: "fill_blank",
        prompt: "She ______ (not/sleep) well lately.",
        answer: "has not been sleeping",
        explanation: "Negative form: Subject + has/have + not + been + verb-ing."
    },
    {
        id: "ppc_012",
        tenseSlug: "present-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["swimming", "wet", "is", "She", "because", "she", "been", "has"],
        answer: "She is wet because she has been swimming",
        explanation: "Explaining a present physical state (wet) with a recent continuous action."
    },
    {
        id: "ppc_013",
        tenseSlug: "present-perfect-continuous",
        type: "mcq",
        prompt: "How long ______ on this project?",
        choices: ["have you been working", "do you work", "are you working", "have you worked"],
        answer: "have you been working",
        explanation: "'How long' typically triggers Present Perfect Continuous for ongoing actions."
    },
    {
        id: "ppc_014",
        tenseSlug: "present-perfect-continuous",
        type: "fill_blank",
        prompt: "I ______ (try) to fix this computer all morning.",
        answer: "have been trying",
        explanation: "Single ongoing action filling a time period (all morning)."
    },
    {
        id: "ppc_015",
        tenseSlug: "present-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["not", "exercising", "He", "been", "recently", "has"],
        answer: "He has not been exercising recently",
        explanation: "Negative structure: Subject + has not been + verb-ing."
    }

];

// Map of all question banks by tense slug
export const FOCUS_QUESTION_BANKS: Record<string, FocusQuestion[]> = {
    "present-simple": PRESENT_SIMPLE_QUESTIONS,
    "present-continuous": PRESENT_CONTINUOUS_QUESTIONS,
    "present-perfect": PRESENT_PERFECT_QUESTIONS,
    "present-perfect-continuous": PRESENT_PERFECT_CONTINUOUS_QUESTIONS,
};
