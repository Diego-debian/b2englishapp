export interface FocusStats {
    sessions: number;
    totalQuestions: number;
    totalCorrect: number;
    lastPlayed: string | null; // ISO date string
    streak: number;
    lastStreakDate: string | null; // YYYY-MM-DD local
}

const KEY = "b2_focus_stats";

const DEFAULT_STATS: FocusStats = {
    sessions: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    lastPlayed: null,
    streak: 0,
    lastStreakDate: null,
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
            // Streak Logic (Local Time)
            const current = focusStorage.getStats();
            const now = new Date();
            const today = now.toLocaleDateString("en-CA"); // YYYY-MM-DD

            let newStreak = current.streak || 0;
            const lastDate = current.lastStreakDate;

            if (lastDate !== today) {
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
            // else: same day, keep streak

            const updated: FocusStats = {
                sessions: current.sessions + 1,
                totalQuestions: current.totalQuestions + total,
                totalCorrect: current.totalCorrect + correct,
                lastPlayed: now.toISOString(),
                streak: newStreak,
                lastStreakDate: today,
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
