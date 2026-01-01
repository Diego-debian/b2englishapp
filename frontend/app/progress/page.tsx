"use client";

import React from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/authStore";

export default function ProgressPage() {
  return (
    <Protected>
      <ProgressInner />
    </Protected>
  );
}

function ProgressInner() {
  const user = useAuthStore((s) => s.user);

  // Calculate level from total XP (same formula as GamifiedHeader)
  const totalXp = user?.total_xp ?? 0;
  const level = Math.floor(totalXp / 100) + 1;
  const xpInLevel = totalXp % 100;
  const nextLevelXp = 100;

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tu Progreso</h1>
          <p className="text-sm text-slate-600 mt-1">
            Observa tu evolución en el aprendizaje natural de verbos
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-slate-400 hover:text-white transition-colors">
            ← Dashboard
          </Button>
        </Link>
      </div>

      {/* 4-Block Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Block A: Summary */}
        <Card className="border-violet-500/10 bg-gradient-to-br from-violet-500/5 to-cyan-500/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">📊 Resumen</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700 font-medium">
                {user?.username || "Estudiante"}
              </span>
            </div>

            <div className="grid gap-4">
              {/* Total XP */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-slate-200">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Experiencia Total
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{totalXp}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl">
                  ✨
                </div>
              </div>

              {/* Level */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-slate-200">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Nivel Actual
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{level}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {xpInLevel}/{nextLevelXp} XP al siguiente
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl">
                  🎯
                </div>
              </div>

              {/* Streak - Placeholder */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-slate-200">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Racha Actual
                  </p>
                  <p className="text-3xl font-bold text-slate-400 mt-1">—</p>
                  <p className="text-xs text-slate-500 italic mt-1">Disponible pronto</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xl">
                  🔥
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Block B: Recent Activity - Placeholder */}
        <Card className="border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">📅 Actividad Reciente</h3>
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl mb-4">
                📈
              </div>
              <p className="text-slate-600 font-medium mb-2">
                Sin datos suficientes todavía
              </p>
              <p className="text-sm text-slate-500 mb-4 max-w-xs">
                Completa algunas sesiones de práctica para ver tu actividad aquí
              </p>
              <Link href="/practice">
                <Button className="bg-cyan-600 hover:bg-cyan-500">
                  Empieza a Practicar
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Block C: Accuracy - Placeholder */}
        <Card className="border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">🎯 Precisión</h3>
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl mb-4">
                📊
              </div>
              <p className="text-slate-600 font-medium mb-2">
                Aún no calculado
              </p>
              <p className="text-sm text-slate-500 max-w-xs">
                Tus estadísticas de respuestas correctas e incorrectas aparecerán aquí después de tus primeras sesiones
              </p>
            </div>
          </div>
        </Card>

        {/* Block D: CTAs */}
        <Card className="border-indigo-500/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">🚀 Practica Ahora</h3>
            </div>

            <div className="space-y-3">
              <Link href="/practice" className="block">
                <div className="group p-4 rounded-lg border-2 border-violet-200 bg-white hover:border-violet-400 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                      📝
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                        Practice Classic
                      </p>
                      <p className="text-xs text-slate-500">
                        Modo tradicional de preguntas y respuestas
                      </p>
                    </div>
                    <div className="text-slate-400 group-hover:text-violet-600 transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/practice" className="block">
                <div className="group p-4 rounded-lg border-2 border-amber-200 bg-white hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                      💎
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                        Try Millionaire
                      </p>
                      <p className="text-xs text-slate-500">
                        Desafío con salvavidas y premios progresivos
                      </p>
                    </div>
                    <div className="text-slate-400 group-hover:text-amber-600 transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </Link>

              <div className="pt-2 px-2">
                <p className="text-xs text-slate-500 italic text-center">
                  💡 Cada sesión suma XP y contribuye a tu progreso global
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Footer */}
      <Card className="border-slate-200 bg-slate-50">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
            ℹ️
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 mb-1">
              Sobre tu progreso
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tu aprendizaje sigue un modelo <strong>natural y progresivo</strong>.
              Cada pregunta correcta suma XP, lo que te hace avanzar de nivel automáticamente.
              No hay exámenes ni evaluaciones formales: tu práctica constante es el mejor indicador
              de tu evolución. Las estadísticas detalladas se activarán conforme acumules más sesiones.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
