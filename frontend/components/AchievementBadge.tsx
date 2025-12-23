"use client";

import React from "react";
import { Award, Lock } from "lucide-react";
import { Achievement } from "../hooks/useGamification";

interface AchievementBadgeProps {
  achievement: Achievement;
}

/**
 * Badge que muestra logros desbloqueados o bloqueados con tooltip accesible.
 */
export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { unlocked, title, description } = achievement;
  return (
    <div className="relative group flex flex-col items-center text-center">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 text-white shadow-lg transition-transform transform ${
          unlocked ? "hover:scale-105" : "opacity-50"
        }`}
        aria-label={unlocked ? `Logro desbloqueado: ${title}` : `Logro bloqueado: ${title}`}
      >
        {unlocked ? (
          <Award className="w-6 h-6" aria-hidden="true" />
        ) : (
          <Lock className="w-6 h-6" aria-hidden="true" />
        )}
      </div>
      <span className="mt-1 text-xs font-medium text-gray-800 dark:text-gray-200 w-20 truncate" title={title}>
        {title}
      </span>
      <div className="absolute z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 -top-2 left-1/2 -translate-x-1/2 translate-y-full bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg max-w-xs">
        <strong className="block mb-0.5">{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}
