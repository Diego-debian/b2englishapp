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
    },
    {
        id: "ps_018",
        tenseSlug: "present-simple",
        type: "mcq",
        prompt: "My parents ______ in New York.",
        choices: ["live", "lives", "living", "are live"],
        answer: "live",
        explanation: "Plural subject (My parents) takes the base verb 'live'."
    },
    {
        id: "ps_019",
        tenseSlug: "present-simple",
        type: "fill_blank",
        prompt: "______ (you/want) some water?",
        answer: "Do you want",
        explanation: "Question form: Do + subject + base verb."
    },
    {
        id: "ps_020",
        tenseSlug: "present-simple",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["usually", "gets", "up", "He", "late"],
        answer: "He usually gets up late",
        explanation: "Adverb 'usually' comes before the main verb 'gets'."
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
    },
    {
        id: "pc_016",
        tenseSlug: "present-continuous",
        type: "fill_blank",
        prompt: "I ______ (not/listen) to you.",
        answer: "am not listening",
        explanation: "Negative form: I am not + verb-ing."
    },
    {
        id: "pc_017",
        tenseSlug: "present-continuous",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["working", "Why", "you", "aren't", "?"],
        answer: "Why aren't you working?",
        explanation: "Negative question: Why + aren't + subject + verb-ing?"
    },
    {
        id: "pc_018",
        tenseSlug: "present-continuous",
        type: "mcq",
        prompt: "Look! The cat ______ the tree.",
        choices: ["is climbing", "climb", "climbs", "climbing"],
        answer: "is climbing",
        explanation: "Action happening right now (Look!)."
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
    },
    {
        id: "pp_016",
        tenseSlug: "present-perfect",
        type: "mcq",
        prompt: "I ______ this book three times.",
        choices: ["have read", "read", "has read", "reading"],
        answer: "have read",
        explanation: "Repeated action in an unfinished time period (life experience)."
    },
    {
        id: "pp_017",
        tenseSlug: "present-perfect",
        type: "fill_blank",
        prompt: "She ______ (never/eat) octopus.",
        answer: "has never eaten",
        explanation: "Experience: has + never + past participle (eaten)."
    },
    {
        id: "pp_018",
        tenseSlug: "present-perfect",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["seen", "Have", "recently", "him", "you", "?"],
        answer: "Have you seen him recently?",
        explanation: "Question: Have + subject + past participle + time marker?"
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
    },
    {
        id: "ppc_016",
        tenseSlug: "present-perfect-continuous",
        type: "fill_blank",
        prompt: "We ______ (cook) all morning.",
        answer: "have been cooking",
        explanation: "Action in progress for the whole morning."
    },
    {
        id: "ppc_017",
        tenseSlug: "present-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["been", "has", "It", "snowing", "yesterday", "since"],
        answer: "It has been snowing since yesterday",
        explanation: "Subject + has been + verb-ing + since + time."
    },
    {
        id: "ppc_018",
        tenseSlug: "present-perfect-continuous",
        type: "mcq",
        prompt: "My eyes are tired. I ______ reading too much.",
        choices: ["have been", "am", "was", "had"],
        answer: "have been",
        explanation: "Present result (tired eyes) from recent continuous activity."
    }
];

// Past Simple Question Bank
export const PAST_SIMPLE_QUESTIONS: FocusQuestion[] = [
    {
        id: "pas_001",
        tenseSlug: "past-simple",
        type: "mcq",
        prompt: "She ______ her grandmother yesterday.",
        choices: ["visits", "visited", "visiting", "visit"],
        answer: "visited",
        explanation: "Use the past form (-ed) for completed actions at a specific time (yesterday)."
    },
    {
        id: "pas_002",
        tenseSlug: "past-simple",
        type: "mcq",
        prompt: "We ______ to the cinema last night.",
        choices: ["go", "goed", "went", "gone"],
        answer: "went",
        explanation: "The verb 'go' is irregular in the Past Simple: go → went."
    },
    {
        id: "pas_003",
        tenseSlug: "past-simple",
        type: "mcq",
        prompt: "They ______ the party.",
        choices: ["didn't enjoyed", "didn't enjoy", "not enjoyed", "don't enjoy"],
        answer: "didn't enjoy",
        explanation: "Negative form: Subject + did not (didn't) + base verb (enjoy)."
    },
    {
        id: "pas_004",
        tenseSlug: "past-simple",
        type: "mcq",
        prompt: "______ you see the match last week?",
        choices: ["Do", "Did", "Have", "Were"],
        answer: "Did",
        explanation: "Questions in Past Simple starting with a verb use 'Did' + subject + base verb."
    },
    {
        id: "pas_005",
        tenseSlug: "past-simple",
        type: "fill_blank",
        prompt: "He ______ (buy) a new car two days ago.",
        answer: "bought",
        explanation: "Irregular verb: buy → bought."
    },
    {
        id: "pas_006",
        tenseSlug: "past-simple",
        type: "fill_blank",
        prompt: "I ______ (read) that book in high school.",
        answer: "read",
        explanation: "Irregular verb 'read' is spelled the same but pronounced 'red' in the past."
    },
    {
        id: "pas_007",
        tenseSlug: "past-simple",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["visited", "parents", "She", "last", "her", "weekend"],
        answer: "She visited her parents last weekend",
        explanation: "Subject (She) + past verb (visited) + object (her parents) + time (last weekend)."
    },
    {
        id: "pas_008",
        tenseSlug: "past-simple",
        type: "fill_blank",
        prompt: "Where ______ (they/go) for their holidays?",
        answer: "did they go",
        explanation: "Wh-question: Question word + did + subject + base verb."
    },
    {
        id: "pas_009",
        tenseSlug: "past-simple",
        type: "mcq",
        prompt: "She ______ very tired after the trip.",
        choices: ["was", "were", "is", "been"],
        answer: "was",
        explanation: "The past of 'be' is 'was' for singular subjects (she/he/it/I)."
    },
    {
        id: "pas_010",
        tenseSlug: "past-simple",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["didn't", "I", "question", "the", "understand"],
        answer: "I didn't understand the question",
        explanation: "Subject (I) + didn't + base verb (understand) + object (the question)."
    },
    {
        id: "pas_011",
        tenseSlug: "past-simple",
        type: "fill_blank",
        prompt: "The train ______ (leave) ten minutes ago.",
        answer: "left",
        explanation: "Irregular verb: leave → left."
    },
    {
        id: "pas_012",
        tenseSlug: "past-simple",
        type: "mcq",
        prompt: "When ______ ?",
        choices: ["did they arrive", "did they arrived", "arrived they", "do they arrive"],
        answer: "did they arrive",
        explanation: "Question structure: When + did + subject + base verb."
    },
    {
        id: "pas_013",
        tenseSlug: "past-simple",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["you", "homework", "Did", "finish", "your", "?"],
        answer: "Did you finish your homework?",
        explanation: "Yes/No question: Did + subject + base verb + object."
    },
    {
        id: "pas_014",
        tenseSlug: "past-simple",
        type: "fill_blank",
        prompt: "My parents ______ (meet) in 1990.",
        answer: "met",
        explanation: "Irregular verb: meet → met."
    },
    {
        id: "pas_015",
        tenseSlug: "past-simple",
        type: "fill_blank",
        prompt: "I ______ (not/have) breakfast this morning.",
        answer: "did not have",
        explanation: "Negative: did not + base verb. 'didn't have' is also correct."
    },
    {
        id: "pas_016",
        tenseSlug: "past-simple",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["house", "bought", "He", "a", "year", "last"],
        answer: "He bought a house last year",
        explanation: "Subject (He) + past verb (bought) + object (a house) + time (last year)."
    },
    {
        id: "pas_017",
        tenseSlug: "past-simple",
        type: "fill_blank",
        prompt: "I ______ (wake) up late yesterday.",
        answer: "woke",
        explanation: "Irregular verb: wake → woke."
    },
    {
        id: "pas_018",
        tenseSlug: "past-simple",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["didn't", "We", "the", "like", "hotel"],
        answer: "We didn't like the hotel",
        explanation: "Subject + didn't + base verb (like) + object."
    },
    {
        id: "pas_019",
        tenseSlug: "past-simple",
        type: "mcq",
        prompt: "Where ______ you buy that shirt?",
        choices: ["did", "do", "were", "had"],
        answer: "did",
        explanation: "Question in Past Simple: Question word + did + subject + base verb?"
    }
];

