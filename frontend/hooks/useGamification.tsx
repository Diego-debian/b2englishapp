"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  criteria: (state: GamificationState) => boolean;
  unlocked: boolean;
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  mistakes: number;
  achievements: Achievement[];
}

interface GamificationContextValue extends GamificationState {
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addMistake: () => void;
  clearProgress: () => void;
}

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

function xpNeededForLevel(level: number): number {
  return 100 + (level - 1) * 20;
}

const baseAchievements: Achievement[] = [
  {
    id: "first-correct",
    title: "Primer acierto",
    description: "Responde correctamente a un verbo por primera vez.",
    criteria: (state) => state.streak >= 1,
    unlocked: false,
  },
  {
    id: "streak-3",
    title: "Racha 3",
    description: "Alcanza una racha de 3 respuestas correctas.",
    criteria: (state) => state.streak >= 3,
    unlocked: false,
  },
  {
    id: "streak-10",
    title: "Racha 10",
    description: "Consigue una racha de 10 respuestas correctas.",
    criteria: (state) => state.streak >= 10,
    unlocked: false,
  },
  {
    id: "level-5",
    title: "Nivel 5 alcanzado",
    description: "Sube al nivel 5.",
    criteria: (state) => state.level >= 5,
    unlocked: false,
  },
  {
    id: "no-mistakes",
    title: "Sin errores",
    description: "Completa una sesión sin cometer errores.",
    criteria: (state) => state.mistakes === 0 && state.xp > 0,
    unlocked: false,
  },
];

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GamificationState>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gamificationState");
        if (stored) {
          const parsed = JSON.parse(stored) as GamificationState;
          const achievements = baseAchievements.map((base) => {
            const unlocked = parsed.achievements?.find((a) => a.id === base.id)?.unlocked ?? false;
            return { ...base, unlocked };
          });
          return { ...parsed, achievements };
        }
      } catch {
        /* ignore */
      }
    }
    return {
      xp: 0,
      level: 1,
      streak: 0,
      mistakes: 0,
      achievements: baseAchievements,
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "gamificationState",
        JSON.stringify({
          ...state,
          achievements: state.achievements.map(({ id, title, description, unlocked }) => ({
            id, title, description, unlocked,
          })),
        }),
      );
    }
  }, [state]);

  useEffect(() => {
    setState((prev) => {
      const updatedAchievements = prev.achievements.map((ach) => {
        if (!ach.unlocked && ach.criteria(prev)) {
          return { ...ach, unlocked: true };
        }
        return ach;
      });
      return { ...prev, achievements: updatedAchievements };
    });
  }, [state.streak, state.level, state.mistakes, state.xp]);

  function addXP(amount: number) {
    setState((prev) => {
      let xp = prev.xp + amount;
      let level = prev.level;
      while (xp >= xpNeededForLevel(level)) {
        xp -= xpNeededForLevel(level);
        level += 1;
      }
      return { ...prev, xp, level };
    });
  }

  function incrementStreak() {
    setState((prev) => ({ ...prev, streak: prev.streak + 1 }));
  }

  function resetStreak() {
    setState((prev) => ({ ...prev, streak: 0 }));
  }

  function addMistake() {
    setState((prev) => ({ ...prev, mistakes: prev.mistakes + 1 }));
  }

  function clearProgress() {
    setState((prev) => ({ ...prev, xp: 0, level: 1, streak: 0, mistakes: 0 }));
  }

  const value: GamificationContextValue = useMemo(
    () => ({
      ...state,
      addXP,
      incrementStreak,
      resetStreak,
      addMistake,
      clearProgress,
    }),
    [state],
  );

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};

export function useGamification(): GamificationContextValue {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return ctx;
}
