"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TENSES, TenseSlug } from "@/lib/tenses";

import { FOCUS_CONTENT } from "@/lib/focusContent";

function TenseBannerContent() {
    const searchParams = useSearchParams();
    const tenseSlug = searchParams.get("tense") as TenseSlug | null;

    if (!tenseSlug || !TENSES[tenseSlug] || !FOCUS_CONTENT[tenseSlug]) {
        return null;
    }

    const info = TENSES[tenseSlug];
    const content = FOCUS_CONTENT[tenseSlug];

    const handleStart = () => {
        const target = document.getElementById("practice-area");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            // Temporary highlight effect
            target.classList.add("ring-4", "ring-indigo-500/50", "transition-all", "duration-500");
            setTimeout(() => {
                target.classList.remove("ring-4", "ring-indigo-500/50");
            }, 1000);
        }
    };

    return (
        <div className="w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm relative z-10 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
                                Practice Focus
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                {info.title}
                            </h2>
                        </div>

                        <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium">
                            {content.description}
                        </p>

                        <div className="bg-white/60 rounded-2xl p-6 border border-slate-200/60 shadow-sm ring-1 ring-slate-900/5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                Key Concepts
                            </h4>
                            <ul className="space-y-2.5">
                                {content.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="md:self-center shrink-0 w-full md:w-auto pt-2 md:pt-0">
                        <button
                            onClick={handleStart}
                            className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <span>Start focused practice</span>
                            <svg className="w-4 h-4 text-indigo-100 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PracticeTenseBanner() {
    return (
        <Suspense fallback={null}>
            <TenseBannerContent />
        </Suspense>
    );
}
