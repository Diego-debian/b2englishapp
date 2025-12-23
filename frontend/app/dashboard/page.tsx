"use client";

import Link from "next/link";
import { BarChart2, Trophy, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

interface Stats {
  streak: number;
  totalMistakes: number;
  totalXp: number;
}

type Verb = {
  id: number;
  infinitive: string;
  past: string;
  participle: string;
  translation: string;
  example_b2: string;
};

export default function Dashboard() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();

  const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001").trim();

  const [stats, setStats] = useState<Stats>({ streak: 0, totalMistakes: 0, totalXp: 0 });
  const [practiceVerbs, setPracticeVerbs] = useState<Verb[]>([]);

  async function fetchStats() {
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // Mantener app funcional si el endpoint aún no está listo
        setStats((s) => ({ ...s, totalXp: 0, streak: 0, totalMistakes: 0 }));
        return;
      }

      const data = await res.json();

      // Soporta distintos nombres por compatibilidad
      const totalXp =
        typeof data.total_xp === "number"
          ? data.total_xp
          : typeof data.totalXp === "number"
          ? data.totalXp
          : 0;

      const streak =
        typeof data.streak === "number"
          ? data.streak
          : typeof data.current_streak === "number"
          ? data.current_streak
          : 0;

      const totalMistakes =
        typeof data.total_mistakes === "number"
          ? data.total_mistakes
          : typeof data.totalMistakes === "number"
          ? data.totalMistakes
          : 0;

      setStats({ totalXp, streak, totalMistakes });
    } catch (err) {
      console.warn("Error fetching stats", err);
    }
  }

  async function fetchPractice() {
    if (!token) return;

    // ✅ Multiusuario real: no enviar user_id. Primero probamos el endpoint nuevo.
    const tryEndpoints = [
      `${apiBase}/verbs/practice?limit=9`,
      // fallback para no romper si aún tienes el endpoint viejo:
      user?.id ? `${apiBase}/verbs/${user.id}` : null,
    ].filter(Boolean) as string[];

    for (const url of tryEndpoints) {
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) continue;

        const data = await res.json();
        setPracticeVerbs(Array.isArray(data) ? data : []);
        return;
      } catch (err) {
        console.warn("Error fetching practice verbs from", url, err);
      }
    }
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchStats();
      fetchPractice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, apiBase]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (!user) {
    return null; // redirect
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Panel de Control</h2>

        <div className="flex items-center gap-4">
          <span className="text-lg">Hola, {user.username}!</span>
          <span className="text-sm text-gray-600">XP: {stats.totalXp}</span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-white rounded-lg shadow flex items-center">
          <Trophy className="w-8 h-8 text-yellow-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Racha Actual</p>
            <p className="text-xl font-bold">{stats.streak} días</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow flex items-center">
          <BarChart2 className="w-8 h-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Errores Totales</p>
            <p className="text-xl font-bold">{stats.totalMistakes}</p>
          </div>
        </div>
      </div>

      {/* Upcoming verbs section */}
      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Próximos verbos a practicar</h3>

        {practiceVerbs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {practiceVerbs.map((verb) => (
              <div key={verb.id} className="p-4 bg-white rounded-lg shadow">
                <h4 className="text-lg font-bold mb-1 text-gray-800">{verb.infinitive}</h4>

                <p className="text-sm text-gray-600 mb-1">
                  Pasado: <span className="font-medium text-gray-800">{verb.past}</span>
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  Participio: <span className="font-medium text-gray-800">{verb.participle}</span>
                </p>

                <p className="text-sm text-gray-600">
                  Traducción: <span className="font-medium text-gray-800">{verb.translation}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay verbos pendientes en este momento.</p>
        )}
      </section>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard/practice"
          className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          Iniciar Sesión de Práctica
        </Link>

        <Link
          href="/dashboard/verbs"
          className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
        >
          Gestionar Verbos
        </Link>
      </div>
    </main>
  );
}
