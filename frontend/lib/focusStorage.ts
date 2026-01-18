import { STORAGE_KEYS } from "./constants";

export interface FocusStats {
    sessions: number;
    totalQuestions: number;
    totalCorrect: number;
    lastPlayed: string | null; // ISO date string
    streak: number;
    lastStreakDate: string | null; // YYYY-MM-DD local
    dailySessions: number;
    dailyQuestions: number;
    history?: { date: string; sessions: number; questions: number; correct: number }[];
}

const KEY = STORAGE_KEYS.FOCUS_STATS;

const DEFAULT_STATS: FocusStats = {
    sessions: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    lastPlayed: null,
    streak: 0,
    lastStreakDate: null,
    dailySessions: 0,
    dailyQuestions: 0,
    history: [],
};

// Deck State for "Smart Shuffle"
interface DeckState {
    // Map tenseSlug -> { queue: questionIds[], index: number }
    [key: string]: {
        queue: string[];
        index: number;
    }
}

const DECK_KEY = STORAGE_KEYS.FOCUS_DECK;

export const focusStorage = {
    /**
     * Reads stats from localStorage. Safe for SSR.
     */
    getStats: (): FocusStats => {
        if (typeof window === "undefined") return DEFAULT_STATS;
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return DEFAULT_STATS;
            return JSON.parse(raw) as FocusStats;
        } catch (e) {
            console.warn("Error reading focus stats:", e);
            return DEFAULT_STATS;
        }
    },

    /**
     * Updates stats with a new completed session.
     * Returns the updated stats object.
     */
    saveSession: (correct: number, total: number): FocusStats => {
        if (typeof window === "undefined") return DEFAULT_STATS;
        try {
            // Streak & Daily Logic (Local Time)
            const current = focusStorage.getStats();
            const now = new Date();
            const today = now.toLocaleDateString("en-CA"); // YYYY-MM-DD

            let newStreak = current.streak || 0;
            const lastDate = current.lastStreakDate;

            // Daily Stats Reset Check
            let dSessions = current.dailySessions || 0;
            let dQuestions = current.dailyQuestions || 0;

            if (lastDate !== today) {
                // New Day -> Reset Daily Stats
                dSessions = 0;
                dQuestions = 0;

                // Streak Calc
                if (lastDate) {
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toLocaleDateString("en-CA");

                    if (lastDate === yesterday) {
                        newStreak += 1;
                    } else {
                        newStreak = 1; // Streak broken or gap > 1 day
                    }
                } else {
                    newStreak = 1; // First time
                }
            }
            // else: same day, keep streak and daily stats

            // Increment Daily Stats
            dSessions += 1;
            dQuestions += total;

            // HISTORY LOGIC
            // Ensure history exists
            let history = current.history ? [...current.history] : [];

            // Find today's entry
            const todayEntryIndex = history.findIndex(h => h.date === today);

            if (todayEntryIndex >= 0) {
                // Update existing entry
                history[todayEntryIndex].sessions += 1;
                history[todayEntryIndex].questions += total;
                history[todayEntryIndex].correct += correct;
            } else {
                // Add new entry
                history.push({
                    date: today,
                    sessions: 1,
                    questions: total,
                    correct: correct
                });
            }

            // Optional: Limit history length (e.g. 60 days) to save space
            if (history.length > 60) {
                history = history.slice(history.length - 60);
            }

            const updated: FocusStats = {
                sessions: current.sessions + 1,
                totalQuestions: current.totalQuestions + total,
                totalCorrect: current.totalCorrect + correct,
                lastPlayed: now.toISOString(),
                streak: newStreak,
                lastStreakDate: today,
                dailySessions: dSessions,
                dailyQuestions: dQuestions,
                history,
            };
            localStorage.setItem(KEY, JSON.stringify(updated));
            return updated;
        } catch (e) {
            console.error("Error saving focus stats:", e);
            return DEFAULT_STATS;
        }
    },

    /**
     * Resets all focus stats.
     */
    reset: () => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(KEY);
        localStorage.removeItem(DECK_KEY);
    },

    /**
     * Smart Deck Selection:
     * - Maintains a shuffled queue of IDs per tense.
     * - Returns 'count' unique questions.
     * - Reshuffles when queue is exhausted.
     */
    pickQuestions: (tense: string, count: number, allQuestions: { id: string }[]): string[] => {
        if (typeof window === "undefined" || !allQuestions.length) return [];

        try {
            // Load Deck State
            const raw = localStorage.getItem(DECK_KEY);
            const decks: DeckState = raw ? JSON.parse(raw) : {};

            // Initialize or Load Tense Deck
            let deck = decks[tense];

            // Helper to shuffle
            const shuffle = (arr: string[]) => {
                const shuffled = [...arr];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            };

            // Validation: Re-init if questions changed significantly or deck invalid
            if (!deck || !deck.queue || deck.queue.length === 0) {
                deck = {
                    queue: shuffle(allQuestions.map(q => q.id)),
                    index: 0
                };
            }

            const pickedIds: string[] = [];

            // Pick needed amount
            while (pickedIds.length < count) {
                // Check if we need to reshuffle
                if (deck.index >= deck.queue.length) {
                    deck.queue = shuffle(allQuestions.map(q => q.id));
                    deck.index = 0;
                }

                // Take next
                pickedIds.push(deck.queue[deck.index]);
                deck.index++;
            }

            // Save State
            decks[tense] = deck;
            localStorage.setItem(DECK_KEY, JSON.stringify(decks));

            return pickedIds;

        } catch (e) {
            console.warn("Deck selection failed, falling back to random:", e);
            // Fallback: Simple random sample
            const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count).map(q => q.id);
        }
    },

    /**
     * Calculates stats for the last 7 days (including today).
     */
    getWeeklyStats: (stats: FocusStats) => {
        if (!stats.history || stats.history.length === 0) {
            return { daysPracticed: 0, totalSessions: 0, avgAccuracy: 0 };
        }

        const now = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() - 6); // 7 days window (today - 6)
        const cutoffStr = cutoffDate.toLocaleDateString("en-CA");

        // Filter last 7 days
        const weekEntries = stats.history.filter(h => h.date >= cutoffStr);

        const daysPracticed = weekEntries.length;
        const totalSessions = weekEntries.reduce((acc, curr) => acc + curr.sessions, 0);
        const totalQ = weekEntries.reduce((acc, curr) => acc + curr.questions, 0);
        const totalC = weekEntries.reduce((acc, curr) => acc + curr.correct, 0);

        const avgAccuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

        return { daysPracticed, totalSessions, avgAccuracy };
    }
};
