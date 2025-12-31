"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import Footer from "@/components/Footer";
import { AuthLayout } from "@/components/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => username.trim().length >= 3 && password.length >= 6,
    [username, password]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setIsLoading(true);

    try {
      const token = await api.login(username.trim(), password);
      login(token.access_token, token.user);
      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.message ?? "Error inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Continúa tu progreso en B2 English"
      footer={<Footer />}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        {err && (
          <Alert
            variant="error"
            title="Error de inicio de sesión"
            description={err}
          />
        )}

        <div className="space-y-4">
          <Input
            label="Usuario"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <Input
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            type="password"
          />
        </div>

        <Button
          disabled={!canSubmit || isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </span>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta?{" "}
            <Link
              className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              href="/register"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
