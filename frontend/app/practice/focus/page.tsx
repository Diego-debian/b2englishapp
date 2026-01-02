"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Protected } from "@/components/Protected";
import { TENSES, TenseSlug } from "@/lib/tenses";
import { FOCUS_QUESTION_BANKS, FocusQuestion } from "@/lib/focusQuestions";
import { FillBlankQuestion } from "@/components/FillBlankQuestion";
import { OrderWordsQuestion } from "@/components/OrderWordsQuestion";
import { focusStorage, FocusStats } from "@/lib/focusStorage";

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

type SessionPhase = "selection" | "playing" | "feedback" | "summary" | "empty";

type FocusQType = "mcq" | "fill_blank" | "order_words";

interface FocusResult {
    id: string;
    type: FocusQType;
    prompt: string;
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
}

interface SessionState {
    phase: SessionPhase;
    questions: FocusQuestion[];
    results: FocusResult[];
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
        results: [],
        currentIndex: 0,
        userAnswer: "",
        isCorrect: null,
        correctCount: 0,
    });
    const [deviceStats, setDeviceStats] = useState<FocusStats | null>(null);
    const weeklyStats = useMemo(() => deviceStats ? focusStorage.getWeeklyStats(deviceStats) : null, [deviceStats]);

    // Auto-select tense from query parameter on mount
    useEffect(() => {
        // Hydrate from localStorage
        setDeviceStats(focusStorage.getStats());
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
            setSession({
                ...session,
                phase: "empty"
            });
            return;
        }

        // SMART DECK SELECTION (Avoid repetition)
        const pickedIds = focusStorage.pickQuestions(selectedTense, 5, bank);

        // Map back to objects
        const picked = pickedIds
            .map(id => bank.find(q => q.id === id))
            .filter((q): q is FocusQuestion => !!q); // Type guard

        // Fallback safety (should rarely happen)
        if (picked.length === 0) {
            const shuffled = shuffleArray(bank);
            // picked = shuffled.slice(0, 5); // Direct assignment
            setSession({
                phase: "playing",
                questions: shuffled.slice(0, 5),
                results: [],
                currentIndex: 0,
                userAnswer: "",
                isCorrect: null,
                correctCount: 0,
            });
            return;
        }

        setSession({
            phase: "playing",
            questions: picked,
            results: [],
            currentIndex: 0,
            userAnswer: "",
            isCorrect: null,
            correctCount: 0,
        });
    };

    const handleSubmit = () => {
        const current = session.questions[session.currentIndex];
        const correct = normalizeAnswer(session.userAnswer) === normalizeAnswer(current.answer);

        const newResult: FocusResult = {
            id: current.id,
            type: current.type,
            prompt: current.prompt,
            userAnswer: session.userAnswer,
            isCorrect: correct,
            correctAnswer: current.answer,
            explanation: current.explanation
        };

        // Avoid duplicates if user somehow retries
        const existingIndex = session.results.findIndex(r => r.id === current.id);
        const newResults = [...session.results];
        if (existingIndex >= 0) {
            newResults[existingIndex] = newResult;
        } else {
            newResults.push(newResult);
        }

        setSession({
            ...session,
            phase: "feedback",
            results: newResults,
            isCorrect: correct,
            correctCount: session.correctCount + (correct ? 1 : 0),
        });
    };

    const handleNext = () => {
        const nextIndex = session.currentIndex + 1;
        if (nextIndex >= session.questions.length) {
            // Save local stats on session completion
            const latestStats = focusStorage.saveSession(session.correctCount, session.questions.length);
            setDeviceStats(latestStats || null);
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
            results: [],
            currentIndex: 0,
            userAnswer: "",
            isCorrect: null,
            correctCount: 0,
        });
    };

    const handleRepeatMistakes = () => {
        if (!selectedTense) return;

        // 1. Identify failed questions
        const failedIds = new Set(session.results.filter(r => !r.isCorrect).map(r => r.id));
        const mistakesToRepeat = session.questions.filter(q => failedIds.has(q.id));

        if (mistakesToRepeat.length === 0) return;

        // 2. Start new session with ONLY these mistakes
        setSession({
            phase: "playing",
            questions: shuffleArray(mistakesToRepeat),
            results: [],
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
                                        group relative p - 5 sm: p - 6 rounded - xl backdrop - blur - xl transition - all duration - 300
border - 2 text - left transform
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
text - xs font - bold uppercase tracking - wider px - 2.5 py - 1 rounded - full ring - 1
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
                                style={{ width: `${(progress / total) * 100}% ` }}
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
                        {current.type === "mcq" && current.choices && (session.phase === "playing" || session.phase === "feedback") && (
                            <div className="space-y-3">
                                {current.choices.map((choice, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSession({ ...session, userAnswer: choice })}
                                        className={`
w - full p - 4 text - left rounded - xl border - 2 transition - all
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
                                key={current.id}
                                prompt={current.prompt}
                                answer={current.answer}
                                explanation={current.explanation}
                                onSubmit={(isCorrect, userAnswer) => {
                                    const newResult: FocusResult = {
                                        id: current.id,
                                        type: current.type,
                                        prompt: current.prompt,
                                        userAnswer: userAnswer,
                                        isCorrect: isCorrect,
                                        correctAnswer: current.answer,
                                        explanation: current.explanation
                                    };

                                    const existingIndex = session.results.findIndex(r => r.id === current.id);
                                    const newResults = [...session.results];
                                    if (existingIndex >= 0) {
                                        newResults[existingIndex] = newResult;
                                    } else {
                                        newResults.push(newResult);
                                    }

                                    setSession({
                                        ...session,
                                        phase: "feedback",
                                        isCorrect,
                                        userAnswer,
                                        results: newResults,
                                        correctCount: session.correctCount + (isCorrect ? 1 : 0),
                                    });
                                }}
                                disabled={session.phase === "feedback"}
                            />
                        )}

                        {/* Order Words Component */}
                        {current.type === "order_words" && current.tokens && (session.phase === "playing" || session.phase === "feedback") && (
                            <OrderWordsQuestion
                                key={current.id}
                                prompt={current.prompt}
                                tokens={current.tokens}
                                answer={current.answer}
                                explanation={current.explanation}
                                onSubmit={(isCorrect, userAnswer) => {
                                    const newResult: FocusResult = {
                                        id: current.id,
                                        type: current.type,
                                        prompt: current.prompt,
                                        userAnswer: userAnswer,
                                        isCorrect: isCorrect,
                                        correctAnswer: current.answer,
                                        explanation: current.explanation
                                    };

                                    const existingIndex = session.results.findIndex(r => r.id === current.id);
                                    const newResults = [...session.results];
                                    if (existingIndex >= 0) {
                                        newResults[existingIndex] = newResult;
                                    } else {
                                        newResults.push(newResult);
                                    }

                                    setSession({
                                        ...session,
                                        phase: "feedback",
                                        isCorrect,
                                        userAnswer,
                                        results: newResults,
                                        correctCount: session.correctCount + (isCorrect ? 1 : 0),
                                    });
                                }}
                                disabled={session.phase === "feedback"}
                            />
                        )}

                        {/* Submit Button (MCQ only) */}
                        {session.phase === "playing" && current.type === "mcq" && (
                            <div className="space-y-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!session.userAnswer.trim()}
                                    className={`
mt - 6 w - full py - 4 rounded - xl font - bold transition - all
                                        ${session.userAnswer.trim()
                                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-95"
                                            : "bg-slate-700 text-slate-500 cursor-not-allowed"
                                        }
`}
                                >
                                    Submit Answer
                                </button>
                                {!session.userAnswer.trim() && (
                                    <div className="text-center">
                                        <span className="text-xs text-slate-500 font-medium opacity-70">Answer required</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Feedback (MCQ only - FillBlank/OrderWords handle their own UI, but we share the unified Next button below) */}
                        {session.phase === "feedback" && current.type === "mcq" && (
                            <div className="mt-6 space-y-4">
                                <div
                                    className={`p - 4 rounded - xl border - 2 ${session.isCorrect
                                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                                            : "bg-red-500/20 border-red-400 text-red-200"
                                        } `}
                                >
                                    <div className="font-bold mb-1">
                                        {session.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                                    </div>
                                    <div className="text-sm">
                                        {!session.isCorrect && `Correct answer: ${current.answer} `}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-500/10 border-2 border-blue-400/30 text-blue-200">
                                    <div className="font-semibold text-xs uppercase tracking-wide mb-1">
                                        Explanation
                                    </div>
                                    <div className="text-sm">{current.explanation}</div>
                                </div>
                            </div>
                        )}

                        {/* Unified Next/Summary Button (Always visible in feedback phase for ALL types) */}
                        {session.phase === "feedback" && (
                            <button
                                onClick={handleNext}
                                className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {session.currentIndex + 1 < session.questions.length ? (
                                    <>
                                        <span>Next Question</span>
                                        <span>→</span>
                                    </>
                                ) : (
                                    <>
                                        <span>View Summary</span>
                                        <span>📊</span>
                                    </>
                                )}
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
        const mistakes = session.results.filter(r => !r.isCorrect);

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

                        {/* Mistakes to Fix Section */}
                        {mistakes.length > 0 ? (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center justify-center gap-2">
                                    <span>⚠️</span> Mistakes to Fix (Top 3)
                                </h3>
                                <div className="space-y-4 text-left">
                                    {mistakes.slice(0, 3).map((mistake) => (
                                        <div key={mistake.id} className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4">
                                            <p className="text-white font-medium mb-2">{mistake.prompt}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                <div className="text-red-300">
                                                    <span className="font-bold opacity-70 block text-xs uppercase">Your Answer</span>
                                                    {mistake.userAnswer}
                                                </div>
                                                <div className="text-emerald-300">
                                                    <span className="font-bold opacity-70 block text-xs uppercase">Correct Answer</span>
                                                    {mistake.correctAnswer}
                                                </div>
                                            </div>
                                            {mistake.explanation && (
                                                <div className="mt-3 pt-3 border-t border-white/10 text-slate-300 text-xs italic flex justify-between items-center gap-2">
                                                    <span>{mistake.explanation}</span>
                                                    <span className="text-[10px] uppercase font-bold text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded bg-indigo-500/10 whitespace-nowrap">Repeat This</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <h3 className="text-xl font-bold text-emerald-300 mb-2">Perfect run</h3>
                                <p className="text-emerald-200/80">You nailed it! Ready for the next challenge?</p>
                            </div>
                        )}

                        {/* Device Stats (Local Storage) */}
                        {deviceStats && (
                            <div className="mb-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-left">
                                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span>📱</span> This Device Stats
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-white">{deviceStats.sessions}</div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Sessions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-indigo-400">
                                            {deviceStats.totalQuestions > 0
                                                ? Math.round((deviceStats.totalCorrect / deviceStats.totalQuestions) * 100)
                                                : 0}%
                                        </div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Accuracy</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-emerald-400">{deviceStats.totalCorrect}</div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Total Correct</div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
                                            <span>🔥</span> {deviceStats.streak || 0}
                                        </div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Day Streak</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-slate-300 mt-1">
                                            {deviceStats.lastPlayed ? new Date(deviceStats.lastPlayed).toLocaleDateString() : "-"}
                                        </div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Last Practice</div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-700/50">
                                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wide mb-3">Daily Goals</h4>

                                    {/* Session Goal */}
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Sessions</span>
                                            <span className="text-white font-bold">{deviceStats.dailySessions || 0} / 1</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h - full rounded - full transition - all duration - 500 ${(deviceStats.dailySessions || 0) >= 1 ? "bg-emerald-400" : "bg-indigo-500"
                                                    } `}
                                                style={{ width: `${Math.min(100, ((deviceStats.dailySessions || 0) / 1) * 100)}% ` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Questions Goal */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Questions</span>
                                            <span className="text-white font-bold">{deviceStats.dailyQuestions || 0} / 10</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h - full rounded - full transition - all duration - 500 ${(deviceStats.dailyQuestions || 0) >= 10 ? "bg-emerald-400" : "bg-indigo-500"
                                                    } `}
                                                style={{ width: `${Math.min(100, ((deviceStats.dailyQuestions || 0) / 10) * 100)}% ` }}
                                            />
                                        </div>
                                    </div>

                                    {(deviceStats.dailySessions || 0) >= 1 && (deviceStats.dailyQuestions || 0) >= 10 && (
                                        <div className="mt-3 text-center text-sm font-bold text-emerald-400 animate-pulse">
                                            Daily goal completed ✅
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Weekly Stats Card */}
                        {weeklyStats && (
                            <div className="mb-8 p-4 rounded-xl bg-indigo-900/20 border border-indigo-500/20 text-left">
                                <h3 className="font-bold text-indigo-300 text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span>📅</span> This Week
                                </h3>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-center">
                                        <div className="text-white font-bold text-lg">{weeklyStats.daysPracticed}/7</div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Days</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-white font-bold text-lg">{weeklyStats.totalSessions}</div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Sessions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text - lg font - bold ${weeklyStats.avgAccuracy >= 70 ? "text-emerald-400" : "text-amber-400"} `}>
                                            {weeklyStats.avgAccuracy}%
                                        </div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">Avg Acc.</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Coach-like Next Step */}
                        <div className="mb-8 font-medium text-slate-300">
                            {percentage < 70 ? (
                                <p className="animate-pulse text-amber-300">Coach says: Let's fix those slips before moving on. 👇</p>
                            ) : (
                                <p className="text-emerald-300">Coach says: Good job! Keep the momentum. 👇</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                            {/* Repeat Mistakes */}
                            {mistakes.length > 0 && (
                                <button
                                    onClick={handleRepeatMistakes}
                                    className="w-full px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <span>↺</span> Repeat Mistakes Only ({mistakes.length})
                                </button>
                            )}

                            {/* New Session (Same Tense) */}
                            <button
                                onClick={startSession}
                                className={`
w - full px - 6 py - 4 font - bold rounded - xl shadow - lg transition - all active: scale - 95 flex items - center justify - center gap - 2
                                    ${mistakes.length === 0
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/30"
                                        : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                    }
`}
                            >
                                <span>▶</span> New Session
                            </button>

                            {/* Change Tense (Selection) */}
                            <button
                                onClick={handleRestart}
                                className="w-full px-6 py-4 text-slate-400 hover:text-white font-medium hover:bg-white/5 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span>≡</span> Change Tense
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    // RENDER: Empty State
    if (session.phase === "empty") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="max-w-md w-full px-4">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                        <div className="text-4xl mb-4">🚧</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Under Construction</h2>
                        <p className="text-slate-300 mb-8">
                            We haven't added questions for <span className="text-indigo-300 font-semibold">{selectedTense && TENSES[selectedTense].title}</span> yet.
                        </p>
                        <button
                            onClick={handleRestart}
                            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                        >
                            Choose Another Tense
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

