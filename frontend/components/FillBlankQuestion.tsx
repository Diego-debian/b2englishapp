"use client";

import React, { useState, KeyboardEvent } from "react";

export interface FillBlankQuestionProps {
    prompt: string;
    answer: string;
    explanation?: string;
    onSubmit: (isCorrect: boolean, userAnswer: string) => void;
    disabled?: boolean;
}

/**
 * Normalize answer for comparison
 * - Trim whitespace
 * - Collapse multiple spaces to single space
 * - Convert to lowercase
 * - Remove trailing period (optional tolerance)
 */
function normalizeAnswer(text: string): string {
    return text
        .trim()
        .replace(/\s+/g, " ") // Collapse multiple spaces
        .toLowerCase()
        .replace(/\.+$/, ""); // Remove trailing period(s)
}

export function FillBlankQuestion({
    prompt,
    answer,
    explanation,
    onSubmit,
    disabled = false,
}: FillBlankQuestionProps) {
    const [userInput, setUserInput] = useState("");
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = () => {
        if (!userInput.trim() || disabled) return;

        const normalizedUser = normalizeAnswer(userInput);
        const normalizedAnswer = normalizeAnswer(answer);
        const correct = normalizedUser === normalizedAnswer;

        setIsCorrect(correct);
        setShowFeedback(true);
        onSubmit(correct, userInput);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !disabled && userInput.trim()) {
            handleSubmit();
        }
    };

    return (
        <div className="space-y-6">
            {/* Prompt */}
            <p className="text-white text-xl sm:text-2xl font-semibold leading-relaxed">
                {prompt}
            </p>

            {/* Input */}
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled || showFeedback}
                placeholder="Type your answer..."
                className={`
                    w-full p-4 rounded-xl border-2 text-white placeholder-slate-400 
                    outline-none transition-all font-medium text-lg
                    ${showFeedback
                        ? isCorrect
                            ? "bg-emerald-500/10 border-emerald-400 ring-2 ring-emerald-500/30"
                            : "bg-red-500/10 border-red-400 ring-2 ring-red-500/30"
                        : "bg-white/5 border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50"
                    }
                    ${disabled || showFeedback ? "cursor-not-allowed opacity-75" : ""}
                `}
                autoFocus
            />

            {/* Submit Button */}
            {!showFeedback && (
                <button
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || disabled}
                    className={`
                        w-full py-4 rounded-xl font-bold transition-all text-base
                        ${userInput.trim() && !disabled
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl active:scale-95"
                            : "bg-slate-700 text-slate-500 cursor-not-allowed"
                        }
                    `}
                >
                    Submit Answer
                </button>
            )}

            {/* Feedback */}
            {showFeedback && (
                <div className="space-y-4 animate-fade-in">
                    {/* Correctness Indicator */}
                    <div
                        className={`p-4 rounded-xl border-2 ${isCorrect
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                            : "bg-red-500/20 border-red-400 text-red-200"
                            }`}
                    >
                        <div className="font-bold mb-1 flex items-center gap-2">
                            {isCorrect ? (
                                <>
                                    <span className="text-xl">✅</span>
                                    <span>Correct!</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xl">❌</span>
                                    <span>Incorrect</span>
                                </>
                            )}
                        </div>
                        {!isCorrect && (
                            <div className="text-sm mt-2">
                                <span className="font-semibold">Correct answer:</span> {answer}
                            </div>
                        )}
                    </div>

                    {/* Explanation */}
                    {explanation && (
                        <div className="p-4 rounded-xl bg-blue-500/10 border-2 border-blue-400/30 text-blue-200">
                            <div className="font-semibold text-xs uppercase tracking-wide mb-1 text-blue-300">
                                Explanation
                            </div>
                            <div className="text-sm leading-relaxed">{explanation}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