// Past Continuous Question Bank
export const PAST_CONTINUOUS_QUESTIONS: FocusQuestion[] = [
    {
        id: "pc_past_001",
        tenseSlug: "past-continuous",
        type: "mcq",
        prompt: "I ______ dinner at 8 p.m. yesterday.",
        choices: ["was cooking", "cooked", "am cooking", "cook"],
        answer: "was cooking",
        explanation: "Use Past Continuous for an action in progress at a specific time in the past."
    },
    {
        id: "pc_past_002",
        tenseSlug: "past-continuous",
        type: "mcq",
        prompt: "They ______ TV when I arrived.",
        choices: ["watched", "were watching", "are watching", "have watched"],
        answer: "were watching",
        explanation: "Action in progress (watching TV) interrupted by a short action (arrived)."
    },
    {
        id: "pc_past_003",
        tenseSlug: "past-continuous",
        type: "mcq",
        prompt: "While she was reading, he ______ video games.",
        choices: ["played", "is playing", "was playing", "plays"],
        answer: "was playing",
        explanation: "Two parallel actions happening at the same time in the past: While + Past Continuous."
    },
    {
        id: "pc_past_004",
        tenseSlug: "past-continuous",
        type: "mcq",
        prompt: "______ it raining when you left?",
        choices: ["Did", "Was", "Were", "Is"],
        answer: "Was",
        explanation: "Question form: Was/Were + subject + verb-ing. 'It' takes 'Was'."
    },
    {
        id: "pc_past_005",
        tenseSlug: "past-continuous",
        type: "fill_blank",
        prompt: "He ______ (sleep) continuously until noon.",
        answer: "was sleeping",
        explanation: "Subject (He) + was + verb-ing (sleeping)."
    },
    {
        id: "pc_past_006",
        tenseSlug: "past-continuous",
        type: "fill_blank",
        prompt: "We ______ (not/wait) for you, we were waiting for the bus.",
        answer: "were not waiting",
        explanation: "Negative: Subject + was/were + not + verb-ing. 'weren't waiting' is also correct."
    },
    {
        id: "pc_past_007",
        tenseSlug: "past-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["working", "was", "She", "all", "night"],
        answer: "She was working all night",
        explanation: "Subject (She) + was + verb-ing (working) + time expression."
    },
    {
        id: "pc_past_008",
        tenseSlug: "past-continuous",
        type: "fill_blank",
        prompt: "What ______ (you/do) at 10 o'clock?",
        answer: "were you doing",
        explanation: "Wh-question: What + were/was + subject + verb-ing?"
    },
    {
        id: "pc_past_009",
        tenseSlug: "past-continuous",
        type: "mcq",
        prompt: "You ______ listening to me!",
        choices: ["weren't", "wasn't", "didn't", "aren't"],
        answer: "weren't",
        explanation: "Negative with 'You': You were not (weren't) listening."
    },
    {
        id: "pc_past_010",
        tenseSlug: "past-continuous",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["wasn't", "driving", "He", "fast"],
        answer: "He wasn't driving fast",
        explanation: "Subject (He) + wasn't + verb-ing (driving) + adverb."
    },
    {
        id: "pc_past_011",
        tenseSlug: "past-continuous",
        type: "fill_blank",
        prompt: "The kids ______ (play) in the garden all afternoon.",
        answer: "were playing",
        explanation: "Plural subject (The kids) + were + verb-ing."
    },
    {
        id: "pc_past_012",
        tenseSlug: "past-continuous",
        type: "mcq",
        prompt: "______ they arguing again?",
        choices: ["Did", "Do", "Were", "Have"],
        answer: "Were",
        explanation: "Question with plural subject: Were + they + verb-ing?"
    },
    {
        id: "pc_past_013",
        tenseSlug: "past-continuous",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["laughing", "Were", "you", "why", "?"],
        answer: "Why were you laughing?",
        explanation: "Wh-question: Question word + were + subject + verb-ing?"
    },
    {
        id: "pc_past_014",
        tenseSlug: "past-continuous",
        type: "fill_blank",
        prompt: "I ______ (walk) down the street when I saw him.",
        answer: "was walking",
        explanation: "Longer action in progress (walking) interrupted by shorter action (saw)."
    },
    {
        id: "pc_past_015",
        tenseSlug: "past-continuous",
        type: "fill_blank",
        prompt: "My computer ______ (make) a strange noise.",
        answer: "was making",
        explanation: "Singular subject (computer) + was + verb-ing."
    },
    {
        id: "pc_past_016",
        tenseSlug: "past-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["sun", "shining", "was", "The", "brightly"],
        answer: "The sun was shining brightly",
        explanation: "Subject (The sun) + was + verb-ing + adverb."
    },
    {
        id: "pc_past_017",
        tenseSlug: "past-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["sleeping", "while", "I", "working", "was", "were", "You"],
        answer: "You were sleeping while I was working",
        explanation: "Two parallel actions: Subject 1 + were ... while + Subject 2 + was ..."
    },
    {
        id: "pc_past_018",
        tenseSlug: "past-continuous",
        type: "fill_blank",
        prompt: "It ______ (snow) when we left the house.",
        answer: "was snowing",
        explanation: "Background action (was snowing) when a specific event occurred."
    },
    {
        id: "pc_past_019",
        tenseSlug: "past-continuous",
        type: "mcq",
        prompt: "What were you doing when the phone ______?",
        choices: ["rang", "was ringing", "rings", "ring"],
        answer: "rang",
        explanation: "Shorter interrupting action takes Past Simple (rang)."
    }
];

