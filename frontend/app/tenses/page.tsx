"use client";

import React from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { OnboardingBanner } from "@/components/OnboardingBanner";

export default function GrammarReferencePage() {
  return (
    <Protected>
      <GrammarReferenceInner />
    </Protected>
  );
}

function GrammarReferenceInner() {
  const presentTenses = [
    { name: "Present Simple", slug: "present-simple" },
    { name: "Present Continuous", slug: "present-continuous" },
    { name: "Present Perfect", slug: "present-perfect" },
    { name: "Present Perfect Continuous", slug: "present-perfect-continuous" },
  ];

  const pastTenses = [
    { name: "Past Simple", slug: "past-simple" },
    { name: "Past Continuous", slug: "past-continuous" },
    { name: "Past Perfect", slug: "past-perfect" },
    { name: "Past Perfect Continuous", slug: "past-perfect-continuous" },
  ];

  const futureTenses = [
    { name: "Will", slug: "will" },
    { name: "Going to", slug: "going-to" },
    { name: "Future Continuous", slug: "future-continuous" },
    { name: "Future Perfect", slug: "future-perfect" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Grammar Reference
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Quick reference for English verb tenses.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/tenses/legacy">
            <Button variant="ghost" className="text-slate-400 hover:text-slate-600 text-xs">
              Legacy View
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-400 hover:text-slate-600 gap-2">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Onboarding Banner */}
      <OnboardingBanner />

      {/* Focus Practice CTA */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-xl">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Focus Practice
            </h3>
            <p className="text-base text-slate-300 max-w-2xl mx-auto md:mx-0">
              Practice one tense at a time with a short 5-question session.
            </p>
          </div>
          <Link href="/practice/focus">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95">
              Start Focus →
            </Button>
          </Link>
        </div>
      </div>

      {/* Three Main Blocks */}
      <div id="tense-list" className="grid md:grid-cols-3 gap-8 pt-4">
        {/* Present Time */}
        <Card className="bg-gradient-to-br from-violet-50 to-white border-violet-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">🟣</span>
              <h2 className="text-2xl font-black text-slate-900">
                Present Time
              </h2>
              <p className="text-sm text-slate-600">
                Actions happening now or regularly.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-violet-200">
              {presentTenses.map((tense) => (
                <div
                  key={tense.slug}
                  className="flex items-center gap-2"
                >
                  <Link
                    href={`/tenses/${tense.slug}`}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 transition font-medium text-slate-700 text-sm"
                  >
                    {tense.name} →
                  </Link>
                  <Link
                    href={`/practice/focus?tense=${tense.slug}`}
                    className="px-3 py-3 rounded-lg border border-violet-200 bg-violet-50 hover:bg-violet-100 hover:border-violet-400 transition text-violet-700 text-xs font-semibold whitespace-nowrap"
                    title="Focus practice"
                  >
                    Focus
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Past Time */}
        <Card className="bg-gradient-to-br from-cyan-50 to-white border-cyan-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">🔵</span>
              <h2 className="text-2xl font-black text-slate-900">
                Past Time
              </h2>
              <p className="text-sm text-slate-600">
                Actions that already happened.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-cyan-200">
              {pastTenses.map((tense) => (
                <div
                  key={tense.slug}
                  className="flex items-center gap-2"
                >
                  <Link
                    href={`/tenses/${tense.slug}`}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-cyan-50 hover:border-cyan-300 transition font-medium text-slate-700 text-sm"
                  >
                    {tense.name} →
                  </Link>
                  <Link
                    href={`/practice/focus?tense=${tense.slug}`}
                    className="px-3 py-3 rounded-lg border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 hover:border-cyan-400 transition text-cyan-700 text-xs font-semibold whitespace-nowrap"
                    title="Focus practice"
                  >
                    Focus
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Future Time */}
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-2xl">🟢</span>
              <h2 className="text-2xl font-black text-slate-900">
                Future Time
              </h2>
              <p className="text-sm text-slate-600">
                Actions that will happen later.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-emerald-200">
              {futureTenses.map((tense) => (
                <div
                  key={tense.slug}
                  className="flex items-center gap-2"
                >
                  <Link
                    href={`/tenses/${tense.slug}`}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition font-medium text-slate-700 text-sm"
                  >
                    {tense.name} →
                  </Link>
                  <Link
                    href={`/practice/focus?tense=${tense.slug}`}
                    className="px-3 py-3 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400 transition text-emerald-700 text-xs font-semibold whitespace-nowrap"
                    title="Focus practice"
                  >
                    Focus
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
