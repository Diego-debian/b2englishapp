
import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { ChoiceQuestion, InputQuestion, QuestionUIState } from "@/components/QuestionTypes";
import type { QuestionOut, SubmitAnswerOut } from "@/lib/types";
import type { LifelineState } from "@/store/practiceStore";

interface MillionaireGameViewProps {
    currentQ: QuestionOut;
    currentIndex: number;
    timeLeft: number | null;
    lifelines: LifelineState;
    lastFeedback: SubmitAnswerOut | null;
    loading: boolean;
    answer: string;
    uiState: QuestionUIState;
    onAnswerChange: (val: string) => void;
    onSubmit: () => void;
    onNext: () => void;
    onSwap: () => void;
    onTime: () => void;
    onDouble: () => void;
}

/**
 * Pedagogical prompt normalizer.
 * Separates instruction from content.
 */
/**
 * Pedagogical prompt normalizer.
 * Separates instruction from content.
 * Robustness: Handles {prompt}, {text}, {question} or string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePrompt(raw: any) {
    let text = "";

    // 1. Resolve raw to string
    if (typeof raw === "string") {
        text = raw;
    } else if (raw && typeof raw === "object") {
        // If it has a 'prompt' property
        if (raw.prompt) {
            if (typeof raw.prompt === "string") text = raw.prompt;
            else if (typeof raw.prompt === "object") {
                // Nested object structure
                return {
                    instruction: raw.prompt.instruction || "Elige la mejor respuesta.",
                    content: raw.prompt.content || ""
                };
            }
        }
        // Fallbacks if strictly 'prompt' failed or wasn't there
        if (!text) text = raw.text || raw.question || raw.content || raw.statement || "";
    }

    // 2. Normalize string
    text = text?.trim() || "";

    if (text.startsWith("Complete:")) {
        return {
            instruction: "Completa la oración",
            content: text.replace(/^Complete:\s*/i, "")
        };
    }

    // Default for questions (Which, What, etc) or others
    return {
        instruction: "Elige la mejor respuesta.",
        content: text
    };
}