// Past Perfect Question Bank
export const PAST_PERFECT_QUESTIONS: FocusQuestion[] = [
    {
        id: "pp_past_001",
        tenseSlug: "past-perfect",
        type: "mcq",
        prompt: "When I arrived at the station, the train ______ left.",
        choices: ["has", "have", "had", "was"],
        answer: "had",
        explanation: "Use Past Perfect (had + past participle) for an action that happened before another past action."
    },
    {
        id: "pp_past_002",
        tenseSlug: "past-perfect",
        type: "mcq",
        prompt: "She was hungry because she ______ eaten all day.",
        choices: ["hadn't", "hasn't", "didn't", "don't"],
        answer: "hadn't",
        explanation: "Negative form: Subject + had not (hadn't) + past participle. Explains the cause of a past state."
    },
    {
        id: "pp_past_003",
        tenseSlug: "past-perfect",
        type: "mcq",
        prompt: "By the time we got there, the movie ______.",
        choices: ["finished", "has finished", "had finished", "finishes"],
        answer: "had finished",
        explanation: "'By the time' is a common marker for Past Perfect. The movie finished *before* we got there."
    },
    {
        id: "pp_past_004",
        tenseSlug: "past-perfect",
        type: "fill_blank",
        prompt: "I ______ (never/see) such a beautiful beach before that trip.",
        answer: "had never seen",
        explanation: "Use Past Perfect for experiences before a specific time in the past."
    },
    {
        id: "pp_past_005",
        tenseSlug: "past-perfect",
        type: "fill_blank",
        prompt: "They ______ (live) in London for ten years before they moved to Paris.",
        answer: "had lived",
        explanation: "Action happening for a duration *before* another past event (moved)."
    },
    {
        id: "pp_past_006",
        tenseSlug: "past-perfect",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["forgotten", "wallet", "He", "had", "his"],
        answer: "He had forgotten his wallet",
        explanation: "Subject (He) + had + past participle (forgotten) + object."
    },
    {
        id: "pp_past_007",
        tenseSlug: "past-perfect",
        type: "mcq",
        prompt: "______ you finished your homework before you went out?",
        choices: ["Did", "Had", "Have", "Were"],
        answer: "Had",
        explanation: "Question form: Had + subject + past participle?"
    },
    {
        id: "pp_past_008",
        tenseSlug: "past-perfect",
        type: "fill_blank",
        prompt: "She ______ (study) English before she visited the US.",
        answer: "had studied",
        explanation: "Action completed (studied) before another past action (visited)."
    },
    {
        id: "pp_past_009",
        tenseSlug: "past-perfect",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["hadn't", "I", "met", "before", "him"],
        answer: "I hadn't met him before",
        explanation: "Subject (I) + hadn't + past participle (met) + time marker."
    },
    {
        id: "pp_past_010",
        tenseSlug: "past-perfect",
        type: "fill_blank",
        prompt: "The garden was dead because it ______ (be) dry all summer.",
        answer: "had been",
        explanation: "Irregular participle: be → been. Explains the reason for the garden's state."
    },
    {
        id: "pp_past_011",
        tenseSlug: "past-perfect",
        type: "mcq",
        prompt: "We were late. The meeting ______ already started.",
        choices: ["has", "had", "have", "was"],
        answer: "had",
        explanation: "Use 'had' + 'already' to emphasize the action happened earlier than expected relative to the past moment."
    },
    {
        id: "pp_past_012",
        tenseSlug: "past-perfect",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["they", "left", "Had", "arrived", "before", "you", "?"],
        answer: "Had they left before you arrived?",
        explanation: "Had + subject + past participle ... before + subject + past simple?"
    },
    {
        id: "pp_past_013",
        tenseSlug: "past-perfect",
        type: "fill_blank",
        prompt: "I realized I ______ (loose) my keys.",
        answer: "had lost",
        explanation: "Realized in the past that something *had happened* even earlier. Note: 'lost' is the past participle of 'lose'."
    },
    {
        id: "pp_past_014",
        tenseSlug: "past-perfect",
        type: "mcq",
        prompt: "After he ______ his work, he went home.",
        choices: ["had finished", "finished", "finishes", "has finished"],
        answer: "had finished",
        explanation: "'After' + Past Perfect makes the sequence of events clear (finished first, then went home)."
    },
    {
        id: "pp_past_015",
        tenseSlug: "past-perfect",
        type: "fill_blank",
        prompt: "The streets were wet. It ______ (rain) during the night.",
        answer: "had rained",
        explanation: "Past evidence (wet streets) of a previous action (had rained)."
    },
    {
        id: "pp_past_016",
        tenseSlug: "past-perfect",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["cooked", "already", "She", "dinner", "had"],
        answer: "She had already cooked dinner",
        explanation: "Adverbs like 'already' go between 'had' and the past participle."
    },
    {
        id: "pp_past_017",
        tenseSlug: "past-perfect",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["had", "The", "started", "game", "already"],
        answer: "The game had already started",
        explanation: "Subject + had + adverb + past participle."
    },
    {
        id: "pp_past_018",
        tenseSlug: "past-perfect",
        type: "mcq",
        prompt: "She felt sick because she ______ too much.",
        choices: ["had eaten", "has eaten", "was eating", "ate"],
        answer: "had eaten",
        explanation: "The cause (had eaten) happened before the effect (felt sick)."
    },
    {
        id: "pp_past_019",
        tenseSlug: "past-perfect",
        type: "fill_blank",
        prompt: "He ______ (work) as a teacher before he became a writer.",
        answer: "had worked",
        explanation: "Action completed before another past event (became)."
    }
];

