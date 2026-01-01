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
        <div className="w-full bg-slate-900/5 border-b border-slate-900/10 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <span>Practice focus:</span>
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{info.title}</span>
                        </div>

                        <p className="text-lg text-slate-700 leading-relaxed max-w-2xl">
                            {content.description}
                        </p>

                        <div className="bg-white/50 rounded-xl p-5 border border-slate-200/60 shadow-sm">
                            <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide opacity-80">Quick Tips</h4>
                            <ul className="space-y-2">
                                {content.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-slate-600 text-sm">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="md:self-end md:mb-2 shrink-0 w-full md:w-auto">
                        <button
                            onClick={handleStart}
                            className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            <span>Start focused practice</span>
                            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
