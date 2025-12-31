import React, { useMemo } from "react";
import { LadderLevel } from "@/store/practiceStore";

interface LadderProgressProps {
    levels: LadderLevel[];
    currentLevelIndex: number;
}

export function LadderProgress({ levels, currentLevelIndex }: LadderProgressProps) {
    // Reverse levels to show top (Goal) at the top of the list
    const displayLevels = useMemo(() => [...levels].reverse(), [levels]);

    return (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <h3 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-4 text-center">
                Escalera de Premios
            </h3>

            <div className="space-y-1 relative z-10">
                {displayLevels.map((level) => {
                    const isCurrent = level.levelNumber === currentLevelIndex + 1;
                    const isCleared = level.status === "cleared";
                    const isMilestone = level.levelNumber % 5 === 0;

                    return (
                        <div
                            key={level.levelNumber}
                            className={`flex items-center justify-between px-4 py-2 rounded-lg transition-all ${isCurrent
                                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-105 font-bold"
                                    : isCleared
                                        ? "text-emerald-400 bg-emerald-500/10"
                                        : isMilestone
                                            ? "text-white"
                                            : "text-slate-500"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`text-xs font-mono w-6 text-right ${isCurrent ? "text-amber-100" : "opacity-50"
                                        }`}
                                >
                                    {level.levelNumber}
                                </span>
                                <span className={isCurrent ? "text-white" : ""}>
                                    {isMilestone ? "◆" : "•"}
                                </span>
                            </div>
                            <div className="font-mono tracking-wide">
                                XP {level.xpReward}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Próximo Hito: Nivel {Math.ceil((currentLevelIndex + 1) / 5) * 5}
                </p>
            </div>
        </div>
    );
}
