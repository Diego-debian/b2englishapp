import "./globals.css";
import React from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "B2 English Verb Trainer",
  description: "Practise irregular verbs with gamification."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
    <body className="min-h-screen bg-premium text-zinc-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