// Past Perfect Continuous Question Bank
export const PAST_PERFECT_CONTINUOUS_QUESTIONS: FocusQuestion[] = [
    {
        id: "ppc_past_001",
        tenseSlug: "past-perfect-continuous",
        type: "mcq",
        prompt: "It ______ raining for two hours before it finally stopped.",
        choices: ["had been", "has been", "was", "is"],
        answer: "had been",
        explanation: "Use Past Perfect Continuous (had been + -ing) for an action happening for a duration before another past event."
    },
    {
        id: "ppc_past_002",
        tenseSlug: "past-perfect-continuous",
        type: "mcq",
        prompt: "They were tired because they ______ playing football all afternoon.",
        choices: ["had been", "have been", "were", "are"],
        answer: "had been",
        explanation: "Explains the cause (playing for a duration) of a past state (tired)."
    },
    {
        id: "ppc_past_003",
        tenseSlug: "past-perfect-continuous",
        type: "mcq",
        prompt: "How long ______ you ______ waiting when the bus arrived?",
        choices: ["had / been", "have / been", "were / being", "did / be"],
        answer: "had / been",
        explanation: "Question about duration up to a past moment: Had you been waiting?"
    },
    {
        id: "ppc_past_004",
        tenseSlug: "past-perfect-continuous",
        type: "fill_blank",
        prompt: "He ______ (work) at the company for 10 years when he quit.",
        answer: "had been working",
        explanation: "Duration before a past event: had + been + working."
    },
    {
        id: "ppc_past_005",
        tenseSlug: "past-perfect-continuous",
        type: "fill_blank",
        prompt: "I ______ (not/sleep) well before the exam, so I was exhausted.",
        answer: "had not been sleeping",
        explanation: "Negative form: had + not + been + sleeping. 'hadn't been sleeping' is also correct."
    },
    {
        id: "ppc_past_006",
        tenseSlug: "past-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["been", "She", "waiting", "had", "hours", "for", "two"],
        answer: "She had been waiting for two hours",
        explanation: "Subject (She) + had been + verb-ing (waiting) + duration."
    },
    {
        id: "ppc_past_007",
        tenseSlug: "past-perfect-continuous",
        type: "mcq",
        prompt: "The roads were wet. It ______ all night.",
        choices: ["had been raining", "has rained", "was raining", "rains"],
        answer: "had been raining",
        explanation: "Past evidence (wet roads) of a prolonged recent activity (raining)."
    },
    {
        id: "ppc_past_008",
        tenseSlug: "past-perfect-continuous",
        type: "fill_blank",
        prompt: "We ______ (drive) for six hours when we ran out of gas.",
        answer: "had been driving",
        explanation: "Activity in progress (driving) for a duration leading up to another past event (ran out of gas)."
    },
    {
        id: "ppc_past_009",
        tenseSlug: "past-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["paying", "been", "I", "attention", "hadn't"],
        answer: "I hadn't been paying attention",
        explanation: "Subject + hadn't been + verb-ing (paying attention)."
    },
    {
        id: "ppc_past_010",
        tenseSlug: "past-perfect-continuous",
        type: "fill_blank",
        prompt: "They ______ (try) to fix the car for hours before help arrived.",
        answer: "had been trying",
        explanation: "Had + been + verb-ing (trying) emphasizing the length of the attempt."
    },
    {
        id: "ppc_past_011",
        tenseSlug: "past-perfect-continuous",
        type: "mcq",
        prompt: "She went to the doctor because she ______ feeling well.",
        choices: ["hadn't been", "hasn't been", "wasn't", "isn't"],
        answer: "hadn't been",
        explanation: "Continuous state leading up to a past action. 'hadn't been feeling' emphasizes the period of illness."
    },
    {
        id: "ppc_past_012",
        tenseSlug: "past-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["long", "learning", "Had", "been", "he", "Spanish", "?"],
        answer: "Had he been learning Spanish long?",
        explanation: "Had + subject + been + verb-ing?"
    },
    {
        id: "ppc_past_013",
        tenseSlug: "past-perfect-continuous",
        type: "fill_blank",
        prompt: "I ______ (hope) to meet her, but she didn't come.",
        answer: "had been hoping",
        explanation: "Had been hoping: continuous desire up to a past moment."
    },
    {
        id: "ppc_past_014",
        tenseSlug: "past-perfect-continuous",
        type: "mcq",
        prompt: "By the time the race finished, they ______ for over an hour.",
        choices: ["had been running", "ran", "were running", "run"],
        answer: "had been running",
        explanation: "'By the time' + duration often signals Past Perfect Continuous."
    },
    {
        id: "ppc_past_015",
        tenseSlug: "past-perfect-continuous",
        type: "fill_blank",
        prompt: "The kitchen was a mess because he ______ (cook).",
        answer: "had been cooking",
        explanation: "Result in the past (mess) of a recent continuous activity (cooking)."
    },
    {
        id: "ppc_past_016",
        tenseSlug: "past-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["living", "had", "there", "He", "since", "2010", "been"],
        answer: "He had been living there since 2010",
        explanation: "Subject + had been + verb-ing + since + date."
    },
    {
        id: "ppc_past_017",
        tenseSlug: "past-perfect-continuous",
        type: "fill_blank",
        prompt: "The grass was yellow. It ______ (not/rain) for months.",
        answer: "had not been raining",
        explanation: "Negative duration causing a past state."
    },
    {
        id: "ppc_past_018",
        tenseSlug: "past-perfect-continuous",
        type: "mcq",
        prompt: "They ______ waiting for 20 minutes when the bus came.",
        choices: ["had been", "have been", "were", "are"],
        answer: "had been",
        explanation: "Duration up to a past moment requires Past Perfect Continuous."
    },
    {
        id: "ppc_past_019",
        tenseSlug: "past-perfect-continuous",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["been", "had", "crying", "She", "?"],
        answer: "Had she been crying?",
        explanation: "Question form: Had + subject + been + verb-ing?"
    }
];

