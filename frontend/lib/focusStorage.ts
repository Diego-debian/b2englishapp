export interface FocusStats {
    sessions: number;
    totalQuestions: number;
    totalCorrect: number;
    lastPlayed: string | null; // ISO date string
}

const KEY = "b2_focus_stats";

const DEFAULT_STATS: FocusStats = {
    sessions: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    lastPlayed: null,
};

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
            const current = focusStorage.getStats();
            const updated: FocusStats = {
                sessions: current.sessions + 1,
                totalQuestions: current.totalQuestions + total,
                totalCorrect: current.totalCorrect + correct,
                lastPlayed: new Date().toISOString(),
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
    }
};
