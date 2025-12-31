"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { Alert } from "@/components/Alert";
import { JsonView } from "@/components/JsonView";
import { XPBar } from "@/components/XPBar";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { usePracticeStore } from "@/store/practiceStore";
import type { UserOut } from "@/lib/types";


export default function DashboardPage() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}

function DashboardInner() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const { streak } = usePracticeStore();

  const [me, setMe] = useState<UserOut | null>(user);
  const [stats, setStats] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [lastStatus, setLastStatus] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    setLastStatus(null);

    const abort = new AbortController();
    try {
      const freshMe = await api.me({ signal: abort.signal });
      setMe(freshMe);
      useAuthStore.getState().setUser(freshMe);

      const st = await api.userStats(freshMe.id, { signal: abort.signal });
      setStats(st);
    } catch (e: any) {
      const status = (e as ApiError)?.status ?? null;
      setLastStatus(status);
      setErr(e?.message ?? "Error cargando dashboard");
    } finally {
      setLoading(false);
    }

    return () => abort.abort();
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const xp = me?.total_xp ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tu Progreso</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-sm font-medium text-slate-600">Estado: Activo • Racha de {streak} días</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={load} disabled={loading} className="px-5 border-slate-200">
            {loading ? "Sincronizando..." : "🔄 Sincronizar stats"}
          </Button>
          <Link href="/practice">
            <Button className="px-8 bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10">
              ⚡ Entrenar ahora
            </Button>
          </Link>
        </div>
      </div>

      {err && (
        <Alert
          variant={lastStatus === 403 ? "warn" : "error"}
          title={lastStatus === 403 ? "No autorizado" : "Error de Conexión"}
          description={err}
        />
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {/* Perfil & Nivel */}
        <Card className="relative overflow-hidden bg-white border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-violet-500/20 rotate-3">
                  {me?.username?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  {level}
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  {me?.username ?? "Estudiante"}
                </p>
                <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mt-0.5">
                  B2 Intermediate
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Nivel {level}</span>
              <span>{xpInLevel}/100 XP</span>
            </div>
            <XPBar value={xpInLevel} className="h-2 bg-slate-100" />
            <p className="text-[10px] text-slate-400 font-medium">
              Faltan {100 - xpInLevel} XP para subir al nivel {level + 1}
            </p>
          </div>
        </Card>

        {/* Gamificación Persistente */}
        <Card className="bg-slate-950 border-slate-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-6xl">🔥</span>
          </div>
          <div className="relative">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Racha Actual</p>
            <div className="flex items-center gap-4">
              <span className="text-6xl font-black text-white">{streak}</span>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-tight">Días seguidos</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1">¡Mantén el fuego! 💪</p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Total XP Ganada</span>
              <span className="text-amber-400">✨ {xp}</span>
            </div>
          </div>
        </Card>

        {/* Estadísticas de Aprendizaje */}
        <Card className="bg-white border-slate-200">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Aprendizaje Acumulado</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-900">{stats?.verbs_learned ?? 0}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Verbos</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-900">{stats?.mastery_percentage ?? 0}%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Dominio</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-900">{stats?.due_verbs ?? 0}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Repasos</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-slate-900">{stats?.total_mistakes ?? 0}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Efectividad</p>
            </div>
          </div>
        </Card>
      </div>


      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/verbs">
          <Card className="group hover:border-violet-500/30 hover:bg-violet-50 transition-all border-slate-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
                📚
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">Diccionario</h3>
                <p className="text-xs font-medium text-slate-500">Explora verbos irregulares</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/tenses">
          <Card className="group hover:border-cyan-500/30 hover:bg-cyan-50 transition-all border-slate-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                ⌛
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">Tiempos</h3>
                <p className="text-xs font-medium text-slate-500">Gramática y ejemplos</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/progress">
          <Card className="group hover:border-emerald-500/30 hover:bg-emerald-50 transition-all border-slate-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                📈
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Mi Progreso</h3>
                <p className="text-xs font-medium text-slate-500">Estadísticas detalladas</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