// Future (Will) Question Bank
export const FUTURE_WILL_QUESTIONS: FocusQuestion[] = [
    {
        id: "will_001",
        tenseSlug: "will",
        type: "mcq",
        prompt: "It's cold in here. I ______ close the window.",
        choices: ["will", "am going to", "closing", "close"],
        answer: "will",
        explanation: "Spontaneous decision made at the moment of speaking (I'm cold -> I'll close it)."
    },
    {
        id: "will_002",
        tenseSlug: "will",
        type: "mcq",
        prompt: "Don't worry, I ______ tell anyone your secret.",
        choices: ["won't", "don't", "not will", "am not"],
        answer: "won't",
        explanation: "A promise: I will not (won't) tell anyone."
    },
    {
        id: "will_003",
        tenseSlug: "will",
        type: "mcq",
        prompt: "I think it ______ rain later.",
        choices: ["will", "is raining", "rains", "has rained"],
        answer: "will",
        explanation: "Prediction based on opinion (I think...) rather than present evidence."
    },
    {
        id: "will_004",
        tenseSlug: "will",
        type: "fill_blank",
        prompt: "The phone is ringing. I ______ (get) it.",
        answer: "will get",
        explanation: "Spontaneous decision: 'I'll get it'."
    },
    {
        id: "will_005",
        tenseSlug: "will",
        type: "fill_blank",
        prompt: "I promise I ______ (not/be) late again.",
        answer: "won't be",
        explanation: "Negative promise: will not be -> won't be."
    },
    {
        id: "will_006",
        tenseSlug: "will",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["help", "will", "homework", "I", "with", "you", "your"],
        answer: "I will help you with your homework",
        explanation: "Offer of help: Subject (I) + will + verb (help) + object."
    },
    {
        id: "will_007",
        tenseSlug: "will",
        type: "mcq",
        prompt: "That bag looks heavy. ______ I carry it for you?",
        choices: ["Shall", "Will", "Do", "Am"],
        answer: "Shall",
        explanation: "Use 'Shall I...?' to make a polite offer. 'Will I' is generally not used for offers."
    },
    {
        id: "will_008",
        tenseSlug: "will",
        type: "fill_blank",
        prompt: "______ (you/marry) me?",
        answer: "Will you marry",
        explanation: "Proposal/Question: Will + subject + verb?"
    },
    {
        id: "will_009",
        tenseSlug: "will",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["come", "party", "She", "to", "won't", "the"],
        answer: "She won't come to the party",
        explanation: "Refusal/Prediction: Subject + won't + verb."
    },
    {
        id: "will_010",
        tenseSlug: "will",
        type: "fill_blank",
        prompt: "I'm sure they ______ (win) the match.",
        answer: "will win",
        explanation: "Prediction expressing certainty (I'm sure)."
    },
    {
        id: "will_011",
        tenseSlug: "will",
        type: "mcq",
        prompt: "I ______ definitely be there on time.",
        choices: ["will", "am", "going to", "do"],
        answer: "will",
        explanation: "Future prediction with adverb: 'will definitely'."
    },
    {
        id: "will_012",
        tenseSlug: "will",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["us", "wait", "Will", "for", "they", "?"],
        answer: "Will they wait for us?",
        explanation: "Question: Will + subject + verb...?"
    },
    {
        id: "will_013",
        tenseSlug: "will",
        type: "fill_blank",
        prompt: "I ______ (probably/stay) home tonight.",
        answer: "will probably stay",
        explanation: "Position of adverb: 'will' + probably + verb. 'probably will stay' is also possible but less common."
    },
    {
        id: "will_014",
        tenseSlug: "will",
        type: "mcq",
        prompt: "If you don't hurry, you ______ miss the bus.",
        choices: ["will", "would", "did", "are"],
        answer: "will",
        explanation: "First Conditional: If + Present Simple, ... will + verb."
    },
    {
        id: "will_015",
        tenseSlug: "will",
        type: "fill_blank",
        prompt: "We ______ (always/love) you.",
        answer: "will always love",
        explanation: "Promise/Prediction with frequency adverb: will + always + verb."
    },
    {
        id: "will_016",
        tenseSlug: "will",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["think", "pass", "I", "exam", "she", "will", "the"],
        answer: "I think she will pass the exam",
        explanation: "Opinion + Prediction: I think + subject + will + verb."
    },
    {
        id: "will_017",
        tenseSlug: "will",
        type: "fill_blank",
        prompt: "I'm hungry. I ______ (make) a sandwich.",
        answer: "will make",
        explanation: "Spontaneous decision at the moment of speaking."
    },
    {
        id: "will_018",
        tenseSlug: "will",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["tell", "won't", "I", "anyone", "promise", "I"],
        answer: "I promise I won't tell anyone",
        explanation: "Promise: I promise + I + won't + verb."
    },
    {
        id: "will_019",
        tenseSlug: "will",
        type: "mcq",
        prompt: "Do you think it ______ snow?",
        choices: ["will", "is", "goes to", "did"],
        answer: "will",
        explanation: "Asking for a prediction."
    }
];

