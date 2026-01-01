"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";
import type { ExampleOut, TenseOut } from "@/lib/types";

export default function TensesPage() {
  return (
    <Protected>
      <TensesInner />
    </Protected>
  );
}

function TensesInner() {
  const [tenses, setTenses] = useState<TenseOut[]>([]);
  const [selected, setSelected] = useState<TenseOut | null>(null);
  const [examples, setExamples] = useState<ExampleOut[]>([]);

  const [loadingTenses, setLoadingTenses] = useState(false);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const loadTenses = useCallback(async () => {
    setLoadingTenses(true);
    setErr(null);

    const abort = new AbortController();
    try {
      const data = await api.tensesList({ signal: abort.signal });
      setTenses(data);
      setSelected(data[0] ?? null);
    } catch (e: any) {
      setErr(e?.message ?? "Error cargando tenses");
    } finally {
      setLoadingTenses(false);
    }
    return () => abort.abort();
  }, []);

  const loadExamples = useCallback(async (tenseId: number) => {
    setLoadingExamples(true);
    setErr(null);

    const abort = new AbortController();
    try {
      const data = await api.tenseExamples(tenseId, { signal: abort.signal });
      setExamples(data);
    } catch (e: any) {
      setErr(e?.message ?? "Error cargando examples");
    } finally {
      setLoadingExamples(false);
    }
    return () => abort.abort();
  }, []);

  useEffect(() => {
    void loadTenses();
  }, [loadTenses]);

  useEffect(() => {
    if (selected?.id) void loadExamples(selected.id);
  }, [selected, loadExamples]);

  const title = useMemo(() => selected ? `${selected.name} (${selected.code})` : "Selecciona un tense", [selected]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 grid gap-10">
      {/* Header global */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Academia de Tiempos
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Comprende la estructura del inglés paso a paso.
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-slate-400 hover:text-slate-600 gap-2">
            ← Volver al Panel
          </Button>
        </Link>
      </div>

      {err && <Alert variant="error" title="Error" description={err} />}

      {/* Layout principal */}
      <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
        {/* Sidebar */}
        <Card className="md:col-span-4 lg:col-span-3 bg-white/60 border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Seleccionar</h3>
            {loadingTenses && <Spinner />}
          </div>

          <div className="space-y-2">
            {tenses.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={[
                  "w-full rounded-2xl border px-4 py-3 text-left transition overflow-hidden",
                  selected?.id === t.id
                    ? "border-violet-200 bg-violet-50"
                    : "border-slate-100 hover:bg-slate-50"
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="font-bold text-sm text-slate-700 truncate min-w-0">
                    {t.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0 whitespace-nowrap lg:hidden">
                    {t.code}
                  </span>
                </div>
                {t.description && (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 overflow-hidden break-words">
                    {t.description}
                  </p>
                )}
              </button>
            ))}

            {!loadingTenses && tenses.length === 0 && (
              <div className="border border-dashed rounded-xl p-6 text-center text-xs text-slate-500">
                No hay tiempos disponibles.
              </div>
            )}

            <Button
              variant="secondary"
              className="w-full text-xs mt-3"
              onClick={loadTenses}
              disabled={loadingTenses}
            >
              🔄 Recargar
            </Button>
          </div>
        </Card>

        {/* Contenido principal */}
        <div className="md:col-span-8 lg:col-span-9 space-y-12">
          {selected ? (
            <>
              {/* Header del tense */}
              <section className="space-y-4">
                <span className="inline-flex px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase">
                  {selected.code}
                </span>

                <h2 className="text-4xl font-black text-slate-900">
                  {selected.name}
                </h2>

                {selected.description && (
                  <Card className="bg-violet-50/60 border-violet-200">
                    <div className="flex gap-4">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="text-xs font-bold uppercase text-violet-600 mb-1">
                          Guía de uso
                        </p>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {selected.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </section>

              {/* Ejemplos */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="h-8 w-1.5 bg-cyan-500 rounded-full" />
                    Ejemplos Prácticos
                  </h3>
                  {loadingExamples && <Spinner />}
                </div>

                <div className="grid gap-6">
                  {examples.map((ex) => (
                    <Card
                      key={ex.id}
                      className="border-slate-200 hover:bg-cyan-50 transition"
                    >
                      <p className="text-xl font-black text-slate-900">
                        {ex.sentence}
                      </p>

                      {ex.translation && (
                        <p className="mt-3 pt-3 border-t text-sm italic text-slate-500">
                          {ex.translation}
                        </p>
                      )}

                      {ex.note && (
                        <p className="mt-3 text-xs bg-slate-50 border rounded-xl px-3 py-2">
                          <strong>Contexto:</strong> {ex.note}
                        </p>
                      )}
                    </Card>
                  ))}

                  {!loadingExamples && examples.length === 0 && (
                    <div className="border border-dashed rounded-2xl p-10 text-center text-slate-500 italic">
                      Próximamente añadiremos ejemplos para este tiempo verbal.
                    </div>
                  )}
                </div>
              </section>

              {/* CTA */}
              <section className="pt-10">
                <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-none">
                  <div className="flex flex-wrap items-center justify-between gap-8">
                    <div>
                      <p className="text-white font-black text-xl">
                        ¿Listo para ponerlo a prueba?
                      </p>
                      <p className="text-slate-400 text-sm">
                        Domina el {selected.name} con ejercicios interactivos.
                      </p>
                    </div>
                    <Link href="/practice">
                      <Button className="bg-violet-600 px-10 py-6 text-lg font-black hover:scale-105 transition">
                        🚀 Empezar Práctica
                      </Button>
                    </Link>
                  </div>
                </Card>
              </section>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 border border-dashed rounded-3xl">
              <span className="text-4xl mb-4">📖</span>
              <h3 className="text-xl font-bold">Selecciona un tiempo verbal</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Elige uno de la lista para ver su explicación y ejemplos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
