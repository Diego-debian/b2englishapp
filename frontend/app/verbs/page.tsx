"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { Alert } from "@/components/Alert";
import { api } from "@/lib/api";
import type { VerbOut } from "@/lib/types";

export default function VerbsPage() {
  return (
    <Protected>
      <VerbsInner />
    </Protected>
  );
}

function VerbsInner() {
  const [verbs, setVerbs] = useState<VerbOut[]>([]);
  const [q, setQ] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [mode, setMode] = useState<"list" | "search">("list");

  const loadList = useCallback(async () => {
    setIsLoading(true);
    setErr(null);
    setMode("list");

    const abort = new AbortController();
    try {
      const data = await api.verbsList({ skip: 0, limit: 50 }, { signal: abort.signal });
      setVerbs(data);
    } catch (e: any) {
      setErr(e?.message ?? "Error cargando verbs");
    } finally {
      setIsLoading(false);
    }
    return () => abort.abort();
  }, []);

  const doSearch = useCallback(async () => {
    const term = q.trim();
    if (!term) {
      void loadList();
      return;
    }

    setIsLoading(true);
    setErr(null);
    setMode("search");

    const abort = new AbortController();
    try {
      const data = await api.verbsSearch({ q: term, limit: 20 }, { signal: abort.signal });
      setVerbs(data);
    } catch (e: any) {
      setErr(e?.message ?? "Error buscando verbs");
    } finally {
      setIsLoading(false);
    }
    return () => abort.abort();
  }, [q, loadList]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const title = useMemo(() => (mode === "search" ? `Resultados: "${q.trim()}"` : "Lista de verbos"), [mode, q]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Diccionario de Verbos</h1>
          <p className="text-sm text-slate-600 mt-1">Explora y domina los verbos irregulares.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-slate-400 hover:text-white transition-colors">
            ← Dashboard
          </Button>
        </Link>
      </div>

      <Card className="border-violet-500/10 bg-violet-500/5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[240px] flex-1">
            <Input
              label="Búsqueda rápida"
              placeholder="go, take, become..."
              value={q}
              className="bg-slate-900/50 border-slate-800 focus:border-violet-500/50"
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/20"
              onClick={doSearch}
              disabled={isLoading}
            >
              {isLoading ? "Buscando..." : "Buscar"}
            </Button>
            <Button variant="secondary" onClick={loadList} disabled={isLoading}>
              Reset
            </Button>
          </div>
          {isLoading && <Spinner />}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
          <p className="text-sm font-bold text-slate-700">{title}</p>
        </div>

        {err && <Alert className="mt-4" variant="error" title="Error" description={err} />}

        {!isLoading && verbs.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
            <p className="text-slate-400 italic">No encontramos coincidencias para "{q}". Intenta con otro verbo.</p>
          </div>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {verbs.map((v) => (
          <Link key={v.id} href={`/verbs/${v.id}`}>
            <Card className="group relative overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-4xl font-black text-slate-900">#{v.id}</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-violet-600 transition-colors">
                    {v.infinitive}
                  </h3>
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Irregular
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-medium">
                    {v.past}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-medium">
                    {v.participle}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-slate-600 group-hover:text-slate-800 transition-colors italic">
                    {v.translation}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