// Future (Going to) Question Bank
export const FUTURE_GOING_TO_QUESTIONS: FocusQuestion[] = [
    {
        id: "going_to_001",
        tenseSlug: "going-to",
        type: "mcq",
        prompt: "Why are you buying flour? ______ (make) a cake.",
        choices: ["I'm going to make", "I will make", "I make", "I making"],
        answer: "I'm going to make",
        explanation: "Intention/Plan: You have decided to do it before speaking (hence the flour)."
    },
    {
        id: "going_to_002",
        tenseSlug: "going-to",
        type: "mcq",
        prompt: "Look at those dark clouds! It ______ rain.",
        choices: ["is going to", "will", "is", "goes to"],
        answer: "is going to",
        explanation: "Prediction based on present evidence (the clouds)."
    },
    {
        id: "going_to_003",
        tenseSlug: "going-to",
        type: "mcq",
        prompt: "We ______ (visit) our grandparents this weekend. We planned it yesterday.",
        choices: ["are going to visit", "will visit", "visit", "are visiting to"],
        answer: "are going to visit",
        explanation: "Plan/Arrangement decided in the past for the future."
    },
    {
        id: "going_to_004",
        tenseSlug: "going-to",
        type: "fill_blank",
        prompt: "I ______ (study) medicine next year.",
        answer: "am going to study",
        explanation: "Future plan/intention: am + going to + verb."
    },
    {
        id: "going_to_005",
        tenseSlug: "going-to",
        type: "fill_blank",
        prompt: "She ______ (not/buy) the car because it's too expensive.",
        answer: "is not going to buy",
        explanation: "Negative intention: is + not + going to + verb. 'isn't going to buy' is also correct."
    },
    {
        id: "going_to_006",
        tenseSlug: "going-to",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["pizza", "to", "We", "eat", "going", "are", "tonight"],
        answer: "We are going to eat pizza tonight",
        explanation: "Subject (We) + are going to + verb (eat) + object + time."
    },
    {
        id: "going_to_007",
        tenseSlug: "going-to",
        type: "mcq",
        prompt: "Watch out! You ______ fall!",
        choices: ["are going to", "will", "do", "have"],
        answer: "are going to",
        explanation: "Prediction based on immediate evidence (you are seeing it happen)."
    },
    {
        id: "going_to_008",
        tenseSlug: "going-to",
        type: "fill_blank",
        prompt: " ______ (you/invite) him to the party?",
        answer: "Are you going to invite",
        explanation: "Question about intention: Are + subject + going to + verb?"
    },
    {
        id: "going_to_009",
        tenseSlug: "going-to",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["going", "lie", "to", "I'm", "you", "not", "to"],
        answer: "I'm not going to lie to you",
        explanation: "Subject + am not (I'm not) + going to + verb."
    },
    {
        id: "going_to_010",
        tenseSlug: "going-to",
        type: "fill_blank",
        prompt: "He ______ (start) his new job on Monday.",
        answer: "is going to start",
        explanation: "Plan/Schedule: is + going to + verb."
    },
    {
        id: "going_to_011",
        tenseSlug: "going-to",
        type: "mcq",
        prompt: "They sold their house. They ______ move to Spain.",
        choices: ["are going to", "will", "go to", "are"],
        answer: "are going to",
        explanation: "Clear intention/plan supported by previous action (selling the house)."
    },
    {
        id: "going_to_012",
        tenseSlug: "going-to",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["going", "Is", "rain", "it", "to", "?"],
        answer: "Is it going to rain?",
        explanation: "Prediction question: Is + it + going to + verb?"
    },
    {
        id: "going_to_013",
        tenseSlug: "going-to",
        type: "fill_blank",
        prompt: "We ______ (not/stay) at a hotel; we have a tent.",
        answer: "aren't going to stay",
        explanation: "Negative plan: are not (aren't) + going to + stay."
    },
    {
        id: "going_to_014",
        tenseSlug: "going-to",
        type: "mcq",
        prompt: "I feel terrible. I think I ______ be sick.",
        choices: ["am going to", "will", "am", "go"],
        answer: "am going to",
        explanation: "Evidence in the body (feel terrible) predicts near future event."
    },
    {
        id: "going_to_015",
        tenseSlug: "going-to",
        type: "fill_blank",
        prompt: "What ______ (you/wear) to the interview?",
        answer: "are you going to wear",
        explanation: "Wh-Question about plan: What + are + subject + going to + wear?"
    },
    {
        id: "going_to_016",
        tenseSlug: "going-to",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["soon", "going", "call", "He's", "to", "us"],
        answer: "He's going to call us soon",
        explanation: "Subject + is (He's) + going to + verb + object + time."
    },
    {
        id: "going_to_017",
        tenseSlug: "going-to",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["going", "visit", "to", "We", "are", "Paris"],
        answer: "We are going to visit Paris",
        explanation: "Intention/Plan: Subject + are + going to + visit."
    },
    {
        id: "going_to_018",
        tenseSlug: "going-to",
        type: "fill_blank",
        prompt: "Look at the traffic. We ______ (be) late.",
        answer: "are going to be",
        explanation: "Prediction based on evidence (traffic)."
    },
    {
        id: "going_to_019",
        tenseSlug: "going-to",
        type: "mcq",
        prompt: "What ______ you going to do?",
        choices: ["are", "do", "will", "have"],
        answer: "are",
        explanation: "Question form: What + are + subject + going to do?"
    }
];

