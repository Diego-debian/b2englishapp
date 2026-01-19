"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSupportEnabled } from "@/lib/featureFlags";

export default function SupportPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Feature flag guard
    useEffect(() => {
        if (!mounted) return;
        if (!isSupportEnabled()) {
            router.replace("/");
        }
    }, [mounted, router]);

    // Prevent hydration mismatch
    if (!mounted) return null;

    // Feature flag check
    if (!isSupportEnabled()) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(168,85,247,.15),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_70%_80%,rgba(6,182,212,.15),transparent_50%)] pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-4 py-16">
                {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════════════ */}
                <header className="text-center mb-20">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 mb-8 shadow-2xl shadow-violet-500/40 animate-pulse">
                        <span className="text-5xl">💜</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text mb-6 leading-tight">
                        Apoya B2 English
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        B2 English es un proyecto <span className="text-violet-400 font-semibold">gratuito</span> y{" "}
                        <span className="text-cyan-400 font-semibold">open-source</span>.
                        Tu apoyo nos ayuda a mejorar y crear más contenido para estudiantes de inglés en todo el mundo.
                    </p>
                </header>

                {/* ═══════════════════════════════════════════════════════════════
            WHY SUPPORT / HOW WE USE IT / TRANSPARENCY
        ═══════════════════════════════════════════════════════════════ */}
                <section className="grid md:grid-cols-3 gap-6 mb-20">
                    {/* Por qué apoyar */}
                    <div className="glass-strong rounded-2xl p-8 border border-white/10 hover:border-violet-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">¿Por qué apoyar?</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Desarrollar una plataforma de calidad requiere tiempo y recursos.
                            Tu apoyo nos permite dedicar más horas a crear lecciones, ejercicios
                            y funcionalidades que realmente ayuden a aprender.
                        </p>
                    </div>

                    {/* En qué se usa */}
                    <div className="glass-strong rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🛠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">¿En qué se usa?</h2>
                        <ul className="text-slate-400 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">→</span>
                                Hosting y dominios
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">→</span>
                                Nuevas funcionalidades
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">→</span>
                                Contenido educativo
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">→</span>
                                Mantenimiento continuo
                            </li>
                        </ul>
                    </div>

                    {/* Transparencia */}
                    <div className="glass-strong rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">Transparencia</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Este es un proyecto personal con metas claras:
                            crear la mejor herramienta gratuita para aprender gramática inglesa.
                            No hay inversionistas ni presiones externas — solo pasión por enseñar.
                        </p>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════
            FORMAS DE APOYAR
        ═══════════════════════════════════════════════════════════════ */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black text-white text-center mb-12">
                        Formas de Apoyar
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* A) Donación Directa */}
                        <div className="relative glass-strong rounded-2xl p-8 border border-violet-500/30 hover:border-violet-500/50 transition-all duration-300">
                            <div className="absolute -top-3 right-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                PRÓXIMAMENTE
                            </div>
                            <div className="text-4xl mb-4">💳</div>
                            <h3 className="text-xl font-bold text-white mb-3">Donación Directa</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                Una donación puntual para apoyar el proyecto.
                                Estamos trabajando en integrar opciones de pago seguras.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-400 text-sm">PayPal</span>
                                <span className="px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-400 text-sm">Stripe</span>
                                <span className="px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-400 text-sm">Crypto</span>
                            </div>
                            <p className="mt-4 text-xs text-slate-500 italic">
                                Las opciones de pago estarán disponibles pronto
                            </p>
                        </div>

                        {/* B) Difusión */}
                        <div className="glass-strong rounded-2xl p-8 border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300">
                            <div className="text-4xl mb-4">📢</div>
                            <h3 className="text-xl font-bold text-white mb-3">Difusión</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                ¿Te ha servido? Compártelo con quien pueda beneficiarse.
                                Cada recomendación hace crecer la comunidad.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="https://twitter.com/intent/tweet?text=Estoy%20aprendiendo%20inglés%20con%20B2%20English%20%F0%9F%9A%80%20Una%20plataforma%20gratuita%20para%20practicar%20gramática.%20%C2%A1Pruébala!"
                                    target="_blank"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
                                >
                                    <span>🐦</span>
                                    Compartir en Twitter / X
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/sharing/share-offsite/"
                                    target="_blank"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
                                >
                                    <span>💼</span>
                                    Compartir en LinkedIn
                                </Link>
                            </div>
                        </div>

                        {/* C) Feedback */}
                        <div className="glass-strong rounded-2xl p-8 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="text-xl font-bold text-white mb-3">Feedback</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                Tus sugerencias son valiosas. Si encontraste un bug, tienes una idea
                                de mejora o quieres colaborar, ¡contáctame!
                            </p>
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-200 text-sm leading-relaxed">
                                    <span className="font-semibold">📬 Contacto:</span><br />
                                    Escríbeme por el mismo canal donde encontraste B2 English
                                    (YouTube, redes sociales, o donde sea que llegaste aquí).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════
            CTA FINAL
        ═══════════════════════════════════════════════════════════════ */}
                <section className="text-center">
                    <div className="glass-strong rounded-3xl p-10 border border-white/10 max-w-2xl mx-auto">
                        <p className="text-2xl font-bold text-white mb-4">
                            ¿Listo para compartir?
                        </p>
                        <p className="text-slate-400 mb-8">
                            Ayuda a otros estudiantes a descubrir B2 English.
                            Cada persona que lo comparte hace una diferencia.
                        </p>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: "B2 English",
                                        text: "Aprende gramática inglesa gratis con B2 English 🚀",
                                        url: window.location.origin,
                                    });
                                } else {
                                    navigator.clipboard.writeText(window.location.origin);
                                    alert("¡Enlace copiado al portapapeles!");
                                }
                            }}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
                        >
                            <span>🔗</span>
                            Compartir B2 English
                        </button>
                    </div>

                    <p className="text-slate-500 mt-8">
                        Gracias por ser parte de la comunidad 💜
                    </p>
                </section>
            </div>
        </main>
    );
}
