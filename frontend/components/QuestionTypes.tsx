"use client";

import React from "react";
import { Button } from "./Button";

export type QuestionUIState = "idle" | "selected" | "submitted" | "correct" | "wrong";

interface QuestionProps {
    prompt: string;
    options?: string[];
    userAnswer: string;
    onChange: (value: string) => void;
    disabled: boolean;
    onConfirm: () => void;
    // New visual props
    uiState?: QuestionUIState;
    correctOption?: string | null;
}

export const ChoiceQuestion: React.FC<QuestionProps> = ({
    options,
    userAnswer,
    onChange,
    disabled,
    uiState = "idle",
    correctOption
}) => {
    if (!options || options.length === 0) return null;

    // Determine effective correct option logically
    const effectiveCorrectOption = uiState === "correct" ? userAnswer : correctOption;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-enter">
            {options.map((opt, idx) => {
                const isSelected = userAnswer === opt;
                // Use effective correct option for highlighting
                const isCorrect = effectiveCorrectOption === opt;

                let variantClass = "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-slate-50";

                if (uiState === "correct") {
                    if (isCorrect) variantClass = "border-emerald-500 bg-emerald-500/10 text-emerald-800 font-bold shadow-sm ring-1 ring-emerald-500/20";
                    else if (isSelected) variantClass = "border-red-200 bg-red-500/5 text-red-400 opacity-50"; // Should not happen if correct but logical fallback
                    else variantClass = "border-slate-100 bg-slate-50 text-slate-400 opacity-40";
                } else if (uiState === "wrong") {
                    if (isSelected) variantClass = "border-red-500 bg-red-500/10 text-red-700 font-bold shadow-sm ring-1 ring-red-500/20";
                    else if (isCorrect) variantClass = "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 font-medium ring-1 ring-emerald-500/10"; // Subtle reveal
                    else variantClass = "border-slate-100 bg-slate-50 text-slate-400 opacity-40";
                } else if (isSelected) {
                    variantClass = "border-violet-500 bg-violet-500/10 text-violet-700 shadow-sm ring-1 ring-violet-500/20";
                }

                // Icon logic
                let iconContent: React.ReactNode = String.fromCharCode(65 + idx);
                let iconClass = "bg-slate-100 text-slate-500";

                if (uiState === "correct" && isCorrect) {
                    iconContent = "✓";
                    iconClass = "bg-emerald-500/20 text-emerald-700";
                } else if (uiState === "wrong") {
                    if (isSelected) {
                        iconContent = "✗";
                        iconClass = "bg-red-500/20 text-red-700";
                    } else if (isCorrect) {
                        iconContent = "✓";
                        iconClass = "bg-emerald-500/10 text-emerald-600";
                    }
                } else if (isSelected) {
                    iconClass = "bg-violet-500/20 text-violet-700";
                }

                return (
                    <button
                        key={idx}
                        disabled={disabled}
                        onClick={() => onChange(opt)}
                        className={`
              p-4 text-left rounded-2xl border-2 transition-all duration-300
              ${variantClass}
              ${disabled && !isSelected && uiState === "idle" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
                    >
                        <span className={`inline-block w-8 h-8 rounded-full text-center leading-8 mr-3 text-xs font-bold transition-colors ${iconClass}`}>
                            {iconContent}
                        </span>
                        {opt}
                    </button>
                );
            })}
        </div>
    );
};

export const InputQuestion: React.FC<QuestionProps> = ({
    userAnswer,
    onChange,
    disabled,
    onConfirm,
}) => {
    return (
        <div className="space-y-4 animate-enter">
            <input
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-xl text-slate-950 outline-none focus:border-violet-500/50 transition-all placeholder:text-slate-300 shadow-sm"
                placeholder="Escribe la respuesta correcta..."
                value={userAnswer}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !disabled && userAnswer.trim()) {
                        onConfirm();
                    }
                }}
                autoFocus
                disabled={disabled}
            />
        </div>
    );
};
