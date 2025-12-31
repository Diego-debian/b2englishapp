"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Protected } from "@/components/Protected";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";
import type { VerbOut } from "@/lib/types";

export default function VerbDetailPage() {
  return (
    <Protected>
      <VerbDetailInner />
    </Protected>
  );
}

function VerbDetailInner() {
  const params = useParams<{ id: string }>();
  // Handle potential string | string[] type from params
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id = Number(rawId);

  const [verb, setVerb] = useState<VerbOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) return;

    setLoading(true);
    setErr(null);
    const abort = new AbortController();
    try {
      const data = await api.verbGet(id, { signal: abort.signal });
      setVerb(data);
    } catch (e: any) {
      setErr(e?.message ?? "Error cargando verb");
    } finally {
      setLoading(false);
    }
    return () => abort.abort();
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!Number.isFinite(id)) {
    return (
      <Alert variant="error" title="Invalid ID" description="The requested verb ID is invalid." />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <Link
          href="/verbs"
          className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <span>← Back to Dictionary</span>
        </Link>
        <div className="text-xs font-mono text-zinc-600">ID: {id}</div>
      </div>

      {err && <Alert variant="error" title="Error" description={err} />}

      {/* Main Learning Card */}
      <Card className="border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden p-0">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : !verb ? (
          <div className="p-12 text-center text-zinc-400">
            Verb not found.
          </div>
        ) : (
          <div>
            {/* 1. Header: The Concept */}
            <div className="bg-zinc-950 p-8 border-b border-zinc-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex gap-3 items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Infinitive Form</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-zinc-800 text-zinc-400 rounded">Irregular</span>
                  </div>
                  <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
                    to {verb.infinitive}
                  </h1>
                  <p className="text-xl text-zinc-400 font-serif italic">
                    {verb.translation}
                  </p>
                </div>

                <div className="hidden md:block text-right max-w-xs">
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Use the <strong className="text-zinc-300">Infinitive</strong> for basic actions, after adjectives, or with 'to' (e.g., "I want to {verb.infinitive}").
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Usage Grid: The Rules */}
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800 bg-zinc-900">
              {/* Past Simple */}
              <div className="p-8 space-y-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Past Simple</h3>
                  <span className="text-xs text-zinc-500 font-mono">V2</span>
                </div>

                <div className="py-2">
                  <p className="text-3xl font-bold text-white">{verb.past}</p>
                </div>

                <div className="text-sm text-zinc-400 space-y-2 border-l-2 border-emerald-500/30 pl-3">
                  <p>
                    <strong className="text-emerald-400">When to use:</strong><br />
                    For completed actions at a specific time in the past.
                  </p>
                  <p className="text-xs italic text-zinc-500">
                    ex: "Yesterday, I <span className="text-zinc-300 underline decoration-emerald-500/50">{verb.past}</span>..."
                  </p>
                </div>
              </div>

              {/* Participle */}
              <div className="p-8 space-y-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-purple-500 uppercase tracking-widest">Past Participle</h3>
                  <span className="text-xs text-zinc-500 font-mono">V3</span>
                </div>

                <div className="py-2">
                  <p className="text-3xl font-bold text-white">{verb.participle}</p>
                </div>

                <div className="text-sm text-zinc-400 space-y-2 border-l-2 border-purple-500/30 pl-3">
                  <p>
                    <strong className="text-purple-400">When to use:</strong><br />
                    For Perfect tenses (have/has) or Passive voice.
                  </p>
                  <p className="text-xs italic text-zinc-500">
                    ex: "She has <span className="text-zinc-300 underline decoration-purple-500/50">{verb.participle}</span>..."
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Context: The Application */}
            <div className="bg-zinc-950 p-8 border-t border-zinc-800">
              <div className="max-w-3xl">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  Contextual Example (B2 Level)
                </h3>
                <div className="flex gap-4">
                  <div className="hidden md:block w-1 rounded-full bg-indigo-500/50"></div>
                  <blockquote className="text-xl md:text-2xl text-zinc-200 leading-relaxed">
                    "{verb.example_b2}"
                  </blockquote>
                </div>
              </div>
            </div>

            {/* 4. Action */}
            <div className="bg-zinc-900 p-6 flex justify-end border-t border-zinc-800">
              <Link href="/practice">
                <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-8 py-6 rounded-none text-base">
                  Test knowledge of this verb →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Pedagogical Note */}
      <div className="text-center text-xs text-zinc-600 max-w-lg mx-auto">
        <p>
          Usage tip: Irregular verbs often change exclusively in their core vowel sound.
          Notice the pattern between {verb ? `${verb.infinitive} → ${verb.past} → ${verb.participle}` : 'the forms'}.
        </p>
      </div>
    </div>
  );
}
