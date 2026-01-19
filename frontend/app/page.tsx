import Link from "next/link";
import { Button } from "@/components/Button";
import Footer from "@/components/Footer";
import LatestContentBlock from "@/components/content/LatestContentBlock";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Fondo premium */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_15%,rgba(168,85,247,.08),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,.06),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(100,116,139,.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 mb-8 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-violet-400"></div>
            <span className="text-sm font-medium text-violet-800">Aprende Inglés B2 de Forma Gamificada</span>
          </div>

          {/* Título principal */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-gradient-to-r from-slate-900 via-violet-800 to-slate-900 bg-clip-text mb-6">
            B2 English
            <br />
            <span className="text-4xl md:text-6xl bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
              Verb Trainer
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sesiones cortas, feedback inmediato, XP por respuesta.
            <br className="hidden md:block" />
            Entra y haz "una run más" para dominar los verbos irregulares.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register">
              <Button className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-xl shadow-violet-500/20 border-none ring-0">
                Comenzar Ahora
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg hover:scale-105 transition-all duration-300">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="group relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Elige Actividad</h3>
              <p className="text-slate-600">
                Selecciona actividades por tiempo verbal y recibe preguntas personalizadas.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Responde Rápido</h3>
              <p className="text-slate-600">
                Una pregunta a la vez, con temporizador y barra de progreso visual.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Gana XP</h3>
              <p className="text-slate-600">
                Feedback instantáneo / + XP acumulado por sesión para motivarte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Content Block */}
      <LatestContentBlock />

      {/* Footer */}
      <Footer />
    </div>
  );
}
