"use client";

import React, { useEffect } from "react";
import GamifiedHeader from "@/components/GamifiedHeader";
import { useAuthStore } from "@/store/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
    const hydrate = useAuthStore((s) => s.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return (
        <div className="min-h-screen bg-radial-glow">
            <div className="pointer-events-none fixed inset-0 opacity-40 [background:radial-gradient(circle_at_20%_10%,rgba(37,99,235,.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,.10),transparent_40%)]" />
            <GamifiedHeader />
            <main className="relative mx-auto w-full max-w-5xl px-4 py-6 space-y-6">
                {children}
            </main>
        </div>
    );

}
