"use client";

import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Bienvenido al Entrenador de Verbos B2</h1>
      <p className="mb-8 text-center max-w-xl">
        Practica verbos irregulares con nuestro motor de repetición espaciada y mejora tu
        vocabulario inglés de nivel B2. ¡Gana puntos, mantén tu racha y domina los
        verbos más comunes!
      </p>
      <div className="flex gap-4">
        <Link
          className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition"
          href="/login"
        >
          Iniciar sesión
        </Link>
        <Link
          className="inline-flex items-center gap-2 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-md transition"
          href="/register"
        >
          Registrarse
        </Link>
      </div>
    </main>
  );
}