// Future Continuous Question Bank
export const FUTURE_CONTINUOUS_QUESTIONS: FocusQuestion[] = [
    {
        id: "fc_001",
        tenseSlug: "future-continuous",
        type: "mcq",
        prompt: "At 10 a.m. tomorrow, I ______ in my office.",
        choices: ["will be working", "will work", "work", "am working"],
        answer: "will be working",
        explanation: "Action in progress at a specific time in the future (10 a.m. tomorrow)."
    },
    {
        id: "fc_002",
        tenseSlug: "future-continuous",
        type: "mcq",
        prompt: "Don't call me at 6. I ______ dinner.",
        choices: ["will be cooking", "cook", "will cook", "am cooking"],
        answer: "will be cooking",
        explanation: "Action in progress (cooking) at a future moment (6 o'clock)."
    },
    {
        id: "fc_003",
        tenseSlug: "future-continuous",
        type: "mcq",
        prompt: "This time next week, we ______ on the beach.",
        choices: ["will be lying", "are lying", "will lie", "lie"],
        answer: "will be lying",
        explanation: "Use Future Continuous for something happening at specific moment in the future (This time next week)."
    },
    {
        id: "fc_004",
        tenseSlug: "future-continuous",
        type: "fill_blank",
        prompt: "I ______ (wait) for you when you arrive.",
        answer: "will be waiting",
        explanation: "Action in progress (waiting) when another future event occurs (arrive)."
    },
    {
        id: "fc_005",
        tenseSlug: "future-continuous",
        type: "fill_blank",
        prompt: "She ______ (not/sleep) when you get home.",
        answer: "won't be sleeping",
        explanation: "Negative form: will + not + be + sleeping. 'will not be sleeping' is also correct."
    },
    {
        id: "fc_006",
        tenseSlug: "future-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["be", "I", "working", "tomorrow", "will", "all", "day"],
        answer: "I will be working all day tomorrow",
        explanation: "Subject (I) + will be + verb-ing (working) + time expression."
    },
    {
        id: "fc_007",
        tenseSlug: "future-continuous",
        type: "mcq",
        prompt: "______ using your computer tonight?",
        choices: ["Will you be", "Are you", "Do you", "Will you"],
        answer: "Will you be",
        explanation: "Polite question about someone's plans: Will + you + be + verb-ing?"
    },
    {
        id: "fc_008",
        tenseSlug: "future-continuous",
        type: "fill_blank",
        prompt: "What ______ (you/do) at 8 o'clock?",
        answer: "will you be doing",
        explanation: "Question about activity in progress at a specific time: What + will + subject + be + verb-ing?"
    },
    {
        id: "fc_009",
        tenseSlug: "future-continuous",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["using", "won't", "the", "be", "car", "We"],
        answer: "We won't be using the car",
        explanation: "Subject (We) + won't be + verb-ing (using) + object."
    },
    {
        id: "fc_010",
        tenseSlug: "future-continuous",
        type: "fill_blank",
        prompt: "They ______ (stay) with us for a week.",
        answer: "will be staying",
        explanation: "Future arrangement/plan viewed as an activity in progress over a period."
    },
    {
        id: "fc_011",
        tenseSlug: "future-continuous",
        type: "mcq",
        prompt: "Unfortunately, I ______ attending the meeting.",
        choices: ["won't be", "am not", "don't", "won't"],
        answer: "won't be",
        explanation: "Polite way to say you are unable to do something (won't be attending)."
    },
    {
        id: "fc_012",
        tenseSlug: "future-continuous",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["be", "Will", "passing", "you", "post", "office", "the", "?"],
        answer: "Will you be passing the post office?",
        explanation: "Question about future progress/route: Will + you + be + passing...?"
    },
    {
        id: "fc_013",
        tenseSlug: "future-continuous",
        type: "fill_blank",
        prompt: "In a few years, everyone ______ (drive) electric cars.",
        answer: "will be driving",
        explanation: "Prediction about general state/activity in progress in the future."
    },
    {
        id: "fc_014",
        tenseSlug: "future-continuous",
        type: "mcq",
        prompt: "We ______ thinking of you while you're away.",
        choices: ["will be", "are", "will", "going to"],
        answer: "will be",
        explanation: "Continuous future emotional state: will be + thinking."
    },
    {
        id: "fc_015",
        tenseSlug: "future-continuous",
        type: "fill_blank",
        prompt: "I ______ (miss) you when you leave.",
        answer: "will be missing",
        explanation: "Note: 'will miss' is also common, but 'will be missing' emphasizes the ongoing feeling."
    },
    {
        id: "fc_016",
        tenseSlug: "future-continuous",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["taking", "She", "exam", "be", "will", "her", "soon"],
        answer: "She will be taking her exam soon",
        explanation: "Subject (She) + will be + verb-ing (taking) + object + time."
    },
    {
        id: "fc_017",
        tenseSlug: "future-continuous",
        type: "fill_blank",
        prompt: "This time tomorrow, I ______ (fly) to Tokyo.",
        answer: "will be flying",
        explanation: "Action in progress at a specific future time."
    },
    {
        id: "fc_018",
        tenseSlug: "future-continuous",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["be", "sleeping", "won't", "I", "midnight", "at"],
        answer: "I won't be sleeping at midnight",
        explanation: "Subject + won't be + verb-ing + time."
    },
    {
        id: "fc_019",
        tenseSlug: "future-continuous",
        type: "mcq",
        prompt: "______ you be using the car later?",
        choices: ["Will", "Do", "Are", "Have"],
        answer: "Will",
        explanation: "Polite inquiry about plans: Will + subject + be + verb-ing?"
    }
];

