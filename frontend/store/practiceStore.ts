"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { QuestionOut } from "@/lib/types";

type ResultRow = {
  questionId: number;
  is_correct: boolean;
  xp_awarded: number;
  time_ms?: number;
};

export type LadderStatus = "locked" | "current" | "cleared" | "failed";

export type LadderLevel = {
  levelNumber: number;
  difficultyBand: string;
  question: QuestionOut | null;
  status: LadderStatus;
  xpReward: number;
};

export type LifelineState = {
  swap: boolean;
  time: boolean;
  double: boolean;
};

type PracticeState = {
  ladderLevels: LadderLevel[];

  selectedActivityId: number | null;
  attemptId: number | null;
  practiceMode: "classic" | "millionaire";

  questions: QuestionOut[];
  currentIndex: number;

  results: ResultRow[];
  sessionXp: number;
  sessionCorrect: number;
  sessionWrong: number;
  sessionBonusXp: number;
  usedQuestionIdsThisRun: number[];
  isDailyRun: boolean;

  // Multi-Activity Attempt Support (Fix 404)
  attemptCache: Record<number, number>; // activityId -> attemptId

  // Lifelines
  lifelines: LifelineState;
  activeDoubleXp: boolean; // for current question
  spareQuestions: QuestionOut[]; // pool for "swap" logic

  // Gamification & Anti-Repetition
  history: Record<number, string>; // questionId -> timestamp
  streak: number;
  lastActiveDate: string | null;
  lastMissionCompletedDate: string | null;

  setSelectedActivityId: (id: number) => void;
  setAttempt: (attemptId: number | null) => void;
  // Cache Action
  setAttemptForActivity: (activityId: number, attemptId: number) => void;

  setQuestions: (qs: QuestionOut[]) => void;
  setPracticeMode: (mode: "classic" | "millionaire") => void;

  setLadderLevels: (levels: LadderLevel[]) => void;
  updateLadderLevel: (index: number, updates: Partial<LadderLevel>) => void;

  useLifeline: (type: keyof LifelineState) => void;
  setSpareQuestions: (qs: QuestionOut[]) => void;
  setActiveDoubleXp: (active: boolean) => void;
  setIsDailyRun: (isDaily: boolean) => void;

  addResult: (r: ResultRow) => void;
  advance: () => void;
  resetRun: () => void;
  addToHistory: (questionId: number) => void;
  syncStreak: () => void;
  markMissionComplete: () => void;
  clearHistory: () => void;
  resetUsedQuestions: () => void;
};

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      selectedActivityId: null,
      attemptId: null,
      practiceMode: "classic",
      ladderLevels: [],

      questions: [],
      currentIndex: 0,

      results: [],
      sessionXp: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionBonusXp: 0,
      usedQuestionIdsThisRun: [],
      isDailyRun: false,
      attemptCache: {},

      lifelines: { swap: false, time: false, double: false },
      activeDoubleXp: false,
      spareQuestions: [],

      history: {},
      streak: 0,
      lastActiveDate: null,
      lastMissionCompletedDate: null,

      setSelectedActivityId: (id) => set({ selectedActivityId: id }),
      setPracticeMode: (mode) => set({ practiceMode: mode }),
      setAttempt: (attemptId) => set({ attemptId }),
      setAttemptForActivity: (actId, attId) => set((s) => ({ attemptCache: { ...s.attemptCache, [actId]: attId } })),

      setLadderLevels: (levels) => set({ ladderLevels: levels }),
      updateLadderLevel: (index, updates) =>
        set((state) => {
          if (!state.ladderLevels[index]) return state;
          const next = [...state.ladderLevels];
          next[index] = { ...next[index], ...updates };
          return { ladderLevels: next };
        }),

      useLifeline: (type) => set(s => ({ lifelines: { ...s.lifelines, [type]: true } })),
      setActiveDoubleXp: (active) => set({ activeDoubleXp: active }),
      setIsDailyRun: (isDaily) => set({ isDailyRun: isDaily }),
      setSpareQuestions: (qs) => set({ spareQuestions: qs }),

      setQuestions: (qs) => {
        // Stable Shuffle: Shuffle options ONCE when setting questions
        const preparedQs = qs.map(q => {
          if (q.kind === 'choice' && q.options) {
            const shuffledOptions = [...q.options];
            // Fisher-Yates inside
            for (let i = shuffledOptions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
            }
            return { ...q, options: shuffledOptions };
          }
          return q;
        });

        set({
          questions: [...preparedQs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
          currentIndex: 0,
          results: [],
          sessionXp: 0,
          sessionCorrect: 0,
          sessionWrong: 0,
          sessionBonusXp: 0,
          usedQuestionIdsThisRun: [],
        });
      },

      addResult: (r) => {
        const st = get();
        // Handle logic for double XP if active
        const isDouble = st.activeDoubleXp && r.is_correct;
        const finalXp = isDouble ? (r.xp_awarded * 2) : r.xp_awarded;
        const bonus = isDouble ? r.xp_awarded : 0; // The extra amount

        const newXp = st.sessionXp + finalXp;
        const newBonus = st.sessionBonusXp + bonus;
        const newCorrect = st.sessionCorrect + (r.is_correct ? 1 : 0);
        const newWrong = st.sessionWrong + (r.is_correct ? 0 : 1);

        set({
          results: [...st.results, r],
          sessionXp: newXp, // Total displayed
          sessionBonusXp: newBonus,
          sessionCorrect: newCorrect,
          sessionWrong: newWrong,
          activeDoubleXp: false // reset after use
        });

        if (r.is_correct) {
          get().addToHistory(r.questionId);
        }
      },

      advance: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),

      resetRun: () =>
        set({
          attemptId: null,
          questions: [],
          currentIndex: 0,
          results: [],
          sessionXp: 0,
          sessionCorrect: 0,
          sessionWrong: 0,
          sessionBonusXp: 0,
          ladderLevels: [],
          usedQuestionIdsThisRun: [],
          lifelines: { swap: false, time: false, double: false },
          activeDoubleXp: false,
          spareQuestions: [],
          isDailyRun: false,
          attemptCache: {}
        }),

      addToHistory: (id) => {
        const { history } = get();
        set({
          history: { ...history, [id]: new Date().toISOString() }
        });
      },

      syncStreak: () => {
        const { lastActiveDate, streak } = get();
        const now = new Date();
        const today = now.toISOString().split("T")[0];

        if (!lastActiveDate) {
          set({ streak: 1, lastActiveDate: today });
          return;
        }

        if (lastActiveDate === today) return;

        const last = new Date(lastActiveDate);
        const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
          set({ streak: streak + 1, lastActiveDate: today });
        } else if (diff > 1) {
          set({ streak: 1, lastActiveDate: today });
        }
      },

      markMissionComplete: () => {
        const today = new Date().toISOString().split("T")[0];
        set({ lastMissionCompletedDate: today });
      },

      clearHistory: () => set({ history: {} }),
      resetUsedQuestions: () => set({ usedQuestionIdsThisRun: [] })
    }),
    {
      name: "b2-practice-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        lastMissionCompletedDate: state.lastMissionCompletedDate,
        practiceMode: state.practiceMode,

        // --- Full Run Persistence ---
        questions: state.questions,
        currentIndex: state.currentIndex,
        attemptId: state.attemptId,
        // attemptCache: state.attemptCache, <-- Removed for hardening
        ladderLevels: state.ladderLevels,

        // Session Stats
        results: state.results,
        sessionXp: state.sessionXp,
        sessionCorrect: state.sessionCorrect,
        sessionWrong: state.sessionWrong,
        sessionBonusXp: state.sessionBonusXp,
        usedQuestionIdsThisRun: state.usedQuestionIdsThisRun,
        isDailyRun: state.isDailyRun,

        // Lifelines
        lifelines: state.lifelines,
        activeDoubleXp: state.activeDoubleXp,
        spareQuestions: state.spareQuestions
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.ladderLevels.length > 0 && state.questions.length === 0) {
          console.warn("Hydration mismatch detected: Ladder exists but Questions empty. Resetting run.");
          state.resetRun();
        }
      }
    }
  )
);
