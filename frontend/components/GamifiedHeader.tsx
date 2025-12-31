"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "./Button";
import { XPBar } from "./XPBar";

export default function GamifiedHeader() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const xp = useMemo(() => user?.total_xp ?? 0, [user]);
  const level = useMemo(() => Math.floor(xp / 100) + 1, [xp]);
  const xpInLevel = useMemo(() => xp % 100, [xp]);
  const nextLevelThreshold = 100;

  return (
    <header className="sticky top-0 z-20 border-b border-black/30 bg-gradient-to-r from-black via-slate-900 to-black backdrop-blur-2xl relative overflow-hidden">
      {/* Overlay 3D para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_50%_0%,rgba(168,85,247,.15),transparent_70%)] pointer-events-none"></div>

      <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold tracking-tight text-transparent bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text drop-shadow-lg hover:drop-shadow-2xl hover:scale-105 transition-all duration-300 transform-gpu">
            B2 English
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <Link className="relative rounded-xl px-3 py-2 text-sm font-medium text-zinc-300/90 hover:text-white transition-all duration-300 ease-out transform-gpu hover:scale-102 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-violet-600/20 before:to-cyan-600/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" href="/dashboard">
              Dashboard
            </Link>
            <Link className="relative rounded-xl px-3 py-2 text-sm font-medium text-zinc-300/90 hover:text-white transition-all duration-300 ease-out transform-gpu hover:scale-102 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-violet-600/20 before:to-cyan-600/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" href="/practice">
              Practice
            </Link>
            <Link className="relative rounded-xl px-3 py-2 text-sm font-medium text-zinc-300/90 hover:text-white transition-all duration-300 ease-out transform-gpu hover:scale-102 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-violet-600/20 before:to-cyan-600/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" href="/verbs">
              Verbs
            </Link>
            <Link className="relative rounded-xl px-3 py-2 text-sm font-medium text-zinc-300/90 hover:text-white transition-all duration-300 ease-out transform-gpu hover:scale-102 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-violet-600/20 before:to-cyan-600/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" href="/tenses">
              Tenses
            </Link>
            <Link className="relative rounded-xl px-3 py-2 text-sm font-medium text-zinc-300/90 hover:text-white transition-all duration-300 ease-out transform-gpu hover:scale-102 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-violet-600/20 before:to-cyan-600/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" href="/progress">
              Progress
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {hydrated && token && user ? (
            <div className="hidden md:flex items-center gap-3 bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-full px-4 py-1.5 shadow-lg">
              {/* Level Badge (Primary) */}
              <div className="flex items-center gap-2 border-r border-white/10 pr-3 mr-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-sm font-bold text-white tracking-wide">
                  LVL <span className="text-lg">{level}</span>
                </span>
              </div>

              {/* XP & Progress (Secondary) */}
              <div className="flex flex-col w-32 gap-1 justify-center">
                <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-none">
                  <span>XP</span>
                  <span className="text-slate-300">{xpInLevel}/{nextLevelThreshold} XP</span>
                </div>
                <XPBar value={xpInLevel} className="h-1.5 bg-slate-800 rounded-full overflow-hidden" />
              </div>
            </div>
          ) : (
            <span className="text-xs text-zinc-400 drop-shadow-sm">offline</span>
          )}


          {hydrated && token ? (
            <Button variant="secondary" onClick={logout} className="hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform-gpu">
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button className="hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform-gpu">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
