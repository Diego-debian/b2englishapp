"use client";

import { Protected } from "@/components/Protected";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useState, useEffect } from "react";

const STORAGE_KEY = "tenses.futureContinuous.step";

export default function FutureContinuousPage() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Load from sessionStorage on mount
    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            const idx = parseInt(saved, 10);
            if (!isNaN(idx) && idx >= 0 && idx < 6) {
                setActiveIndex(idx);
            }
        }
    }, []);

    // Save to sessionStorage on change
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, String(activeIndex));
    }, [activeIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && activeIndex > 0) {
                setActiveIndex((prev) => prev - 1);
            } else if (e.key === "ArrowRight" && activeIndex < 5) {
                setActiveIndex((prev) => prev + 1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex]);

    const goToPrev = () => {
        if (activeIndex > 0) setActiveIndex(activeIndex - 1);
    };

    const goToNext = () => {
        if (activeIndex < 5) setActiveIndex(activeIndex + 1);
    };

    const goToSlide = (idx: number) => {
        setActiveIndex(idx);
    };

    const slides = [
        {
            id: "quick-use",
            title: "Quick use",
            render: () => (
                <Card className="w-full max-w-full bg-white border-slate-200 shadow-lg ring-1 ring-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick use</h2>
                    <ul className="space-y-3 text-slate-700">
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Actions in progress at a specific future time</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Actions happening simultaneously in the future</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Polite questions about future plans</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Background actions in future scenarios</span>
                        </li>
                    </ul>
                </Card>
            ),
        },
        {
            id: "form",
            title: "Form",
            render: () => (
                <Card className="w-full max-w-full bg-white border-slate-200 shadow-lg ring-1 ring-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Form</h2>

                    <div className="space-y-6">
                        {/* Affirmative */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Affirmative</h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="font-mono text-sm text-slate-600 mb-3">
                                    Subject + will be + verb-ing
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>I will be working at 8 p.m.</li>
                                    <li>She will be sleeping when you arrive.</li>
                                    <li>They will be traveling next week.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Negative */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Negative</h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="font-mono text-sm text-slate-600 mb-3">
                                    Subject + will not be + verb-ing
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>I will not be using the car later.</li>
                                    <li>He won&apos;t be coming to the party.</li>
                                    <li>We will not be studying tonight.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Question</h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="font-mono text-sm text-slate-600 mb-3">
                                    Will + subject + be + verb-ing?
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>Will you be working tomorrow?</li>
                                    <li>Will she be joining us for dinner?</li>
                                    <li>Will they be staying at a hotel?</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            ),
        },
        {
            id: "common-markers",
            title: "Common markers",
            render: () => (
                <Card className="w-full max-w-full bg-white border-slate-200 shadow-lg ring-1 ring-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Common markers</h2>

                    <div className="space-y-6">
                        {/* Time expressions */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Time expressions</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">this time tomorrow</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">at 8 p.m. tomorrow</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">next week at...</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">in the future</span>
                            </div>
                        </div>
                    </div>
                </Card>
            ),
        },
        {
            id: "common-mistakes",
            title: "Common mistakes",
            render: () => (
                <Card className="w-full max-w-full bg-white border-slate-200 shadow-lg ring-1 ring-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Common mistakes</h2>

                    <div className="space-y-4">
                        {/* Mistake 1 */}
                        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 font-bold text-lg">✗</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-slate-700">I <span className="line-through">will be work</span> later.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">I will be working later.</p>
                                            <p className="text-sm text-slate-600">Always use verb-ing after &quot;will be&quot;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mistake 2 */}
                        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 font-bold text-lg">✗</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-slate-700"><span className="line-through">Will you working</span> tomorrow?</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">Will you be working tomorrow?</p>
                                            <p className="text-sm text-slate-600">Don&apos;t forget &quot;be&quot; in questions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mistake 3 */}
                        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 font-bold text-lg">✗</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-slate-700">I <span className="line-through">will working</span> at 8.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">I will be working at 8.</p>
                                            <p className="text-sm text-slate-600">Must include &quot;will be&quot; before verb-ing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mistake 4 */}
                        <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 font-bold text-lg">✗</span>
                                <div className="flex-1 space-y-2">
                                    <p className="text-slate-700">She <span className="line-through">will be works</span>.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">She will be working.</p>
                                            <p className="text-sm text-slate-600">The verb must end in -ing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ),
        },
        {
            id: "mini-practice",
            title: "Mini practice",
            render: () => (
                <Card className="w-full max-w-full bg-gradient-to-br from-amber-50/50 to-orange-50/30 border-amber-200/60 shadow-lg ring-1 ring-amber-100/50">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Mini practice</h2>
                    <p className="text-sm text-slate-600 mb-6">Try these quick exercises. Click to see answers.</p>

                    <div className="space-y-4">
                        {/* MCQ 1 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">1. This time tomorrow, I ___ flying to Paris.</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) will</div>
                                <div className="text-slate-700">b) will be</div>
                                <div className="text-slate-700">c) am</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: b) will be</p>
                                    <p className="text-slate-600 mt-1">Structure: will + be + verb-ing.</p>
                                </div>
                            </details>
                        </div>

                        {/* MCQ 2 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">2. ___ you be using the computer later?</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) Will</div>
                                <div className="text-slate-700">b) Do</div>
                                <div className="text-slate-700">c) Are</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: a) Will</p>
                                    <p className="text-slate-600 mt-1">Questions start with &quot;Will&quot;.</p>
                                </div>
                            </details>
                        </div>

                        {/* MCQ 3 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">3. They ___ be working on Sunday.</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) won&apos;t</div>
                                <div className="text-slate-700">b) don&apos;t</div>
                                <div className="text-slate-700">c) aren&apos;t</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: a) won&apos;t</p>
                                    <p className="text-slate-600 mt-1">Negative form: will not (won&apos;t).</p>
                                </div>
                            </details>
                        </div>

                        {/* Input 1 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">4. Complete: She ___ (study) at the library all day.</p>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: will be studying</p>
                                    <p className="text-slate-600 mt-1">Use will be + verb-ing.</p>
                                </div>
                            </details>
                        </div>

                        {/* Input 2 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">5. Complete: ___ (they/wait) for us?</p>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: Will they be waiting</p>
                                    <p className="text-slate-600 mt-1">Question form: Will + subject + be + verb-ing.</p>
                                </div>
                            </details>
                        </div>
                    </div>
                </Card>
            ),
        },
        {
            id: "apply-in-practice",
            title: "Apply in practice",
            render: () => (
                <Card className="w-full max-w-full bg-white border-slate-200 shadow-lg ring-1 ring-slate-100">
                    <div className="flex flex-col items-center justify-center gap-6 text-center py-8">
                        <div className="space-y-2">
                            <p className="text-slate-900 font-bold text-xl">
                                Apply this in practice
                            </p>
                            <p className="text-slate-500 text-sm">
                                Test your understanding with interactive exercises.
                            </p>
                        </div>
                        <Link href="/practice/focus?tense=future-continuous">
                            <Button className="bg-violet-600 hover:bg-violet-700">
                                Practice this tense →
                            </Button>
                        </Link>
                    </div>
                </Card>
            ),
        },
    ];

    return (
        <Protected>
            <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
                <div className="max-w-4xl mx-auto w-full space-y-8">
                    {/* Header - outside the stage */}
                    <div className="space-y-6">
                        <Link href="/tenses">
                            <Button variant="ghost" className="text-slate-400 hover:text-slate-600 gap-2 mb-4">
                                ← Back to Grammar Reference
                            </Button>
                        </Link>

                        <div className="space-y-2">
                            <span className="inline-flex px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase">
                                Future Time
                            </span>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                Future Continuous
                            </h1>
                            <p className="text-sm font-medium text-slate-500">
                                Grammar Reference
                            </p>
                        </div>
                    </div>

                    {/* Carousel Stage */}
                    <div className="rounded-3xl border border-violet-200/40 bg-gradient-to-br from-white via-white to-violet-50/20 backdrop-blur shadow-2xl ring-1 ring-slate-200/50 p-6 md:p-8">
                        <div className="space-y-6">
                            {/* Progress indicator */}
                            <div className="text-center">
                                <p className="text-sm font-semibold text-slate-600">
                                    Step {activeIndex + 1} / 6
                                </p>
                            </div>

                            {/* Carousel slide - full width */}
                            <div className="w-full flex justify-center">
                                {slides[activeIndex].render()}
                            </div>

                            {/* Navigation controls - integrated */}
                            <div className="space-y-4 pt-4">
                                {/* Prev/Next buttons with dots in between */}
                                <div className="flex items-center justify-between gap-4">
                                    <Button
                                        variant="secondary"
                                        onClick={goToPrev}
                                        disabled={activeIndex === 0}
                                        aria-label="Previous slide"
                                        className="px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ← Previous
                                    </Button>

                                    {/* Dot indicators - centered */}
                                    <div className="flex items-center justify-center gap-2">
                                        {slides.map((slide, idx) => (
                                            <button
                                                key={slide.id}
                                                onClick={() => goToSlide(idx)}
                                                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                                                className={`rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${idx === activeIndex
                                                    ? "bg-violet-600 w-8 h-3"
                                                    : "bg-slate-300 hover:bg-slate-400 w-3 h-3"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <Button
                                        variant="secondary"
                                        onClick={goToNext}
                                        disabled={activeIndex === 5}
                                        aria-label="Next slide"
                                        className="px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next →
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Protected>
    );
}