export function MillionaireGameView({
    currentQ,
    currentIndex,
    timeLeft,
    lifelines,
    lastFeedback,
    loading,
    answer,
    uiState,
    onAnswerChange,
    onSubmit,
    onNext,
    onSwap,
    onTime,
    onDouble,
}: MillionaireGameViewProps) {
    const __DEV__ = process.env.NODE_ENV !== "production";

    // Pass entire object to let robustifier find the best property (prompt, text, question...)
    const normPrompt = normalizePrompt(currentQ);

    if (__DEV__) {
        console.log("[MillionaireDebug] Prompt:", {
            raw: currentQ.prompt,
            keys: Object.keys(currentQ),
            normalized: normPrompt
        });
    }

    return (
        <div className="space-y-4">
            {/* Header Info Card */}
            <div className="grid grid-cols-3 gap-2">
                <Card className="col-span-3 border-2 border-amber-200 bg-amber-50 p-3 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest leading-none">Modo Millionaire</p>
                        <p className="text-xs text-amber-900 mt-1">Muerte súbita activa</p>
                    </div>
                    {timeLeft !== null && (
                        <div className={`text-lg font-black font-mono px-3 py-1 rounded-lg ${timeLeft < 10 ? "bg-red-100 text-red-600 animate-pulse" : "bg-white text-slate-700"}`}>
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                        </div>
                    )}
                </Card>
            </div>

            {/* Main Game Card */}
            <Card className="relative overflow-hidden min-h-[350px] transition-colors duration-500 bg-slate-900 text-white border-slate-800">
                <div className="p-4 md:p-6 text-base relative z-10">

                    {/* Question Metadata */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-400">
                            #{currentIndex + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${["choice", "mcq", "multiple_choice", "true_false"].includes(currentQ.kind)
                            ? "bg-blue-50 text-blue-600"
                            : "bg-orange-50 text-orange-600"
                            }`}>
                            {["choice", "mcq", "multiple_choice", "true_false"].includes(currentQ.kind) ? "Opción" : "Escritura"}
                        </span>
                    </div>

                    {/* The Question (Stacking Isolation) */}
                    <div className="mb-6">
                        {(() => {
                            const p = normalizePrompt(currentQ);
                            const text = (p.content || p.instruction || "").trim();

                            return (
                                <div className="relative isolate z-50 mb-4">
                                    <div className="rounded-xl bg-white px-4 py-3 shadow-md">
                                        {p.instruction && (
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                {p.instruction}
                                            </p>
                                        )}
                                        <h2 className="mt-1 text-xl font-black leading-snug text-slate-900 whitespace-pre-wrap break-words">
                                            {text}
                                        </h2>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Lifelines */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <Button variant="secondary" onClick={onSwap} disabled={lifelines.swap || !!lastFeedback} className={`text-xs py-1 h-8 ${lifelines.swap ? "opacity-40" : ""}`}>🔄 Swap</Button>
                        <Button variant="secondary" onClick={onTime} disabled={lifelines.time || !!lastFeedback} className={`text-xs py-1 h-8 ${lifelines.time ? "opacity-40" : ""}`}>⏳ Time</Button>
                        <Button variant="secondary" onClick={onDouble} disabled={lifelines.double || !!lastFeedback} className={`text-xs py-1 h-8 ${lifelines.double ? "opacity-40" : ""}`}>✨ XP</Button>
                    </div>

                    {/* Content: Options or Input */}
                    <div className="space-y-6">
                        {loading && <div className="py-4"><Spinner /></div>}

                        {["choice", "mcq", "multiple_choice", "true_false"].includes(currentQ.kind) ? (
                            <ChoiceQuestion
                                key={currentQ.id}
                                options={currentQ.options}
                                userAnswer={answer}
                                onChange={onAnswerChange}
                                disabled={loading || lastFeedback !== null}
                                onConfirm={onSubmit}
                                prompt={currentQ.prompt}
                                uiState={uiState}
                                correctOption={lastFeedback?.correct_answer ?? null}
                            />
                        ) : (
                            <InputQuestion
                                key={currentQ.id}
                                userAnswer={answer}
                                onChange={onAnswerChange}
                                disabled={loading || lastFeedback !== null}
                                onConfirm={onSubmit}
                                prompt={currentQ.prompt}
                            />
                        )}

                        {/* Feedback Area */}
                        {lastFeedback === null ? (
                            <div className="pt-2">
                                <Button
                                    className="w-full py-3 text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-[0.98] bg-amber-600 hover:bg-amber-700 text-white"
                                    onClick={onSubmit}
                                    disabled={loading || !answer.trim()}
                                >
                                    COMPROBAR
                                </Button>
                            </div>
                        ) : (
                            /* Feedback UI */
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4 pt-4 border-t border-slate-700/50">
                                <div className={`rounded-xl p-4 flex gap-4 ${lastFeedback.is_correct ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                                    <div className="text-2xl">{lastFeedback.is_correct ? "✅" : "❌"}</div>
                                    <div>
                                        <p className="font-black uppercase tracking-tight">{lastFeedback.is_correct ? "¡Correcto!" : "Incorrecto"}</p>
                                        <p className="text-sm opacity-80">{lastFeedback.is_correct ? `+${lastFeedback.xp_awarded} XP` : "Revisa la solución abajo"}</p>
                                    </div>
                                </div>

                                {!lastFeedback.is_correct && lastFeedback.correct_answer && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase">Respuesta Correcta</p>
                                        <p className="font-bold text-emerald-900 text-lg">{lastFeedback.correct_answer}</p>
                                    </div>
                                )}

                                {currentQ.explanation && (
                                    <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">💡 Explicación</p>
                                        {currentQ.explanation}
                                    </div>
                                )}

                                <Button onClick={onNext} className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-black uppercase tracking-widest shadow-lg">
                                    Continuar →
                                </Button>
                            </div>
                        )}
                    </div>

                </div>
            </Card>
        </div>
    );
}
