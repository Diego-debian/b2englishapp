"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isContentEnabled } from "@/lib/featureFlags";
import { MOCK_CONTENT } from "@/lib/mockContent";

export default function ContentFeedPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Feature flag guard
    useEffect(() => {
        if (!mounted) return;
        if (!isContentEnabled()) {
            router.replace("/");
        }
    }, [mounted, router]);

    if (!mounted) return null;
    if (!isContentEnabled()) return null;

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Latest Content</h1>
                    <p className="text-slate-400">Explore our latest guides and tips.</p>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {MOCK_CONTENT.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/content/${item.slug}`}
                            className="group block p-6 bg-slate-900/80 border border-white/10 rounded-2xl hover:border-violet-500/50 hover:bg-slate-900 transition-all"
                        >
                            <article>
                                <time className="text-xs text-slate-500 mb-2 block">
                                    {item.publishedAt}
                                </time>
                                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                                    {item.title}
                                </h2>
                                <p className="text-sm text-slate-300 line-clamp-3">
                                    {item.excerpt}
                                </p>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
