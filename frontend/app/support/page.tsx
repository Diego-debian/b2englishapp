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
        <main className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Effects - Subtle and low contrast to ensure text readability */}
            <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.1),transparent_50%)] pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-4 py-16">
                {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════════════ */}
                <header className="text-center mb-20">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900 border border-white/10 mb-8 shadow-2xl">
                        <span className="text-5xl">💜</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Apoya B2 English
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        B2 English es un proyecto <span className="text-white font-semibold">gratuito</span> y{" "}
                        <span className="text-white font-semibold">open-source</span>.
                        Tu apoyo nos ayuda a mejorar y crear más contenido para estudiantes de inglés en todo el mundo.
                    </p>
                </header>

                {/* ═══════════════════════════════════════════════════════════════
            WHY SUPPORT / HOW WE USE IT / TRANSPARENCY
        ═══════════════════════════════════════════════════════════════ */}
                <section className="grid md:grid-cols-3 gap-6 mb-20">
                    {/* Por qué apoyar */}
                    <div className="bg-slate-900/80 rounded-2xl p-8 border border-white/10 hover:border-violet-500/30 transition-colors duration-300">
                        <div className="w-14 h-14 rounded-xl bg-violet-900/20 flex items-center justify-center mb-5 border border-violet-500/20">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">¿Por qué apoyar?</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Desarrollar una plataforma de calidad requiere tiempo y recursos.
                            Tu apoyo nos permite dedicar más horas a crear lecciones, ejercicios
                            y funcionalidades que realmente ayuden a aprender.
                        </p>
                    </div>

                    {/* En qué se usa */}
                    <div className="bg-slate-900/80 rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors duration-300">
                        <div className="w-14 h-14 rounded-xl bg-cyan-900/20 flex items-center justify-center mb-5 border border-cyan-500/20">
                            <span className="text-3xl">🛠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">¿En qué se usa?</h2>
                        <ul className="text-slate-300 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-1">→</span>
                                Hosting y dominios
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-1">→</span>
                                Nuevas funcionalidades
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-1">→</span>
                                Contenido educativo
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400 mt-1">→</span>
                                Mantenimiento continuo
                            </li>
                        </ul>
                    </div>

                    {/* Transparencia */}
                    <div className="bg-slate-900/80 rounded-2xl p-8 border border-white/10 hover:border-emerald-500/30 transition-colors duration-300">
                        <div className="w-14 h-14 rounded-xl bg-emerald-900/20 flex items-center justify-center mb-5 border border-emerald-500/20">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">Transparencia</h2>
                        <p className="text-slate-300 leading-relaxed">
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
                        <div className="bg-slate-900/80 rounded-2xl p-8 border border-white/10 hover:border-violet-500/50 transition-colors duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <span className="text-9xl">❤️</span>
                            </div>

                            <div className="text-4xl mb-6 relative">💳</div>
                            <h3 className="text-xl font-bold text-white mb-3 relative">Donación Directa</h3>
                            <p className="text-slate-300 mb-8 leading-relaxed relative">
                                Si B2 English te ha ayudado, considera invitarnos a un café. ¡Cada aporte cuenta!
                            </p>

                            <div className="space-y-4 relative">
                                <a
                                    href="https://www.paypal.com/donate/?business=profediegoparra01@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    <span>PayPal</span>
                                </a>

                                <a
                                    href="https://ko-fi.com/diegodebian"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg shadow-red-900/20"
                                >
                                    <span>Ko-fi</span>
                                </a>
                            </div>
                        </div>

                        {/* B) Difusión */}
                        <div className="bg-slate-900/80 rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-colors duration-300">
                            <div className="text-4xl mb-6">📢</div>
                            <h3 className="text-xl font-bold text-white mb-3">Difusión</h3>
                            <p className="text-slate-300 mb-8 leading-relaxed">
                                ¿Te ha servido? Compártelo con quien pueda beneficiarse.
                                Cada recomendación hace crecer la comunidad.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="https://twitter.com/intent/tweet?text=Estoy%20aprendiendo%20inglés%20con%20B2%20English%20%F0%9F%9A%80%20Una%20plataforma%20gratuita%20para%20practicar%20gramática.%20%C2%A1Pruébala!"
                                    target="_blank"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-sky-400 hover:bg-slate-700 transition-colors"
                                >
                                    <span>🐦</span>
                                    Compartir en Twitter / X
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/sharing/share-offsite/"
                                    target="_blank"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-blue-400 hover:bg-slate-700 transition-colors"
                                >
                                    <span>💼</span>
                                    Compartir en LinkedIn
                                </Link>
                            </div>
                        </div>

                        {/* C) Feedback */}
                        <div className="bg-slate-900/80 rounded-2xl p-8 border border-white/10 hover:border-amber-500/50 transition-colors duration-300">
                            <div className="text-4xl mb-6">💬</div>
                            <h3 className="text-xl font-bold text-white mb-3">Feedback</h3>
                            <p className="text-slate-300 mb-8 leading-relaxed">
                                Tus sugerencias son valiosas. Si encontraste un bug, tienes una idea
                                de mejora o quieres colaborar, ¡contáctame!
                            </p>
                            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20">
                                <p className="text-amber-200/90 text-sm leading-relaxed">
                                    <span className="font-semibold text-amber-200">📬 Contacto:</span><br />
                                    Escríbeme por el mismo canal donde encontraste B2 English
                                    (YouTube, redes sociales, etc).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════
            CTA FINAL
        ═══════════════════════════════════════════════════════════════ */}
                <section className="text-center">
                    <div className="bg-slate-900/80 rounded-3xl p-10 border border-white/10 max-w-2xl mx-auto">
                        <p className="text-2xl font-bold text-white mb-4">
                            ¿Listo para compartir?
                        </p>
                        <p className="text-slate-300 mb-8">
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
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg shadow-lg hover:shadow-violet-900/20 transition-all transform hover:scale-105"
                        >
                            <span>🔗</span>
                            Compartir B2 English
                        </button>
                    </div>

                    <p className="text-slate-500 mt-8 text-sm">
                        Gracias por ser parte de la comunidad 💜
                    </p>
                </section>
            </div>
        </main>
    );
}
