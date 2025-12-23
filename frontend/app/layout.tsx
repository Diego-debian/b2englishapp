import "./styles/globals.css";
import React from "react";
// Importa el wrapper de providers en vez del proveedor directamente
import { Providers } from "./providers";

export const metadata = {
  title: "B2 English Verb Trainer",
  description: "Practise irregular verbs with spaced repetition and gamification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {/*
          Envuelve el árbol de páginas en el componente Providers,
          que establece el GamificationProvider y el encabezado en el lado del cliente.
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
