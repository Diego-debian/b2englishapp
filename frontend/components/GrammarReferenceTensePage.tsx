"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

type GrammarReferenceTensePageProps = {
    title: string;
    category: "Present" | "Past" | "Future";
};

export function GrammarReferenceTensePage({
    title,
    category,
}: GrammarReferenceTensePageProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-10">
            {/* Header */}
            <div className="space-y-6">
                <Link href="/tenses">
                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600 gap-2 mb-4">
                        ← Back to Grammar Reference
                    </Button>
                </Link>

                <div className="space-y-2">
                    <span className="inline-flex px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase">
                        {category} Time
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        Grammar Reference
                    </p>
                </div>
            </div>

            {/* Content Placeholder */}
            <Card className="bg-slate-50/60 border-slate-200">
                <div className="text-center py-16 space-y-4">
                    <span className="text-5xl">📖</span>
                    <h2 className="text-xl font-bold text-slate-700">
                        Reference — content coming next phase
                    </h2>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        Detailed explanations, examples, and usage patterns will be added in the next phase.
                    </p>
                </div>
            </Card>

            {/* Soft CTA */}
            <Card className="bg-white border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="space-y-1">
                        <p className="text-slate-900 font-bold">
                            You'll see this in practice
                        </p>
                        <p className="text-slate-500 text-sm">
                            Apply what you know with interactive exercises.
                        </p>
                    </div>
                    <Link href="/practice">
                        <Button className="bg-violet-600 hover:bg-violet-700">
                            Go to Practice →
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
