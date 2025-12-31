"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { Alert } from "@/components/Alert";
import { ChoiceQuestion, InputQuestion, QuestionUIState } from "@/components/QuestionTypes";
import { LadderProgress } from "@/components/LadderProgress";
import { api } from "@/lib/api";
import { usePracticeStore } from "@/store/practiceStore";
import { useAuthStore } from "@/store/authStore";
import type { ActivityOut, QuestionOut, SubmitAnswerOut } from "@/lib/types";

/**
 * Shuffle an array using the Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Normalize user answer for comparison.
 */
function normalizeAnswer(val: string): string {
  return val
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Remove punctuation
    .replace(/\s{2,}/g, " "); // Collapse spaces
}

/**
 * Pedagogical prompt normalizer.
 * Separates instruction from content.
 */
function normalizePrompt(raw: string) {
  const text = raw.trim();
  if (text.startsWith("Complete:")) {
    return {
      instruction: "Completa la oración eligiendo la opción correcta.",
      content: text.replace(/^Complete:\s*/i, "")
    };
  }
  // Default for questions (Which, What, etc) or others
  return {
    instruction: "Elige la mejor respuesta.",
    content: text
  };
}

type QuestPhase = "WARMUP" | "MAIN" | "BOSS";

export default function PracticePage() {
  return (
    <Protected>
      <PracticeInner />
    </Protected>
  );
}

