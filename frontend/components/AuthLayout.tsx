import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
}

export function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* ================= CONTENIDO PRINCIPAL ================= */}
            <div className="relative flex-1 flex">
                {/* ================= PANEL IZQUIERDO (NARRATIVO) ================= */}
                <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
                    {/* Background limpio y elegante */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

                    {/* Sutil accent gradient */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.15),transparent_50%)]" />

                    {/* Content centrado y minimalista */}
                    <div className="relative z-10 flex items-center justify-center w-full px-16">
                        <div className="space-y-6 text-center">
                            {/* Brand headline */}
                            <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
                                Learn English
                            </h1>

                            {/* Value prop simple */}
                            <p className="text-lg text-slate-300 font-light">
                                Practice daily. Level up.
                            </p>

                            {/* Micro-gamification hint */}
                            <div className="flex items-center justify-center gap-3 text-sm text-slate-400 pt-4">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="text-amber-400">⭐</span>
                                    XP
                                </span>
                                <span className="opacity-40">·</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="text-cyan-400">📊</span>
                                    Progress
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= FORMULARIO DERECHA ================= */}
                <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* Mobile heading */}
                        <div className="lg:hidden text-center mb-8">
                            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text mb-2">
                                B2 English
                            </h1>
                            <p className="text-slate-600">
                                Learn. Practice. Level Up.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="pointer-events-none absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-emerald-500/20 blur-xl" />

                            <div className="relative rounded-[2.5rem] border border-white/10 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                                <div className="px-8 pt-8 pb-6 text-center">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        {title}
                                    </h2>
                                    {subtitle && (
                                        <p className="text-slate-600 text-sm">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>

                                <div className="px-8 flex-1">
                                    {children}
                                </div>

                                {/* Footer integrado en la tarjeta (Manteniendo colores originales) */}
                                {footer && (
                                    <div className="w-full">
                                        {footer}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
