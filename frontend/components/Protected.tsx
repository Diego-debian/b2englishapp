"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "./Spinner";
import { Card } from "./Card";

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/login");
  }, [hydrated, token, router]);

  if (!hydrated) {
    return (
      <Card>
        <div className="flex items-center gap-3">
          <Spinner />
          <p className="text-sm text-zinc-300">Cargando sesión...</p>
        </div>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card>
        <p className="text-sm text-zinc-300">Redirigiendo a login...</p>
      </Card>
    );
  }

  return <>{children}</>;
}
