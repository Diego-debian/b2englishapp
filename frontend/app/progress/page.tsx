"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Protected } from "@/components/Protected";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { Alert } from "@/components/Alert";
import { JsonView } from "@/components/JsonView";
import { api } from "@/lib/api";

export default function ProgressPage() {
  return (
    <Protected>
      <ProgressInner />
    </Protected>
  );
}

function ProgressInner() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setStatus(null);

    const abort = new AbortController();
    try {
      const d = await api.progressGet({ signal: abort.signal });
      setData(d);
    } catch (e: any) {
      setStatus(e?.status ?? null);
      setErr(e?.message ?? "Error cargando progress");
    } finally {
      setLoading(false);
    }
    return () => abort.abort();
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setStatus(null);

    const abort = new AbortController();
    try {
      await api.progressInit({ signal: abort.signal });
      const d = await api.progressGet({ signal: abort.signal });
      setData(d);
    } catch (e: any) {
      setStatus(e?.status ?? null);
      setErr(e?.message ?? "Error inicializando progress");
    } finally {
      setLoading(false);
    }
    return () => abort.abort();
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seguimiento de Progreso</h1>
          <p className="text-sm text-slate-600 mt-1">Analiza tu rendimiento y la salud de tu aprendizaje.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-slate-400 hover:text-white transition-colors">
            ← Dashboard
          </Button>
        </Link>
      </div>

      {err && (
        <Alert
          variant={status === 403 ? "warn" : "error"}
          title={status === 403 ? "No autorizado" : "Error de Conexión"}
          description={err}
        />
      )}

      <div className="grid gap-6">
        <Card className="border-emerald-500/10 bg-emerald-500/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sistema de Repetición Espaciada (SRS)</h3>
              <p className="text-sm text-slate-600 mt-1">Inicializa tu progreso para comenzar el seguimiento detallado de cada verbo.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={init}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
              >
                {loading ? "Iniciando..." : "🚀 Inicializar Sistema"}
              </Button>
              <Button variant="secondary" onClick={load} disabled={loading}>
                🔄 Actualizar Datos
              </Button>
              {loading && <Spinner />}
            </div>
          </div>
        </Card>

        <Card className="border-slate-800/50">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Datos en Bruto (Debug)</h3>
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">FORMATO JSON</span>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative max-h-[520px] overflow-auto rounded-xl border border-slate-200 bg-white p-4 custom-scrollbar shadow-inner">
              {data ? (
                <JsonView data={data} />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-500 italic">No hay datos de progreso detectados. Haz clic en 'Inicializar' para comenzar.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 italic">
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <p>Nota: Esta vista se transformará en una cuadrícula de KPIs en futuras actualizaciones visuales.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