// Future Perfect Question Bank
export const FUTURE_PERFECT_QUESTIONS: FocusQuestion[] = [
    {
        id: "fp_001",
        tenseSlug: "future-perfect",
        type: "mcq",
        prompt: "By 5 p.m., I ______ finished the report.",
        choices: ["will have", "will", "have", "am"],
        answer: "will have",
        explanation: "Action completed before a specific future time (by 5 p.m.): will + have + past participle."
    },
    {
        id: "fp_002",
        tenseSlug: "future-perfect",
        type: "mcq",
        prompt: "She ______ arrived by the time you get there.",
        choices: ["will have", "will has", "will had", "has"],
        answer: "will have",
        explanation: "Future Perfect: will + have + past participle. Never 'will has'."
    },
    {
        id: "fp_003",
        tenseSlug: "future-perfect",
        type: "mcq",
        prompt: "They ______ built the new bridge by next year.",
        choices: ["will have", "are having", "will be", "had"],
        answer: "will have",
        explanation: "Action completed before a future deadline (by next year)."
    },
    {
        id: "fp_004",
        tenseSlug: "future-perfect",
        type: "fill_blank",
        prompt: "I ______ (leave) by the time you wake up.",
        answer: "will have left",
        explanation: "Action completed (leave) before another future event (wake up)."
    },
    {
        id: "fp_005",
        tenseSlug: "future-perfect",
        type: "fill_blank",
        prompt: "We ______ (not/finish) the project by Friday.",
        answer: "won't have finished",
        explanation: "Negative form: will + not + have + past participle. 'will not have finished' is also correct."
    },
    {
        id: "fp_006",
        tenseSlug: "future-perfect",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["have", "I", "eaten", "will", "noon", "by"],
        answer: "I will have eaten by noon",
        explanation: "Subject (I) + will have + past participle (eaten) + deadline."
    },
    {
        id: "fp_007",
        tenseSlug: "future-perfect",
        type: "mcq",
        prompt: "______ you have done the shopping by 6 p.m.?",
        choices: ["Will", "Do", "Are", "Have"],
        answer: "Will",
        explanation: "Question about completion by a deadline: Will + subject + have + past participle?"
    },
    {
        id: "fp_008",
        tenseSlug: "future-perfect",
        type: "fill_blank",
        prompt: "How many books ______ (you/read) by the end of the year?",
        answer: "will you have read",
        explanation: "Question asking for a total completed quantity before a future time."
    },
    {
        id: "fp_009",
        tenseSlug: "future-perfect",
        type: "order_words",
        prompt: "Order the words to form a negative sentence:",
        tokens: ["gone", "won't", "bed", "to", "He", "yet", "have"],
        answer: "He won't have gone to bed yet",
        explanation: "Subject (He) + won't have + past participle (gone) + object + yet."
    },
    {
        id: "fp_010",
        tenseSlug: "future-perfect",
        type: "fill_blank",
        prompt: "Hopefully, the rain ______ (stop) before the game starts.",
        answer: "will have stopped",
        explanation: "Prediction that an action (stop) will be complete before another future event."
    },
    {
        id: "fp_011",
        tenseSlug: "future-perfect",
        type: "mcq",
        prompt: "Don't call at 8. The baby ______ fallen asleep by then.",
        choices: ["will have", "will be", "is", "has"],
        answer: "will have",
        explanation: "Action (falling asleep) completed before the time mentioned (by then)."
    },
    {
        id: "fp_012",
        tenseSlug: "future-perfect",
        type: "order_words",
        prompt: "Order the words to form a question:",
        tokens: ["seen", "Will", "have", "movie", "they", "the", "?"],
        answer: "Will they have seen the movie?",
        explanation: "Question: Will + they (subject) + have + seen (past participle)...?"
    },
    {
        id: "fp_013",
        tenseSlug: "future-perfect",
        type: "fill_blank",
        prompt: "By the time we get to the party, the food ______ (disappear).",
        answer: "will have disappeared",
        explanation: "Prediction: The food will be gone (completed action) before arrival."
    },
    {
        id: "fp_014",
        tenseSlug: "future-perfect",
        type: "mcq",
        prompt: "I ______ written the email by the time she calls.",
        choices: ["will have", "will be", "am having", "have"],
        answer: "will have",
        explanation: "Future Perfect structure: will have + past participle (written)."
    },
    {
        id: "fp_015",
        tenseSlug: "future-perfect",
        type: "fill_blank",
        prompt: "She ______ (graduate) from college by June.",
        answer: "will have graduated",
        explanation: "Completion of a degree (graduated) by a specific future date (June)."
    },
    {
        id: "fp_016",
        tenseSlug: "future-perfect",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["forgotten", "She", "name", "will", "have", "my", "then", "by"],
        answer: "She will have forgotten my name by then",
        explanation: "Subject + will have + past participle + object + time expression."
    },
    {
        id: "fp_017",
        tenseSlug: "future-perfect",
        type: "fill_blank",
        prompt: "By 2030, humans ______ (land) on Mars.",
        answer: "will have landed",
        explanation: "Action completed by a future date."
    },
    {
        id: "fp_018",
        tenseSlug: "future-perfect",
        type: "order_words",
        prompt: "Order the words to form a sentence:",
        tokens: ["finished", "have", "will", "We", "by", "8", "p.m."],
        answer: "We will have finished by 8 p.m.",
        explanation: "Subject + will have + past participle + time constraint."
    },
    {
        id: "fp_019",
        tenseSlug: "future-perfect",
        type: "mcq",
        prompt: "I ______ left by the time you arrive.",
        choices: ["will have", "will", "am", "have"],
        answer: "will have",
        explanation: "Action completed before another future event."
    }
];

// Map of all question banks by tense slug
// Note: Keys match the TenseSlug type in tenses.ts (kebab-case)
export const FOCUS_QUESTION_BANKS: Record<string, FocusQuestion[]> = {
    "present-simple": PRESENT_SIMPLE_QUESTIONS,
    "present-continuous": PRESENT_CONTINUOUS_QUESTIONS,
    "present-perfect": PRESENT_PERFECT_QUESTIONS,
    "present-perfect-continuous": PRESENT_PERFECT_CONTINUOUS_QUESTIONS,
    "past-simple": PAST_SIMPLE_QUESTIONS,
    "past-continuous": PAST_CONTINUOUS_QUESTIONS,
    "past-perfect": PAST_PERFECT_QUESTIONS,
    "past-perfect-continuous": PAST_PERFECT_CONTINUOUS_QUESTIONS,
    "will": FUTURE_WILL_QUESTIONS,
    "going-to": FUTURE_GOING_TO_QUESTIONS,
    "future-continuous": FUTURE_CONTINUOUS_QUESTIONS,
    "future-perfect": FUTURE_PERFECT_QUESTIONS,
};
