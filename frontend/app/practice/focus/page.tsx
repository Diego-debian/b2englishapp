"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Protected } from "@/components/Protected";
import { TENSES, TenseSlug } from "@/lib/tenses";
import { FOCUS_QUESTION_BANKS, FocusQuestion } from "@/lib/focusQuestions";
import { FillBlankQuestion } from "@/components/FillBlankQuestion";
import { OrderWordsQuestion } from "@/components/OrderWordsQuestion";

// Group tenses by category
const TENSE_LIST: Array<{ slug: TenseSlug; category: "present" | "past" | "future" }> = [
    { slug: "present-simple", category: "present" },
    { slug: "present-continuous", category: "present" },
    { slug: "present-perfect", category: "present" },
    { slug: "present-perfect-continuous", category: "present" },
    { slug: "past-simple", category: "past" },
    { slug: "past-continuous", category: "past" },
    { slug: "past-perfect", category: "past" },
    { slug: "past-perfect-continuous", category: "past" },
    { slug: "will", category: "future" },
    { slug: "going-to", category: "future" },
    { slug: "future-continuous", category: "future" },
    { slug: "future-perfect", category: "future" },
];

type SessionPhase = "selection" | "playing" | "feedback" | "summary";

interface SessionState {
    phase: SessionPhase;
    questions: FocusQuestion[];
    currentIndex: number;
    userAnswer: string;
    isCorrect: boolean | null;
    correctCount: number;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Normalize answer for comparison
function normalizeAnswer(val: string): string {
    return val.trim().toLowerCase();
}

function FocusPageInner() {
    const searchParams = useSearchParams();
    const [selectedTense, setSelectedTense] = useState<TenseSlug | null>(null);
    const [session, setSession] = useState<SessionState>({
        phase: "selection",
        questions: [],
        currentIndex: 0,
        userAnswer: "",
        isCorrect: null,
        correctCount: 0,
    });

    // Auto-select tense from query parameter on mount
    useEffect(() => {
        const tenseParam = searchParams?.get("tense");
        if (tenseParam) {
            // Check if the tense exists in our tense list
            const tenseExists = TENSE_LIST.find((t) => t.slug === tenseParam);
            if (tenseExists) {
                setSelectedTense(tenseParam as TenseSlug);
            }
        }
    }, [searchParams]);

    const getCategoryBadgeStyle = (category: "present" | "past" | "future") => {
        const styles = {
            present: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
            past: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
            future: "bg-blue-500/20 text-blue-300 ring-blue-500/30",
        };
        return styles[category];
    };

    const getCategoryLabel = (category: "present" | "past" | "future") => {
        const labels = {
            present: "Present",
            past: "Past",
            future: "Future",
        };
        return labels[category];
    };

    const startSession = () => {
        if (!selectedTense) return;

        const bank = FOCUS_QUESTION_BANKS[selectedTense];
        if (!bank || bank.length === 0) {
            alert("Coming soon for this tense!");
            return;
        }

        const shuffled = shuffleArray(bank);
        const picked = shuffled.slice(0, 5);

        setSession({
            phase: "playing",
            questions: picked,
            currentIndex: 0,
            userAnswer: "",
            isCorrect: null,
            correctCount: 0,
        });
    };

    const handleSubmit = () => {
        const current = session.questions[session.currentIndex];
        const correct = normalizeAnswer(session.userAnswer) === normalizeAnswer(current.answer);

        setSession({
            ...session,
            phase: "feedback",
            isCorrect: correct,
            correctCount: session.correctCount + (correct ? 1 : 0),
        });
    };

    const handleNext = () => {
        const nextIndex = session.currentIndex + 1;
        if (nextIndex >= session.questions.length) {
            setSession({ ...session, phase: "summary" });
        } else {
            setSession({
                ...session,
                phase: "playing",
                currentIndex: nextIndex,
                userAnswer: "",
                isCorrect: null,
            });
        }
    };

    const handleRestart = () => {
        setSelectedTense(null);
        setSession({
            phase: "selection",
            questions: [],
            currentIndex: 0,
            userAnswer: "",
            isCorrect: null,
            correctCount: 0,
        });
    };

    // RENDER: Selection Screen
    if (session.phase === "selection") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Nav Header */}
                    <div className="flex items-center gap-6 mb-8 text-sm font-medium text-slate-400">
                        <Link href="/practice" className="hover:text-white hover:underline transition-colors">
                            ← Back to Practice
                        </Link>
                        <Link href="/tenses" className="hover:text-white hover:underline transition-colors">
                            Back to Tenses
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-12 space-y-3">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight animate-fade-in">
                            Choose Your Focus
                        </h1>
                        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Practice one tense at a time. Master the details.
                        </p>
                        <p className="text-sm text-slate-400 max-w-xl mx-auto">
                            5 targeted questions · Instant feedback · Build confidence
                        </p>
                    </div>

