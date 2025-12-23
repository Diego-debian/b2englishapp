"use client";

import React from "react";
import { GamificationProvider } from "../hooks/useGamification";
import { AuthProvider } from "../hooks/useAuth";
import GamifiedHeader from "../components/GamifiedHeader";

/**
 * Componente wrapper que ejecuta todos los providers en el cliente.
 * Incluye el AuthProvider, GamificationProvider y el encabezado gamificado.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GamificationProvider>
        <GamifiedHeader />
        {children}
      </GamificationProvider>
    </AuthProvider>
  );
}
