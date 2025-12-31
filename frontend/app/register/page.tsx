"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";
import Footer from "@/components/Footer";
import { AuthLayout } from "@/components/AuthLayout";
import { useRegisterForm } from "./useRegisterForm";

export default function RegisterPage() {
  const { form, isLoading, serverError, onSubmit } = useRegisterForm();

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = form;

  const passwordValue = watch("password");

  return (
    <AuthLayout
      title="Crear cuenta gratuita"
      subtitle="Empieza tu viaje hacia la fluidez en inglés"
      footer={<Footer />}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        {serverError && (
          <Alert
            variant="error"
            title="Error al crear cuenta"
            description={serverError}
          />
        )}

        <Input
          label="Nombre de usuario"
          placeholder="Elige un nombre único"
          {...register("username")}
          error={errors.username?.message}
        />

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <div>
          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            {...register("password")}
            error={errors.password?.message}
          />
          {/* Password Strength Indicator (Simple) */}
          <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${passwordValue?.length > 8 ? "w-full bg-emerald-500" :
                passwordValue?.length > 5 ? "w-2/3 bg-amber-500" :
                  passwordValue?.length > 0 ? "w-1/3 bg-red-500" : "w-0"
                }`}
            />
          </div>
        </div>

        <Button
          disabled={!isValid || isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </span>
          ) : (
            "Comenzar mi viaje 🚀"
          )}
        </Button>

        <p className="text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
