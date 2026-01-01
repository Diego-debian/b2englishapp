"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/Button";

export function OnboardingBanner() {
    const handleScroll = () => {
        const target = document.getElementById("tense-list");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="w-full relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-2xl">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-10">
                {/* Text Content */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Master English Tenses
                        </h2>
                        <p className="text-lg text-slate-300 max-w-xl mx-auto md:mx-0 leading-relaxed">
                            A simple loop to fluency. Understand the rules, then lock them in with targeted practice.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                        <Button
                            onClick={handleScroll}
                            className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                        >
                            Start with a tense ↓
                        </Button>
                        <Link href="/practice">
                            <Button
                                className="bg-white/10 text-white hover:bg-white/20 font-semibold px-8 py-4 h-auto rounded-xl backdrop-blur-sm border border-white/10 transition-all active:scale-95"
                            >
                                Go to Practice →
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Steps Visual */}
                <div className="shrink-0 w-full md:w-auto">
                    <div className="bg-slate-950/40 rounded-2xl p-6 border border-white/5 backdrop-blur-sm space-y-5 shadow-inner">
                        <StepItem icon="📖" title="Read" desc="Learn the rules" />
                        <ArrowDown />
                        <StepItem icon="⚡" title="Practice" desc="Test your knowledge" />
                        <ArrowDown />
                        <StepItem icon="🔄" title="Repeat" desc="Build fluency" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-sm border border-white/5">
                {icon}
            </div>
            <div className="text-left">
                <p className="text-white font-bold text-sm tracking-wide">{title}</p>
                <p className="text-slate-400 text-xs font-medium">{desc}</p>
            </div>
        </div>
    );
}

function ArrowDown() {
    return (
        <div className="flex justify-center -my-2 opacity-30">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </div>
    );
}
