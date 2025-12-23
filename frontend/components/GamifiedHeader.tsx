"use client";

import React from "react";
import { Flame, Star, XCircle } from "lucide-react";
import { useGamification } from "../hooks/useGamification";

/**
 * Muestra nivel, XP, racha y errores en un encabezado con gradiente y animación flotante.
 */
export default function GamifiedHeader() {
  const { xp, level, streak, mistakes } = useGamification();
  const xpNeededForLevel = (lvl: number) => 100 + (lvl - 1) * 20;
  const currentLevelRequirement = xpNeededForLevel(level);
  const progressPercentage = Math.min((xp / currentLevelRequirement) * 100, 100);

  return (
    <header className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white p-4 rounded-b-lg shadow-lg animate-float">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-yellow-300" aria-hidden="true" />
            <span className="font-bold text-lg">Nivel {level}</span>
          </div>
          <div className="h-2 w-full bg-white/30 rounded-full overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1">
            {xp}/{currentLevelRequirement} XP para subir
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Flame className="w-5 h-5 text-orange-300" aria-hidden="true" />
            <span className="text-sm">Racha: {streak}</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-5 h-5 text-red-300" aria-hidden="true" />
            <span className="text-sm">Errores: {mistakes}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