function PracticeInner() {
  const {
    selectedActivityId,
    attemptId,
    questions,
    currentIndex,
    results,
    sessionXp,
    sessionCorrect,
    sessionWrong,
    history,
    streak,
    ladderLevels,
    setSelectedActivityId,
    setAttempt,
    setQuestions,
    advance,
    resetRun,
    addResult,
    syncStreak,
    practiceMode,
    setPracticeMode,
    // Stage 3 Additions
    lifelines,
    useLifeline,
    activeDoubleXp,
    setActiveDoubleXp,
    spareQuestions,
    setSpareQuestions,
    sessionBonusXp,
    updateLadderLevel,
    usedQuestionIdsThisRun,
    lastMissionCompletedDate,
    markMissionComplete,
    isDailyRun,
    addToHistory
  } = usePracticeStore();

  // Derived state (Moved up for dependencies)
  const isRunReady = questions.length > 0 && attemptId !== null;
  const isFinished = isRunReady && currentIndex >= questions.length;
  const currentQ = questions[currentIndex];

  // Daily Lock Calculation
  const today = new Date().toISOString().split("T")[0];
  const isDailyLocked = lastMissionCompletedDate === today;

  // Mark completion if finished
  useEffect(() => {
    if (isFinished) {
      if (isDailyRun) {
        markMissionComplete();
      }
    }
  }, [isFinished, markMissionComplete, isDailyRun]);

  // LRU Update Strategy: Option A (When Shown)
  // WHY: We update lastSeen immediately when the question is presented.
  // This ensures that even if the user abandons the session or skips without submitting,
  // the question is marked as "recently seen" (high timestamp) and will be downranked
  // by the LRU selector in future sessions, preventing immediate repetition.
  useEffect(() => {
    if (currentQ?.id) {
      addToHistory(currentQ.id);
    }
  }, [currentQ?.id, addToHistory]);

  const [activities, setActivities] = useState<ActivityOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  // Stage 3 States
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const handleTimeout = useCallback(() => {
    // 100% Frontend Fail Handling
    if (isFinished) return;

    setTimeExpired(true);

    const { updateLadderLevel } = usePracticeStore.getState();
    updateLadderLevel(currentIndex, { status: "failed" });

    // End Run Immediately -> jump to end
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (usePracticeStore.setState as any)({ currentIndex: questions.length });
  }, [currentIndex, isFinished, questions.length]);

  // Timer Effect
  useEffect(() => {
    if (practiceMode !== "millionaire" || timeLeft === null || timerPaused || isFinished) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [practiceMode, timeLeft, timerPaused, isFinished, handleTimeout]);

  const [answer, setAnswer] = useState("");
  const [lastFeedback, setLastFeedback] = useState<SubmitAnswerOut | null>(null);
  const [questPhase, setQuestPhase] = useState<QuestPhase>("WARMUP");

  // Determine UI State
  let uiState: QuestionUIState = "idle";
  if (lastFeedback) {
    uiState = lastFeedback.is_correct ? "correct" : "wrong";
  } else if (loading && answer) {
    uiState = "submitted";
  } else if (answer) {
    uiState = "selected";
  }

  const startTimeRef = useRef<number | null>(null);

  // Sync streak on mount
  useEffect(() => {
    syncStreak();
  }, [syncStreak]);

  // Reset local state when Question changes (Robustness fix)
  useEffect(() => {
    setLastFeedback(null);
    setAnswer("");
  }, [currentIndex, questions]);



  const progressText = useMemo(() => {
    const n = questions.length;
    if (!n) return "0/0";
    return `${Math.min(currentIndex + 1, n)}/${n}`;
  }, [questions.length, currentIndex]);

  const progressValue = useMemo(() => {
    const n = questions.length;
    if (!n) return 0;
    // (currentIndex) so the bar starts at 0% at first question
    return Math.round((currentIndex / n) * 100);
  }, [questions.length, currentIndex]);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setStatus(null);

    const abort = new AbortController();
    try {
      const data = await api.activitiesList({}, { signal: abort.signal });
      setActivities(data);

      // Auto-select based on difficulty if none selected
      if (!selectedActivityId && data.length > 0) {
        const sorted = [...data].sort((a, b) => a.difficulty - b.difficulty);
        setSelectedActivityId(sorted[0].id);
      }
    } catch (e: any) {
      setStatus(e?.status ?? null);
      setErr(e?.message ?? "Error cargando activities");
    } finally {
      setLoading(false);
    }

    return () => abort.abort();
  }, [selectedActivityId, setSelectedActivityId]);

  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);

  const startQuest = useCallback(async (isDaily: boolean) => {
    if (activities.length === 0) return;

    setLoading(true);
    setErr(null);
    setStatus(null);
    setLastFeedback(null);
    setAnswer("");
    // Reset Timer State
    setTimeLeft(null);
    setTimerPaused(false);
    setTimeExpired(false);

    resetRun();

    // Set Run Type
    usePracticeStore.getState().setIsDailyRun(isDaily);

    // Helper to validate questions structure to avoid UI blocks
    const isValidQuestion = (q: QuestionOut) => {
      const isMCQ = ["choice", "mcq", "multiple_choice", "true_false"].includes(q.kind);
      // Check for empty options in MCQs and Ordering
      if (isMCQ || q.kind === "sentence_ordering") {
        if (!q.options || (Array.isArray(q.options) && q.options.length === 0)) return false;
      }
      return true;
    };

    const abort = new AbortController();
    try {
      const mode = usePracticeStore.getState().practiceMode;

      if (mode === "millionaire") {
        // --- MILLIONAIRE MODE LOGIC (Stage 1) ---
        // 1. Fetch EVERYTHING (Stage 1 requires building pool from GET /activities)
        const allActs = activities; // already from GET /activities

        // 2. Build Levels (15 levels, increasing difficulty)
        const questionsToLoad: { level: number, activityId: number }[] = [];

        // Simple difficulty bucketing strategy
        const sortedActs = [...allActs].sort((a, b) => a.difficulty - b.difficulty);

        // Split into 3 buckets
        const chunkSize = Math.ceil(sortedActs.length / 3);
        const easy = sortedActs.slice(0, chunkSize);
        const mid = sortedActs.slice(chunkSize, chunkSize * 2);
        const hard = sortedActs.slice(chunkSize * 2);

        const pickRandom = (arr: ActivityOut[]) => arr[Math.floor(Math.random() * arr.length)];

        // Levels 1-15
        for (let i = 1; i <= 15; i++) {
          let pool = easy;
          if (i > 5) pool = mid;
          if (i > 10) pool = hard;
          if (pool.length === 0) pool = sortedActs; // fallback

          const act = pickRandom(pool);
          questionsToLoad.push({ level: i, activityId: act.id });
        }

        // 3. Fetch Questions for these activities
        const uniqueActIds = Array.from(new Set(questionsToLoad.map(x => x.activityId)));

        const activityQuestionsMap = new Map<number, QuestionOut[]>();

        await Promise.all(uniqueActIds.map(async (aid) => {
          const qs = await api.activityQuestions(aid, { signal: abort.signal });
          activityQuestionsMap.set(aid, qs);
        }));

        // 4. Select ONE unique question per level
        const runQuestions: QuestionOut[] = [];
        const usedIds = new Set<number>(); // Local tracking for construction

        // Helper: Filter recent (7 days) - Copied logic from Classic Mode
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const isRecent = (q: QuestionOut) => {
          const lastSeen = history[q.id];
          if (!lastSeen) return false;
          return new Date(lastSeen) >= sevenDaysAgo;
        };

        for (const item of questionsToLoad) {
          const rawPool = activityQuestionsMap.get(item.activityId) || [];
          const pool = rawPool.filter(isValidQuestion);

          // 1. Base Filter: Not used in THIS run (Mandatory)
          const notUsedInRun = pool.filter(q => !usedIds.has(q.id));

          // 2. Preference Filter: Not seen recently (History)
          const candidatesNotRecent = notUsedInRun.filter(q => !isRecent(q));

          // 3. Fallback: Prefer fresh, accept recent if necessary
          const finalPool = candidatesNotRecent.length > 0 ? candidatesNotRecent : notUsedInRun;

          if (finalPool.length > 0) {
            // Random pick
            const q = finalPool[Math.floor(Math.random() * finalPool.length)];
            usedIds.add(q.id);
            runQuestions.push(q);
          }
        }

        // 5. Setup Store
        // Even though "No Ladder UI", we populate the structure for logic consistency
        // as requested "Construye un conjunto de 10-15 niveles".
        const { setLadderLevels } = usePracticeStore.getState();
        const newLevels = runQuestions.map((q, idx) => ({
          levelNumber: idx + 1,
          difficultyBand: "Dynamic",
          question: q,
          status: idx === 0 ? "current" : "locked",
          xpReward: (questionsToLoad[idx]?.level ?? 1) * 100 // Placeholder reward logic
        }));
        // @ts-ignore
        setLadderLevels(newLevels);
        setQuestions(runQuestions);

        if (runQuestions.length > 0) {
          const firstActId = runQuestions[0].activity_id;
          const attempt = await api.attemptStart({ activity_id: firstActId }, { signal: abort.signal });
          setAttempt(attempt.attempt_id);
          // Pre-cache primary attempt
          usePracticeStore.getState().setAttemptForActivity(firstActId, attempt.attempt_id);
        }

      } else {
        // --- CLASSIC MODE LOGIC (RANDOMIZED POOLS) ---

        // DAY2 VARIETY V2 behind flag
        // Default to "0" (Old Logic) if not set or set to anything else
        const useVarietyV2 = process.env.NEXT_PUBLIC_PRACTICE_VARIETY_V2 === "1";

        const sorted = [...activities].sort((a, b) => a.difficulty - b.difficulty);

        // Split into thirds for difficulty bands
        const third = Math.ceil(sorted.length / 3);
        const lowBand = sorted.slice(0, third);
        const midBand = sorted.slice(third, third * 2);
        const highBand = sorted.slice(third * 2);

        if (useVarietyV2) {
          // ==========================================
          // V2 LOGIC: POOL EXPANSION + SOFT FILTER
          // ==========================================

          // Pool Expansion Helper
          // Select up to K distinct random activities from a band
          const pickK = (arr: ActivityOut[], k: number) => {
            if (arr.length <= k) return arr;
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, k);
          };

          const K = 3; // Configurable pool size (Hard Limit)
          const wActs = pickK(lowBand, K);
          const mActs = pickK(midBand, K);
          const bActs = pickK(highBand, K);

          // Fetch questions for ALL selected activities in parallel (Fault Tolerant)
          // Promise.allSettled to avoid full crash if one fails
          // Refactored to return stats for dev metrics
          const fetchBandQuestions = async (acts: ActivityOut[]) => {
            const results = await Promise.allSettled(
              acts.map(act => api.activityQuestions(act.id, { signal: abort.signal }))
            );

            let bandQs: QuestionOut[] = [];
            let fulfilled = 0;
            let rejected = 0;
            let rawCount = 0;

            results.forEach(res => {
              if (res.status === "fulfilled") {
                fulfilled++;
                rawCount += res.value.length;
                bandQs = bandQs.concat(res.value);
              } else {
                rejected++;
                console.warn("Variety fetch failed for an activity", res.reason);
              }
            });
            return { qs: bandQs, fulfilled, rejected, rawCount };
          };

          const [wRes, mRes, bRes] = await Promise.all([
            fetchBandQuestions(wActs),
            fetchBandQuestions(mActs),
            fetchBandQuestions(bActs)
          ]);

          const wQs = wRes.qs;
          const mQs = mRes.qs;
          const bQs = bRes.qs;

          // Deduplicate by ID
          const dedupe = (qs: QuestionOut[]) => {
            const seen = new Set();
            return qs.filter(q => {
              const duplicate = seen.has(q.id);
              seen.add(q.id);
              return !duplicate;
            });
          };

          const safeW = dedupe(wQs.filter(isValidQuestion));
          const safeM = dedupe(mQs.filter(isValidQuestion));
          const safeB = dedupe(bQs.filter(isValidQuestion));

          // ==========================================
          // LRU SORT STRATEGY (V2 Variedad Real)
          // ==========================================
          // WHY: We want to prioritize content based on user history to maximize learning value.
          // 1. NEVER SEEN (Rank ~0): Highest priority. Fresh content is king.
          // 2. OLD SEEN (Rank ~Timestamp): Medium priority. Spaced repetition (older = smaller timestamp = better rank).
          // 3. RECENT SEEN (Rank ~Timestamp): Low priority. Don't repeat what was just done.
          // Sort Direction: ASCENDING (Smaller score is better)

          const SESSION_POOL_SIZE = 20; // Target configurable

          // 1. Global Merger
          const mergedPool = [...safeW, ...safeM, ...safeB];

          // 2. Rank calculation (Mapped for stability)
          const rankedPool = mergedPool.map(q => {
            const lastSeenIso = history[q.id];
            let rank = 0;
            if (!lastSeenIso) {
              // Never seen (Score < 1). Random noise [0.0, 0.99] for shuffle.
              rank = Math.random();
            } else {
              // Seen (Score > 1e12). Timestamp. Old < Recent.
              rank = new Date(lastSeenIso).getTime();
            }
            return { q, rank };
          });

          // 3. Sort (Ascending: 0..1..Timestamp)
          rankedPool.sort((a, b) => a.rank - b.rank);

          // 4. Unwrap & Unique Filter
          const uniqueSorted = (() => {
            const s = new Set();
            const result: QuestionOut[] = [];
            for (const item of rankedPool) {
              if (!s.has(item.q.id)) {
                s.add(item.q.id);
                result.push(item.q);
              }
            }
            return result;
          })();

          // 5. Build Session Pool
          const questSet = uniqueSorted.slice(0, SESSION_POOL_SIZE);

          if (questSet.length === 0) {
            throw new Error("No se pudieron cargar preguntas. Por favor intenta de nuevo.");
          }

          // --- DEV ONLY METRICS (DAY2 VARIETY) ---
          if (process.env.NODE_ENV === "development") {
            try {
              const totalReqs = wActs.length + mActs.length + bActs.length;
              const fulfilledTotal = wRes.fulfilled + mRes.fulfilled + bRes.fulfilled;
              const failedTotal = wRes.rejected + mRes.rejected + bRes.rejected;
              const rawCountTotal = wRes.rawCount + mRes.rawCount + bRes.rawCount;

              const uniqueSources = new Set(questSet.map(q => q.activity_id)).size;

              // Deterministic Repeat Analysis
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              const sevenDaysMs = sevenDaysAgo.getTime();

              let neverSeenCount = 0;
              let oldSeenCount = 0;
              let recentSeenCount = 0;
              let deterministicRepeats = 0;

              questSet.forEach(q => {
                const seenIso = history[q.id];
                if (!seenIso) {
                  neverSeenCount++;
                } else {
                  deterministicRepeats++; // Any history record counts as a "repeat" vs pure fresh
                  const seenTime = new Date(seenIso).getTime();
                  if (seenTime < sevenDaysMs) {
                    oldSeenCount++;
                  } else {
                    recentSeenCount++;
                  }
                }
              });

              console.groupCollapsed("📊 Quest Variety Metrics");
              console.log({
                target: "V2_LRU_SORT",
                session_pool_target: SESSION_POOL_SIZE,
                requests_total: totalReqs,
                requests_succeeded: fulfilledTotal,
                pool_size_raw_merged: mergedPool.length,
                pool_size_final: questSet.length,

                // Variety Breakdown
                neverSeen_count: neverSeenCount,
                oldSeen_count: oldSeenCount,
                recentSeen_count: recentSeenCount,

                // "Repeat" = Anything not effectively new
                repeats_total_in_session: deterministicRepeats,
                unique_activity_sources: uniqueSources
              });

              // LRU Verification Log
              console.log("🏆 Top 5 (High Priority - Should be Never Seen or Oldest):",
                rankedPool.slice(0, 5).map(x => ({ id: x.q.id, rank: x.rank, seen: history[x.q.id] || "NEVER" }))
              );
              console.log("📉 Bottom 5 (Low Priority - Should be Newest):",
                rankedPool.slice(-5).map(x => ({ id: x.q.id, rank: x.rank, seen: history[x.q.id] || "NEVER" }))
              );

              console.groupEnd();
            } catch (e) {
              console.warn("Failed to log metrics", e);
            }
          }

          setQuestions(questSet);

          // Start attempt with first available activity
          const firstQ = questSet[0];
          const attempt = await api.attemptStart({ activity_id: firstQ.activity_id }, { signal: abort.signal });
          setAttempt(attempt.attempt_id);
          usePracticeStore.getState().setAttemptForActivity(firstQ.activity_id, attempt.attempt_id);

        } else {
          // ==========================================
          // V1 LOGIC: SINGLE ACTIVITY + STRICT FILTER
          // ==========================================

          // Pick random from each band
          const warmupAct = lowBand[Math.floor(Math.random() * lowBand.length)] || sorted[0];
          const mainAct = midBand[Math.floor(Math.random() * midBand.length)] || sorted[Math.floor(sorted.length / 2)];
          const bossAct = highBand[Math.floor(Math.random() * highBand.length)] || sorted[sorted.length - 1];

          const [wQs, mQs, bQs] = await Promise.all([
            api.activityQuestions(warmupAct.id, { signal: abort.signal }),
            api.activityQuestions(mainAct.id, { signal: abort.signal }),
            api.activityQuestions(bossAct.id, { signal: abort.signal })
          ]);

          const filterRecentStrict = (qs: QuestionOut[]) => {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return qs.filter((q) => {
              const lastSeen = history[q.id];
              if (!lastSeen) return true;
              return new Date(lastSeen) < sevenDaysAgo;
            });
          };

          const fW = filterRecentStrict(wQs.filter(isValidQuestion));
          const fM = filterRecentStrict(mQs.filter(isValidQuestion));
          const fB = filterRecentStrict(bQs.filter(isValidQuestion));

          const finalW = fW.length > 0 ? fW : wQs.filter(isValidQuestion);
          const finalM = fM.length > 0 ? fM : mQs.filter(isValidQuestion);
          const finalB = fB.length > 0 ? fB : bQs.filter(isValidQuestion);

          const questSet = [
            ...shuffleArray(finalW).slice(0, 2),
            ...shuffleArray(finalM).slice(0, 3),
            ...shuffleArray(finalB).slice(0, 1)
          ];

          setQuestions(questSet);
          const attempt = await api.attemptStart({ activity_id: mainAct.id }, { signal: abort.signal });
          setAttempt(attempt.attempt_id);
          usePracticeStore.getState().setAttemptForActivity(mainAct.id, attempt.attempt_id);
        }
      }

      startTimeRef.current = performance.now();
    } catch (e: any) {
      setStatus(e?.status ?? null);
      setErr(e?.message ?? "Error iniciando quest");
    } finally {
      setLoading(false);
    }
  }, [activities, history, resetRun, setQuestions, setAttempt]);

  const submit = useCallback(async () => {
    if (!currentQ) return;

    // Note: attemptId might be null if we haven't started one for this specific activity yet.
    // relying on dynamic fetch below.

    setLoading(true);
    setErr(null);
    setStatus(null);

    const now = performance.now();
    const timeMs = startTimeRef.current ? Math.max(0, Math.round(now - startTimeRef.current)) : null;

    const abort = new AbortController();
    try {
      const state = usePracticeStore.getState();
      const currentActivityId = currentQ.activity_id;

      // --- FIX: Multi-Activity Attempt Cache Look-up ---
      let effectiveAttemptId = state.attemptCache[currentActivityId];

      if (!effectiveAttemptId) {
        // Just-in-time attempt creation for this activity
        const newAttempt = await api.attemptStart({ activity_id: currentActivityId }, { signal: abort.signal });
        effectiveAttemptId = newAttempt.attempt_id;

        // Save to cache
        state.setAttemptForActivity(currentActivityId, effectiveAttemptId);
        // Also update 'current' attemptId for UI consistency, though less critical now
        setAttempt(effectiveAttemptId);
      }

      // Conditional Normalization:
      // MCQ -> raw answer (strict backend validation)
      // Text -> normalized answer (flexible validation)
      const isMCQ = ["choice", "mcq", "multiple_choice", "true_false"].includes(currentQ.kind);
      const answerToSend = isMCQ ? answer : normalizeAnswer(answer);

      // Helper to execute submit
      const doSubmit = async (aId: number) => {
        return await api.attemptSubmit(
          {
            attempt_id: aId,
            question_id: currentQ.id,
            user_answer: answerToSend || null, // normalized or raw might be empty string
            time_ms: timeMs
          },
          { signal: abort.signal }
        );
      };

      let out: SubmitAnswerOut;
      try {
        out = await doSubmit(effectiveAttemptId);
      } catch (err: any) {
        // --- HARDENING: 404 Retry Logic ---
        if (err?.status === 404) {
          console.warn("Submit 404 detected. Retrying with fresh attempt...");

          // 1. Invalidate Cache
          // We can't easily delete from cache via action, but we can overwrite it.
          // Ideally we'd have a removeAttemptForActivity action, but overwriting works.

          // 2. Create NEW Attempt
          const retryAttempt = await api.attemptStart({ activity_id: currentActivityId }, { signal: abort.signal });
          const newId = retryAttempt.attempt_id;

          // 3. Update Cache
          state.setAttemptForActivity(currentActivityId, newId);
          setAttempt(newId); // update local UI ref

          // 4. Retry Submit ONCE
          out = await doSubmit(newId);
        } else {
          throw err; // Re-throw other errors
        }
      }

      setLastFeedback(out);
      addResult({
        questionId: currentQ.id,
        is_correct: out.is_correct,
        xp_awarded: out.xp_awarded,
        time_ms: timeMs ?? undefined
      });

      // Millionaire behavior: Update Ladder Status
      if (usePracticeStore.getState().practiceMode === "millionaire") {
        const { updateLadderLevel, ladderLevels } = usePracticeStore.getState();

        if (out.is_correct) {
          // Cleared current
          updateLadderLevel(currentIndex, { status: "cleared", xpReward: out.xp_awarded }); // ensure XP matches backend
          // Unlock next if exists
          if (currentIndex + 1 < ladderLevels.length) {
            updateLadderLevel(currentIndex + 1, { status: "current" });
          }
        } else {
          // Failed current
          updateLadderLevel(currentIndex, { status: "failed" });
        }
      }

      // Millionaire behavior (simple): fail ends the run early
      if (usePracticeStore.getState().practiceMode === "millionaire" && !out.is_correct) {
        // mark finished by moving index beyond end
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (usePracticeStore.setState as any)({ currentIndex: questions.length });
      }

      // Update Phase for UI (classic visuals)
      if (currentIndex < 2) setQuestPhase("WARMUP");
      else if (currentIndex < 5) setQuestPhase("MAIN");
      else setQuestPhase("BOSS");

      // Refresh User Stats (Real XP Sync)
      const user = await api.me({ signal: abort.signal });
      useAuthStore.getState().setUser(user);

      startTimeRef.current = performance.now();
    } catch (e: any) {
      setStatus(e?.status ?? null);
      setErr(e?.message ?? "Error enviando respuesta");
    } finally {
      setLoading(false);
    }
  }, [attemptId, currentQ, answer, currentIndex, addResult, questions.length, questions, timeLeft]);

  const useSwap = useCallback(async () => {
    if (lifelines.swap || !currentQ) return;

    useLifeline('swap');
    setLoading(true);

    // Find a spare with same difficulty band approximate or just random from spares
    // Ideally same activity difficulty.
    // For simplicity in Stage 3, we take the first available spare.
    const spares = usePracticeStore.getState().spareQuestions;
    if (spares.length === 0) {
      alert("No hay más preguntas de reserva disponibles.");
      setLoading(false);
      return;
    }

    const newQ = spares[0];
    const remainingSpares = spares.slice(1);

    usePracticeStore.getState().setSpareQuestions(remainingSpares);

    // Replace in questions array
    const newQuestions = [...questions];
    newQuestions[currentIndex] = newQ;

    // Update questions in store
    // usePracticeStore.getState().setQuestions(newQuestions); <--- REMOVED: Resets currentIndex to 0!

    // Manual state update to preserve index and run state
    // @ts-ignore
    usePracticeStore.setState(state => {
      const qs = [...state.questions];
      qs[state.currentIndex] = newQ;

      // Also update ladder
      const lvls = [...state.ladderLevels];
      if (lvls[state.currentIndex]) {
        lvls[state.currentIndex] = { ...lvls[state.currentIndex], question: newQ };
      }

      return { questions: qs, ladderLevels: lvls };
    });

    // Re-start attempt for new activity
    const abort = new AbortController();
    const attempt = await api.attemptStart({ activity_id: newQ.activity_id }, { signal: abort.signal });
    setAttempt(attempt.attempt_id);

    setLoading(false);
  }, [lifelines.swap, currentQ, questions, currentIndex, useLifeline, setAttempt]);

  const useTime = () => {
    if (lifelines.time) return;
    useLifeline('time');
    setTimerPaused(true); // Pause effectively or...
    // Prompt says "Pausa / +Tiempo". 
    // Let's add 30 seconds AND pause for a bit? Or just add 30s.
    // "Si hay timer: pausa o agrega +20–30s".
    setTimeLeft(prev => (prev || 0) + 30);
  };

  const useDouble = () => {
    if (lifelines.double) return;
    useLifeline('double');
    setActiveDoubleXp(true);
  };

  const next = useCallback(() => {
    setLastFeedback(null);
    setAnswer("");
    advance();
  }, [advance]);

  const currentLevel = Math.floor(sessionXp / 100) + 1; // Visual session level

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Misión de Práctica</h1>
          <p className="text-sm text-slate-600 mt-1">
            Completa tu entrenamiento de hoy para mantener tu racha.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {isRunReady && !isFinished && (
            <Button
              variant="ghost"
              className="h-8 px-3 text-red-500 hover:text-red-700 hover:bg-red-50 text-xs uppercase tracking-widest font-bold"
              onClick={() => {
                if (confirm("¿Estás seguro de que quieres abandonar esta misión?")) {
                  resetRun();
                }
              }}
            >
              Abandonar
            </Button>

          )}

          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full border border-amber-200">
            <span className="text-xl">🔥</span>
            <span className="font-bold text-amber-700">{streak} Días</span>
          </div>

          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 transition-colors">
              ← Salir
            </Button>
          </Link>
        </div>
      </div>

      {/* Mode Toggle */}
      {!isRunReady && !isFinished && (
        <div className="flex justify-center mb-4">
          <div className="bg-slate-100 p-1 rounded-xl inline-flex relative shadow-inner">
            <button
              onClick={() => setPracticeMode("classic")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all relative z-10 ${practiceMode === "classic"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
              type="button"
            >
              Classic
            </button>
            <button
              onClick={() => setPracticeMode("millionaire")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all relative z-10 ${practiceMode === "millionaire"
                ? "bg-slate-900 text-amber-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
              type="button"
            >
              Millionaire
            </button>
          </div>
        </div>
      )}

      {err && (
        <Alert
          variant={status === 403 ? "warn" : "error"}
          title={status === 403 ? "No autorizado" : "Atención"}
          description={err}
        />
      )}

      {!isRunReady && !isFinished && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Option 1: Daily Mission (Locked) */}
          <Card
            className={`
               relative overflow-hidden cursor-pointer transition-all duration-300 border-2
               ${isDailyLocked
                ? "opacity-60 grayscale cursor-not-allowed border-slate-200 bg-slate-50"
                : "hover:scale-[1.02] border-violet-500 bg-violet-50 hover:shadow-lg"}
             `}
            onClick={() => !isDailyLocked && !loading && startQuest(true)}
          >
            <div className="p-6 flex flex-col items-center text-center h-full justify-center space-y-3">
              <div className="text-4xl">📅</div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Misión Diaria</h3>
                <p className="text-xs text-slate-600 mt-1">Completa el reto oficial para ganar tu racha.</p>
              </div>
              {isDailyLocked ? (
                <span className="inline-block px-3 py-1 bg-slate-200 text-slate-500 rounded-full text-xs font-bold">
                  ✅ Completada hoy
                </span>
              ) : (
                <span className="inline-block px-3 py-1 bg-violet-200 text-violet-700 rounded-full text-xs font-bold animate-pulse">
                  ✨ Disponible
                </span>
              )}
            </div>
          </Card>

          {/* Option 2: Free Practice (Unlimited) */}
          <Card
            className="relative overflow-hidden cursor-pointer transition-all duration-300 border-2 border-slate-200 bg-white hover:border-amber-400 hover:shadow-lg hover:scale-[1.02]"
            onClick={() => !loading && startQuest(false)}
          >
            <div className="p-6 flex flex-col items-center text-center h-full justify-center space-y-3">
              <div className="text-4xl">♾️</div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Práctica Libre</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Entrena sin límites. No cuenta para la racha diaria.
                </p>
              </div>
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                Siempre disponible
              </span>
            </div>
          </Card>
        </div>
      )}

      {loading && !isRunReady && (
        <div className="text-center py-12">
          <Spinner />
          <p className="text-slate-500 mt-4 animate-pulse">Preparando tu sesión...</p>
        </div>
      )}

      {isRunReady && !isFinished && currentQ && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {practiceMode === "millionaire" ? (
              <Card className="md:col-span-3 border-2 border-amber-200 bg-amber-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Modo Millionaire</p>
                    <p className="text-xs text-amber-900 mt-1">Un error y termina la partida</p>
                  </div>
                  {/* Timer Display */}
                  {timeLeft !== null && (
                    <div className={`text-2xl font-black font-mono px-4 py-2 rounded-xl ${timeLeft < 10 ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-700"}`}>
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </div>
                  )}
                </div>

                {/* Lifelines Bar */}
                {isRunReady && !isFinished && (
                  <div className="flex gap-2 mt-4 border-t border-amber-200/50 pt-3">
                    <Button
                      variant="secondary"
                      onClick={useSwap}
                      disabled={lifelines.swap || loading || !!lastFeedback}
                      className={`flex-1 border-amber-300 hover:bg-amber-100 ${lifelines.swap ? "opacity-50 grayscale" : ""}`}
                    >
                      🔄 Cambio {lifelines.swap && "❌"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={useTime}
                      disabled={lifelines.time || loading || !!lastFeedback}
                      className={`flex-1 border-blue-300 hover:bg-blue-100 text-blue-700 ${lifelines.time ? "opacity-50 grayscale" : ""}`}
                    >
                      ⏳ +30s {lifelines.time && "❌"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={useDouble}
                      disabled={lifelines.double || loading || !!lastFeedback}
                      className={`flex-1 border-purple-300 hover:bg-purple-100 text-purple-700 ${lifelines.double ? "opacity-50 grayscale" : ""}`}
                    >
                      ✨ x2 XP {lifelines.double && "❌"}
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <>
                <Card
                  className={`border-2 transition-all ${questPhase === "WARMUP"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-100 opacity-50"
                    }`}
                >
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    Fase 1: Warm-up
                  </p>
                  <p className="text-xs text-emerald-800 mt-1">Calentamiento cognitivo</p>
                </Card>

                <Card
                  className={`border-2 transition-all ${questPhase === "MAIN"
                    ? "border-violet-500 bg-violet-50"
                    : "border-slate-100 opacity-50"
                    }`}
                >
                  <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">
                    Fase 2: Main Quest
                  </p>
                  <p className="text-xs text-violet-800 mt-1">Núcleo del aprendizaje</p>
                </Card>

                <Card
                  className={`border-2 transition-all ${questPhase === "BOSS"
                    ? "border-rose-500 bg-rose-50"
                    : "border-slate-100 opacity-50"
                    }`}
                >
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                    Fase 3: Boss
                  </p>
                  <p className="text-xs text-rose-800 mt-1">Máxima producción</p>
                </Card>
              </>
            )}
          </div>

          <div className={`grid gap-6 ${practiceMode === "millionaire" ? "lg:grid-cols-4" : ""}`}>
            {/* Question Area */}
            <div className={practiceMode === "millionaire" ? "lg:col-span-3" : ""}>
              <Card className={`relative overflow-hidden h-full transition-colors duration-500 ${practiceMode === "millionaire"
                ? "border-amber-900/10 bg-slate-900 text-white"
                : "border-slate-200 bg-white"
                }`}>
                {/* Progress Bar (Classic Only) */}
                {practiceMode !== "millionaire" && (
                  <div
                    className={`absolute top-0 left-0 h-1.5 transition-all duration-1000 ${questPhase === "WARMUP"
                      ? "bg-emerald-500"
                      : questPhase === "MAIN"
                        ? "bg-violet-500"
                        : "bg-rose-500"
                      }`}
                    style={{ width: `${progressValue}%` }}
                  />
                )}

                <div className="p-2 sm:p-6 mt-4">
                  <div className="flex items-start justify-between gap-4 mb-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {practiceMode === "millionaire" ? (
                          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest">
                            Nivel {currentIndex + 1} de {questions.length}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Pregunta {progressText}
                          </span>
                        )}

                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${practiceMode === "millionaire"
                            ? "bg-slate-800 text-slate-400"
                            : (["choice", "mcq", "multiple_choice", "true_false"].includes(currentQ.kind) ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600")
                            }`}
                        >
                          {["choice", "mcq", "multiple_choice", "true_false"].includes(currentQ.kind) ? "Opción Múltiple" : "Entrada de Texto"}
                        </span>

                        {practiceMode === "classic" && (
                          <span className="px-2 py-1 rounded-md bg-amber-100 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                            Nivel {currentLevel}
                          </span>
                        )}
                      </div>

                      {/* Pedagogical Prompt Rendering */}
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${practiceMode === "millionaire" ? "text-amber-400" : "text-slate-400"}`}>
                          {normalizePrompt(currentQ.prompt).instruction}
                        </p>
                        <h2 className={`text-3xl font-black leading-tight ${practiceMode === "millionaire" ? "text-white" : "text-slate-900"}`}>
                          {normalizePrompt(currentQ.prompt).content}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {activeDoubleXp && (
                      <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-center font-bold animate-pulse border border-purple-200">
                        ✨ DOBLE XP ACTIVO ✨
                      </div>
                    )}

                    {loading && <Spinner />}
                    {["choice", "mcq", "multiple_choice", "true_false"].includes(currentQ.kind) ? (
                      <ChoiceQuestion
                        key={currentQ.id}
                        options={currentQ.options}
                        userAnswer={answer}
                        onChange={setAnswer}
                        disabled={loading || lastFeedback !== null}
                        onConfirm={submit}
                        prompt={currentQ.prompt}
                        uiState={uiState}
                        correctOption={lastFeedback?.correct_answer ?? null}
                      />
                    ) : (
                      <InputQuestion
                        key={currentQ.id}
                        userAnswer={answer}
                        onChange={setAnswer}
                        disabled={loading || lastFeedback !== null}
                        onConfirm={submit}
                        prompt={currentQ.prompt}
                      />
                    )}

                    {lastFeedback === null ? (
                      <div className="flex gap-3 pt-4">
                        <Button
                          className={`flex-1 py-6 text-lg font-bold disabled:opacity-30 ${practiceMode === "millionaire"
                            ? "bg-amber-600 hover:bg-amber-700 text-white border-b-4 border-amber-800 active:border-b-0 active:translate-y-1"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                            }`}
                          onClick={submit}
                          disabled={loading || !answer.trim()}
                        >
                          {loading ? <Spinner /> : (practiceMode === "millionaire" ? "¿Te parece bien esta opción?" : "Comprobar y aprender")}
                        </Button>
                      </div>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                        <div
                          className={[
                            "rounded-3xl p-6 flex items-center gap-4 border-2 transition-all",
                            lastFeedback.is_correct
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-red-50 border-red-200 text-red-700"
                          ].join(" ")}
                        >
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                            {lastFeedback.is_correct ? "✅" : "❌"}
                          </div>
                          <div>
                            <h4 className="text-xl font-black uppercase tracking-tight">
                              {lastFeedback.is_correct ? "¡Muy bien! Así se usa 👏" : "Casi 😊 veamos por qué"}
                            </h4>
                            <p className="text-sm font-medium opacity-80">
                              {lastFeedback.is_correct
                                ? `Has ganado +${lastFeedback.xp_awarded} XP`
                                : "Aquí está la clave 👇"}
                            </p>
                          </div>
                        </div>

                        {!lastFeedback.is_correct && lastFeedback.correct_answer && (
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                            <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              La forma correcta es
                            </span>
                            <p className="text-xl font-bold text-emerald-900">
                              {lastFeedback.correct_answer}
                            </p>
                          </div>
                        )}

                        {currentQ.explanation && (
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700 leading-relaxed shadow-sm">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-violet-400" />
                              💡 Tip rápido
                            </span>
                            {currentQ.explanation}
                          </div>
                        )}

                        <Button
                          className="w-full py-6 text-xl font-black uppercase tracking-widest bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg"
                          onClick={next}
                          disabled={loading}
                        >
                          Seguimos →
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Ladder Area (Millionaire Only) - VISIBLE for Stage 2 */}
            {practiceMode === "millionaire" && (
              <div className="hidden lg:block lg:col-span-1">
                <LadderProgress levels={ladderLevels} currentLevelIndex={currentIndex} />
              </div>
            )}
          </div>
        </>
      )}

      {isFinished && (
        <Card className="text-center p-12 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
          <div className="relative">
            <div className="text-6xl mb-6">🏆</div>
            <h3 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
              Misión Completada
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Has completado el entrenamiento diario. Tu racha de <b>{streak} días</b> sigue intacta.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  XP Total
                </p>
                <p className="text-3xl font-black text-emerald-600">+{sessionXp}</p>
                {sessionBonusXp > 0 && (
                  <div className="text-[10px] mt-1 pt-1 border-t border-slate-100 flex justify-between text-slate-400">
                    <span>Real: +{sessionXp - sessionBonusXp}</span>
                    <span className="text-purple-500 font-bold">Bonus: +{sessionBonusXp}</span>
                  </div>
                )}
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Precisión
                </p>
                <p className="text-3xl font-black text-cyan-600">
                  {results.length > 0 ? Math.round((sessionCorrect / results.length) * 100) : 0}%
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={resetRun}
                className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 text-lg font-bold shadow-xl"
              >
                🔄 Nueva Misión
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full py-6 bg-slate-900 hover:bg-slate-800 text-lg font-bold shadow-xl">
                  Regresar al Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
