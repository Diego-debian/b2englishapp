"use client";

import PracticeCard from '../../../components/PracticeCard';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PracticePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-8 px-4 gap-6 bg-gray-100">
      <div className="self-start">
        <Link href="/dashboard" className="text-blue-600 hover:underline">← Volver al panel</Link>
      </div>
      <PracticeCard userId={user.id} />
    </main>
  );
}