                    {/* Tense Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {TENSE_LIST.map(({ slug, category }) => {
                            const info = TENSES[slug];
                            const isSelected = selectedTense === slug;

                            return (
                                <button
                                    key={slug}
                                    onClick={() => setSelectedTense(slug)}
                                    className={`
                                        group relative p-5 sm:p-6 rounded-xl backdrop-blur-xl transition-all duration-300
                                        border-2 text-left transform
                                        ${isSelected
                                            ? "bg-white/10 border-indigo-500 shadow-2xl shadow-indigo-500/30 scale-105 ring-2 ring-indigo-400/30"
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400/50 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10"
                                        }
                                    `}
                                >
                                    {/* Category Badge */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span
                                            className={`
                                                text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ring-1
                                                ${getCategoryBadgeStyle(category)}
                                            `}
                                        >
                                            {getCategoryLabel(category)}
                                        </span>
                                    </div>

                                    {/* Tense Title */}
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-indigo-100 transition-colors">
                                        {info.title}
                                    </h3>

                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-3 right-3">
                                            <svg
                                                className="w-6 h-6 text-indigo-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Start Button */}
                    {selectedTense && (
                        <div className="mt-12 text-center animate-fade-in">
                            <button
                                onClick={startSession}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/40 transition-all active:scale-95 transform"
                            >
                                Start Focused Practice
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // RENDER: Playing / Feedback
    if (session.phase === "playing" || session.phase === "feedback") {
        const current = session.questions[session.currentIndex];
        const progress = session.currentIndex + 1;
        const total = session.questions.length;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-3xl mx-auto px-4 py-12">
                    {/* Progress Header */}
                    <div className="text-center mb-8 px-2">
                        <div className="text-slate-400 text-sm mb-2">
                            Question {progress} of {total}
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(progress / total) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <div id="question-card" />
                    <div className="backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                        <p className="text-white text-xl sm:text-2xl font-semibold mb-6 leading-relaxed">
                            {current.prompt}
                        </p>

                        {/* MCQ Choices */}
                        {current.type === "mcq" && current.choices && session.phase === "playing" && (
                            <div className="space-y-3">
                                {current.choices.map((choice, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSession({ ...session, userAnswer: choice })}
                                        className={`
                                            w-full p-4 text-left rounded-xl border-2 transition-all
                                            ${session.userAnswer === choice
                                                ? "bg-indigo-500/30 border-indigo-400 text-white"
                                                : "bg-white/5 border-white/20 text-slate-300 hover:bg-white/10 hover:border-indigo-400/50"
                                            }
                                        `}
                                    >
                                        {choice}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Fill Blank Component */}
                        {current.type === "fill_blank" && (session.phase === "playing" || session.phase === "feedback") && (
                            <FillBlankQuestion
                                prompt={current.prompt}
                                answer={current.answer}
                                explanation={current.explanation}
                                onSubmit={(isCorrect, userAnswer) => {
                                    setSession({
                                        ...session,
                                        phase: "feedback",
                                        isCorrect,
                                        userAnswer,
                                        correctCount: session.correctCount + (isCorrect ? 1 : 0),
                                    });
                                }}
                                disabled={session.phase === "feedback"}
                            />
                        )}

                        {/* Order Words Component */}
                        {current.type === "order_words" && current.tokens && (session.phase === "playing" || session.phase === "feedback") && (
                            <OrderWordsQuestion
                                prompt={current.prompt}
                                tokens={current.tokens}
                                answer={current.answer}
                                explanation={current.explanation}
                                onSubmit={(isCorrect, userAnswer) => {
                                    setSession({
                                        ...session,
                                        phase: "feedback",
                                        isCorrect,
                                        userAnswer,
                                        correctCount: session.correctCount + (isCorrect ? 1 : 0),
                                    });
                                }}
                                disabled={session.phase === "feedback"}
                            />
                        )}

                        {/* Submit Button (MCQ only) */}
                        {session.phase === "playing" && current.type === "mcq" && (
                            <button
                                onClick={handleSubmit}
                                disabled={!session.userAnswer.trim()}
                                className={`
                                    mt-6 w-full py-4 rounded-xl font-bold transition-all
                                    ${session.userAnswer.trim()
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-95"
                                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                                    }
                                `}
                            >
                                Submit Answer
                            </button>
                        )}

                        {/* Feedback (MCQ only, FillBlank handles its own) */}
                        {session.phase === "feedback" && current.type === "mcq" && (
                            <div className="mt-6 space-y-4">
                                <div
                                    className={`p-4 rounded-xl border-2 ${session.isCorrect
                                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                                        : "bg-red-500/20 border-red-400 text-red-200"
                                        }`}
                                >
                                    <div className="font-bold mb-1">
                                        {session.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                                    </div>
                                    <div className="text-sm">
                                        {!session.isCorrect && `Correct answer: ${current.answer}`}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-500/10 border-2 border-blue-400/30 text-blue-200">
                                    <div className="font-semibold text-xs uppercase tracking-wide mb-1">
                                        Explanation
                                    </div>
                                    <div className="text-sm">{current.explanation}</div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                                >
                                    {session.currentIndex + 1 < session.questions.length
                                        ? "Next Question"
                                        : "View Summary"}
                                </button>
                            </div>
                        )}

                        {/* Next Button for Fill Blank (in feedback phase) */}
                        {session.phase === "feedback" && current.type === "fill_blank" && (
                            <button
                                onClick={handleNext}
                                className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                {session.currentIndex + 1 < session.questions.length
                                    ? "Next Question"
                                    : "View Summary"}
                            </button>
                        )}

                        {/* Next Button for Order Words (in feedback phase) */}
                        {session.phase === "feedback" && current.type === "order_words" && (
                            <button
                                onClick={handleNext}
                                className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                {session.currentIndex + 1 < session.questions.length
                                    ? "Next Question"
                                    : "View Summary"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: Summary
    if (session.phase === "summary") {
        const score = session.correctCount;
        const total = session.questions.length;
        const percentage = Math.round((score / total) * 100);

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-2xl mx-auto px-4 py-12">
                    <div className="backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-2xl p-8 sm:p-12 shadow-2xl text-center">
                        <div className="text-5xl sm:text-6xl mb-4 animate-bounce">
                            {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Session Complete!</h2>
                        <p className="text-slate-300 mb-8">
                            {selectedTense && TENSES[selectedTense].title}
                        </p>

                        <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                            <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                                {score} / {total}
                            </div>
                            <div className="text-slate-400">Correct Answers</div>
                        </div>

                        <button
                            onClick={handleRestart}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                        >
                            Practice Another Tense
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default function FocusPage() {
    return (
        <Protected>
            <FocusPageInner />
        </Protected>
    );
}

