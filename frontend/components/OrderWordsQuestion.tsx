"use client";

import React, { useState } from "react";

export interface OrderWordsQuestionProps {
    prompt: string;
    tokens: string[];
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

export function OrderWordsQuestion({
    prompt,
    tokens,
    answer,
    explanation,
    onSubmit,
    disabled = false,
}: OrderWordsQuestionProps) {
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const [availableTokens, setAvailableTokens] = useState<string[]>(tokens);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleTokenClick = (token: string, index: number) => {
        if (disabled || showFeedback) return;

        // Add to selected tokens
        setSelectedTokens((prev) => [...prev, token]);

        // Remove from available tokens
        setAvailableTokens((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSelectedTokenClick = (index: number) => {
        if (disabled || showFeedback) return;

        const token = selectedTokens[index];

        // Remove from selected tokens
        setSelectedTokens((prev) => prev.filter((_, i) => i !== index));

        // Add back to available tokens
        setAvailableTokens((prev) => [...prev, token]);
    };

    const handleReset = () => {
        if (disabled || showFeedback) return;

        setSelectedTokens([]);
        setAvailableTokens(tokens);
    };

    const handleSubmit = () => {
        if (disabled || showFeedback || selectedTokens.length === 0) return;

        const userAnswer = selectedTokens.join(" ");
        const normalizedUser = normalizeAnswer(userAnswer);
        const normalizedAnswer = normalizeAnswer(answer);
        const correct = normalizedUser === normalizedAnswer;

        setIsCorrect(correct);
        setShowFeedback(true);
        onSubmit(correct, userAnswer);
    };

    return (
        <div className="space-y-6">
            {/* Prompt */}
            <p className="text-white text-xl sm:text-2xl font-semibold leading-relaxed">
                {prompt}
            </p>

            {/* Answer Line - Top */}
            <div className="min-h-[80px] p-4 rounded-xl bg-white/5 border-2 border-white/20">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-2 font-semibold">
                    Your Answer
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {selectedTokens.length === 0 ? (
                        <p className="text-slate-500 text-sm italic">
                            Tap words below to build your answer
                        </p>
                    ) : (
                        selectedTokens.map((token, index) => (
                            <button
                                key={`selected-${index}`}
                                onClick={() => handleSelectedTokenClick(index)}
                                disabled={disabled || showFeedback}
                                className={`
                                    px-4 py-2 rounded-lg font-medium text-base
                                    bg-indigo-600 text-white border-2 border-indigo-400
                                    transition-all
                                    ${disabled || showFeedback
                                        ? "cursor-not-allowed opacity-75"
                                        : "hover:bg-indigo-700 active:scale-95 cursor-pointer"
                                    }
                                `}
                            >
                                {token}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Token Bank - Bottom */}
            <div className="space-y-3">
                <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Available Words
                </div>
                <div className="flex flex-wrap gap-3">
                    {availableTokens.map((token, index) => (
                        <button
                            key={`token-${index}`}
                            onClick={() => handleTokenClick(token, index)}
                            disabled={disabled || showFeedback}
                            className={`
                                px-6 py-3 min-h-[48px] rounded-xl font-semibold text-lg
                                bg-white/10 text-white border-2 border-white/30
                                transition-all shadow-lg
                                ${disabled || showFeedback
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-white/20 hover:border-white/50 active:scale-95 cursor-pointer"
                                }
                            `}
                        >
                            {token}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            {!showFeedback && (
                <div className="space-y-2">
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            disabled={selectedTokens.length === 0 || disabled}
                            className={`
                            flex-1 py-4 min-h-[56px] rounded-xl font-bold transition-all text-base
                            ${selectedTokens.length > 0 && !disabled
                                    ? "bg-slate-700 hover:bg-slate-600 text-white shadow-lg hover:shadow-xl active:scale-95"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                }
                        `}
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedTokens.length === 0 || disabled}
                            className={`
                            flex-[2] py-4 min-h-[56px] rounded-xl font-bold transition-all text-base
                            ${selectedTokens.length > 0 && !disabled
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl active:scale-95"
                                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                                }
                        `}
                        >
                            Submit Answer
                        </button>
                    </div>
                    {(selectedTokens.length === 0 || disabled) && (
                        <div className="text-center">
                            <span className="text-xs text-slate-500 font-medium opacity-70">Answer required</span>
                        </div>
                    )}
                </div>
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
