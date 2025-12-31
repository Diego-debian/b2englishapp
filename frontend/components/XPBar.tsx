"use client";

import React, { useMemo } from "react";

type XPBarProps = {
  value: number;
  className?: string;
};

export function XPBar({ value, className }: XPBarProps) {
  const pct = useMemo(() => {
    // Visualización suave local (0..100)
    // Si value > 100, se envuelve para animación
    const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
    return safe <= 100 ? safe : safe % 100;
  }, [value]);

  return (
    <div
      className={[
        "h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/5",
        className,
      ].filter(Boolean).join(" ")}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand via-brand2 to-emerald-300 transition-all duration-700 ease-out"
        style={{ width: `${pct}%` }}
        aria-label={`XP progress ${pct}%`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
