"use client";

import { Protected } from "@/components/Protected";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useState, useEffect } from "react";

const STORAGE_KEY = "tenses.pastPerfect.step";

export default function PastPerfectPage() {
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
                            <span>Actions completed before another past action</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Cause–effect in the past</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Reported speech and stories</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-violet-600 font-bold">•</span>
                            <span>Giving background information</span>
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
                                    Subject + had + past participle
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>I had finished my work before lunch.</li>
                                    <li>She had already left when I arrived.</li>
                                    <li>They had lived there for ten years.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Negative */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Negative</h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="font-mono text-sm text-slate-600 mb-3">
                                    Subject + had not (hadn&apos;t) + past participle
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>I hadn&apos;t seen him before that day.</li>
                                    <li>He hadn&apos;t finished his homework.</li>
                                    <li>We hadn&apos;t met them before the party.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Question</h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="font-mono text-sm text-slate-600 mb-3">
                                    Had + subject + past participle?
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li>Had you eaten breakfast before you left?</li>
                                    <li>Had she studied English before moving here?</li>
                                    <li>Had they visited that city before?</li>
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
                        {/* Time indicators */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Time indicators</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">already</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">before</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">after</span>
                            </div>
                        </div>

                        {/* Connecting phrases */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-800">Connecting phrases</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">when (with past simple)</span>
                                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">by the time…</span>
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
                                    <p className="text-slate-700">I <span className="line-through">had went</span> to the store.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">I had gone to the store.</p>
                                            <p className="text-sm text-slate-600">Use past participle after had, not past simple</p>
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
                                    <p className="text-slate-700">I <span className="line-through">have finished</span> before he came.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">I had finished before he came.</p>
                                            <p className="text-sm text-slate-600">Use past perfect, not present perfect, with past time reference</p>
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
                                    <p className="text-slate-700"><span className="line-through">Had you saw</span> her?</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">Had you seen her?</p>
                                            <p className="text-sm text-slate-600">Use past participle (seen), not past simple (saw)</p>
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
                                    <p className="text-slate-700">I <span className="line-through">didn&apos;t had</span> finished.</p>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600 font-bold text-lg">✓</span>
                                        <div>
                                            <p className="text-slate-900 font-medium">I hadn&apos;t finished.</p>
                                            <p className="text-sm text-slate-600">Use hadn&apos;t, not didn&apos;t had, for negatives</p>
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
                            <p className="font-medium text-slate-900 mb-3">1. By the time I arrived, they ___ already ___.</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) have / left</div>
                                <div className="text-slate-700">b) had / left</div>
                                <div className="text-slate-700">c) had / leaved</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: b) had / left</p>
                                    <p className="text-slate-600 mt-1">Use past perfect (had + past participle) for the earlier action.</p>
                                </div>
                            </details>
                        </div>

                        {/* MCQ 2 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">2. She was tired because she ___ all night.</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) hadn&apos;t slept</div>
                                <div className="text-slate-700">b) didn&apos;t sleep</div>
                                <div className="text-slate-700">c) hasn&apos;t slept</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: a) hadn&apos;t slept</p>
                                    <p className="text-slate-600 mt-1">Use past perfect to show the cause of a past state.</p>
                                </div>
                            </details>
                        </div>

                        {/* MCQ 3 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">3. ___ you ___ that movie before yesterday?</p>
                            <div className="space-y-2 mb-3">
                                <div className="text-slate-700">a) Did / see</div>
                                <div className="text-slate-700">b) Have / seen</div>
                                <div className="text-slate-700">c) Had / seen</div>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: c) Had / seen</p>
                                    <p className="text-slate-600 mt-1">Question form: Had + subject + past participle?</p>
                                </div>
                            </details>
                        </div>

                        {/* Input 1 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">4. Complete: When we arrived, the meeting ___ (start).</p>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: had started</p>
                                    <p className="text-slate-600 mt-1">The meeting started before we arrived (earlier action).</p>
                                </div>
                            </details>
                        </div>

                        {/* Input 2 */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                            <p className="font-medium text-slate-900 mb-3">5. Complete: I ___ (not/eat) sushi before my trip to Japan.</p>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-violet-600 hover:text-violet-700 font-medium">
                                    Show answer
                                </summary>
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="font-medium text-green-800">Answer: hadn&apos;t eaten</p>
                                    <p className="text-slate-600 mt-1">Negative form: hadn&apos;t + past participle.</p>
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
                        <Link href="/practice">
                            <Button className="bg-violet-600 hover:bg-violet-700">
                                Go to Practice →
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
                                Past Time
                            </span>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                Past Perfect
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
