"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TENSES, TenseSlug } from "@/lib/tenses";

function TenseBannerContent() {
    const searchParams = useSearchParams();
    const tenseSlug = searchParams.get("tense") as TenseSlug | null;

    if (!tenseSlug || !TENSES[tenseSlug]) {
        return null;
    }

    const info = TENSES[tenseSlug];

    return (
        <div className="w-full bg-slate-900/5 border-b border-slate-900/10 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm">
                <span className="text-slate-500">Practice focus:</span>
                <span className="font-bold text-slate-700">{info.title}</span>
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
