"use client";

import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, XCircle, AlarmClock, Flame, Zap } from "lucide-react";
import { useGamification } from "../hooks/useGamification";

interface Verb {
  id: number;
  infinitive: string;
  past: string;
  participle: string;
  translation: string;
  example_b2: string;
}

interface PracticeCardProps {
  userId: number;
}

function playFeedback(correct: boolean) {
  if (typeof window === "undefined") return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = correct ? 880 : 220;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.setValueAtTime(1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
  osc.stop(ctx.currentTime + 0.5);
}

/**
 * Presenta verbos, evalúa respuestas, calcula XP (bonos por racha y tiempo) y muestra
 * barras de progreso, temporizador y animación de confetti.
 */
export default function PracticeCard({ userId }: PracticeCardProps) {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const {
    streak,
    mistakes,
    addXP,
    incrementStreak,
    resetStreak,
    addMistake,
  } = useGamification();

  const maxTime = 10;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<{ x: number; delay: number; color: string }[]>([]);
  const answerInputRef = useRef<HTMLInputElement | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8001";

  const fetchVerbs = async () => {
    try {
      const res = await fetch(`${apiBase}/verbs/${userId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch verbs. HTTP ${res.status}. Body: ${text.slice(0, 200)}`);
      }
      const data: Verb[] = await res.json();
      setVerbs(data);
      setCurrentIndex(0);
      setIsFinished(false);
    } catch (err) {
      console.error("Error fetching verbs", err);
    }
  };

  useEffect(() => {
    if (!userId || Number.isNaN(userId)) {
      console.warn("[PracticeCard] Invalid userId:", userId);
      return;
    }
    fetchVerbs();
  }, [userId]);

  useEffect(() => {
    setUserAnswer("");
    setFeedback(null);
    setTimeLeft(maxTime);
    if (answerInputRef.current) answerInputRef.current.focus();
  }, [currentIndex]);

  useEffect(() => {
    if (feedback !== null) return;
    if (timeLeft <= 0) {
      handleSubmit(undefined, true);
      return;
    }
    const timerId = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, feedback]);

  useEffect(() => {
    if (showConfetti) {
      const colors = ["#FBBF24", "#34D399", "#60A5FA", "#F472B6", "#F87171"];
      const pieces = Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setConfettiPieces(pieces);
      const timeoutId = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timeoutId);
    }
  }, [showConfetti]);

const handleSubmit = async (
  e?: React.FormEvent,
  fromTimeout: boolean = false,
) => {
  if (e) e.preventDefault();
  const currentVerb = verbs[currentIndex];
  if (!currentVerb) return;

  let correct = false;
  if (!fromTimeout) {
    const normalized = userAnswer.trim().toLowerCase();
    correct = normalized === currentVerb.past.toLowerCase();
  }

  setFeedback(correct ? "correct" : "incorrect");
  playFeedback(correct);

  // Mover la declaración de totalXP FUERA del bloque if
  let totalXP = 0; // Declarar con valor por defecto

  if (correct) {
    const comboMultiplier = 1 + Math.min(streak, 5) * 0.1;
    const timeBonus = (timeLeft / maxTime) * 5;
    const baseXP = 10;
    totalXP = Math.floor(baseXP * comboMultiplier + timeBonus); // Asignar valor
    addXP(totalXP);
    incrementStreak();
  } else {
    resetStreak();
    addMistake();
  }

  if (correct) {
    setShowConfetti(true);
  }

  try {
    const res = await fetch(`${apiBase}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        verb_id: currentVerb.id,
        correct: correct,
        xp: correct ? totalXP : 0, // Ahora totalXP siempre está definida
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`Progress update failed. HTTP ${res.status}. Body: ${text.slice(0, 200)}`);
    }
  } catch (err) {
    console.error("Error updating progress", err);
  }

  setTimeout(() => {
    if (currentIndex < verbs.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  }, correct ? 800 : 500);
};

  const progressPercentage = (currentIndex / verbs.length) * 100;
  const timerPercentage = Math.max((timeLeft / maxTime) * 100, 0);
  const comboMultiplierDisplay = 1 + Math.min(streak, 5) * 0.1;

  if (verbs.length === 0) {
    return <p className="text-center p-4">Cargando verbos…</p>;
  }

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-center">¡Práctica completada!</h3>
        <p className="text-center mb-4">Has terminado esta sesión de verbos.</p>
        <button
          onClick={fetchVerbs}
          className="w-full px-4 py-2 rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          Siguientes verbos
        </button>
      </div>
    );
  }

  const currentVerb = verbs[currentIndex];

  return (
    <div className="relative max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg overflow-hidden">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {confettiPieces.map((piece, idx) => (
            <span
              key={idx}
              className="absolute w-2 h-2 rounded-sm animate-confetti"
              style={{
                left: `${piece.x}%`,
                top: 0,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
              }}
            ></span>
          ))}
        </div>
      )}
      {/* Progress and timer bars */}
      <div className="mb-4 space-y-2">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-0 bg-red-400 transition-all"
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
        <p className="text-xs text-right text-gray-500">
          {currentIndex + 1}/{verbs.length} &bull; Tiempo: {timeLeft}s
        </p>
      </div>
      {/* Verb prompt and translation */}
      <h3 className="text-2xl font-bold mb-1 text-gray-800">{currentVerb.infinitive}</h3>
      <p className="text-sm text-gray-600 mb-4">
        Traducción: <span className="font-medium text-gray-800">{currentVerb.translation}</span>
      </p>
      {/* Answer form */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="flex flex-col gap-3">
        <label htmlFor="answer" className="text-sm font-medium">
          Escribe el pasado simple
        </label>
        <input
          ref={answerInputRef}
          id="answer"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className={`border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
            feedback === "correct"
              ? "border-green-500 focus:ring-green-200"
              : feedback === "incorrect"
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-purple-200"
          }`}
          disabled={feedback !== null}
          autoComplete="off"
        />
        {feedback && (
          <div className="flex items-center gap-2" aria-live="polite">
            {feedback === "correct" ? (
              <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
            )}
            <span className={`text-sm ${feedback === "correct" ? "text-green-600" : "text-red-600"}`}>
              {feedback === "correct" ? "¡Correcto!" : `Incorrecto. Respuesta: ${currentVerb.past}`}
            </span>
          </div>
        )}
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50"
          disabled={feedback !== null}
        >
          Comprobar
        </button>
      </form>
      {/* Example sentence */}
      <div className="mt-4 text-sm text-gray-700 italic">
        <p>
          <strong>Ejemplo:</strong> {currentVerb.example_b2}
        </p>
      </div>
      {/* Session stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
          <span>Racha: {streak}</span>
        </div>
        <div className="flex items-center gap-1">
<Zap className="w-4 h-4 text-yellow-500" aria-hidden="true" />
          <span>Combo x{comboMultiplierDisplay.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <XCircle className="w-4 h-4 text-red-500" aria-hidden="true" />
          <span>Errores: {mistakes}</span>
        </div>
        <div className="flex items-center gap-1">
          <AlarmClock className="w-4 h-4 text-blue-500" aria-hidden="true" />
          <span>Tiempo: {timeLeft}s</span>
        </div>
      </div>
    </div>
  );
}
