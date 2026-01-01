export type FocusContent = {
    description: string;
    tips: [string, string, string];
};

export const FOCUS_CONTENT: Record<string, FocusContent> = {
    "present-simple": {
        description: "Review the fundamentals of daily routines, facts, and general truths. This session reinforces how to express permanent situations and regular habits correctly.",
        tips: [
            "Remember the -s/-es ending for he/she/it.",
            "Use 'do/does' for questions and negatives.",
            "Watch out for adverbs of frequency like 'always' or 'often'."
        ]
    },
    "present-continuous": {
        description: "Focus on actions happening right now or around this time. This practice helps distinguish temporary situations from permanent ones.",
        tips: [
            "Always use the verb 'to be' (am/is/are) + ing.",
            "Don't use it for state verbs like 'know', 'like', or 'believe'.",
            "This tense can also describe definite future arrangements."
        ]
    },
    "present-perfect": {
        description: "Strengthen your connection between the past and the present. Work on expressing life experiences and actions with present results.",
        tips: [
            "Use 'have/has' + the past participle (V3).",
            "Keywords 'just', 'already', and 'yet' are common signals.",
            "Don't mention a specific finished time (like 'yesterday')."
        ]
    },
    "present-perfect-continuous": {
        description: "Review how to express duration and ongoing actions that started in the past. Perfect for emphasizing how long something has been happening.",
        tips: [
            "Form: have/has + been + verb-ing.",
            "Use 'for' to give a duration and 'since' for a starting point.",
            "It emphasizes the activity itself, not necessarily the result."
        ]
    },
    "past-simple": {
        description: "Practice storytelling basics. Review how to describe finished actions and events that happened at a specific time in the past.",
        tips: [
            "Watch for irregular verbs – they don't end in -ed.",
            "Use 'did' for questions and negatives (verb returns to base form).",
            "Always implies the time period is finished."
        ]
    },
    "past-continuous": {
        description: "Focus on setting scenes and describing actions in progress at a specific past moment. Essential for telling engaging stories.",
        tips: [
            "Form: was/were + verb-ing.",
            "Often interrupted by a Past Simple action (using 'when').",
            "Use 'while' to connect two simultaneous long actions."
        ]
    },
    "past-perfect": {
        description: "Master the timeline of past events. This session reinforces clarity when ordering two past actions to show which happened first.",
        tips: [
            "Form: had + past participle (V3).",
            "Think of it as the 'past of the past'.",
            "Only use it when necessary to clarify the order of events."
        ]
    },
    "past-perfect-continuous": {
        description: "Review duration in the past before another past action. Useful for explaining the cause or duration of a past situation.",
        tips: [
            "Form: had + been + verb-ing.",
            "Focuses on how long an action was happening before something else.",
            "Like Present Perfect Continuous, but shifted back in time."
        ]
    },
    "will": {
        description: "Practice expressing spontaneous decisions, predictions, and promises. Review the most flexible way to talk about the future.",
        tips: [
            "Use 'will' + base verb (no 'to').",
            "Great for rapid decisions made at the moment of speaking.",
            "Often used with 'I think', 'I promise', or 'I hope'."
        ]
    },
    "going-to": {
        description: "Focus on future plans and intentions. This session reinforces how to talk about things you have already decided to do.",
        tips: [
            "Form: am/is/are + going to + verb.",
            "Use it for plans made before the moment of speaking.",
            "also used for predictions based on present evidence (e.g., dark clouds)."
        ]
    },
    "future-continuous": {
        description: "Review how to describe actions that will be in progress at a specific future time. Adds depth and politeness to your future plans.",
        tips: [
            "Form: will + be + verb-ing.",
            "Imagine yourself in the middle of doing the action.",
            "Can sound more polite than simple future for questions."
        ]
    },
    "future-perfect": {
        description: "Master looking back from the future. Practice expressing actions that will be completed by a certain deadline.",
        tips: [
            "Form: will + have + past participle (V3).",
            "Almost always uses 'by' + a time expression.",
            "Think of it as a deadline: 'By 5 PM, I will have finished'."
        ]
    }
};
