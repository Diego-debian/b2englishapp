/**
 * Centralized constants for B2English frontend.
 * T4.1 - Extracted from hardcoded values.
 */

// Storage Keys (used in localStorage)
export const STORAGE_KEYS = {
    AUTH: "b2english.auth.v1",
    FOCUS_STATS: "b2_focus_stats",
    FOCUS_DECK: "b2_focus_deck",
} as const;

// Main Navigation Routes
export const ROUTES = {
    HOME: "/",
    DASHBOARD: "/dashboard",
    PRACTICE: "/practice",
    FOCUS: "/practice/focus",
    VERBS: "/verbs",
    TENSES: "/tenses",
    PROGRESS: "/progress",
    LOGIN: "/login",
} as const;
