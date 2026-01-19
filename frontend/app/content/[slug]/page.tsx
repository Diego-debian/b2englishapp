"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isContentEnabled } from "@/lib/featureFlags";
import { MOCK_CONTENT } from "@/lib/mockContent";
import { getPublishedContentSnapshot } from "@/lib/contentStorage";
import { shareContent, copyToClipboard } from "@/lib/share";

export default function ContentDetailPage() {
    const router = useRouter();
    const params = useParams();
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

    const slug = params?.slug as string;

    // 1. Try to find in local storage snapshot first
    const snapshot = getPublishedContentSnapshot();
    let item = snapshot.find((c) => c.slug === slug);

    // 2. Fallback to mock content if not found
    if (!item) {
        item = MOCK_CONTENT.find((c) => c.slug === slug);
    }

    if (!item) {
        return (
            <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Content Not Found
                    </h1>
                    <p className="text-slate-400 mb-6">
                        The article you are looking for does not exist.
                    </p>
                    <Link
                        href="/content/feed"
                        className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
                    >
                        Back to Feed
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-16">
            <article className="max-w-3xl mx-auto">
                <Link
                    href="/content/feed"
                    className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    ← Volver al feed
                </Link>

                <header className="mb-8">
                    <time className="text-sm text-violet-400 mb-2 block">
                        {item.publishedAt}
                    </time>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {item.title}
                    </h1>

                    {/* Actions Bar */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => {
                                const url = window.location.href;
                                shareContent({
                                    title: item!.title,
                                    text: item!.excerpt,
                                    url
                                }).then((result) => {
                                    if (result === 'copied') alert("Link copiado al portapapeles");
                                    // if 'shared', browser handled it
                                });
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            📤 Compartir
                        </button>
                        <button
                            onClick={() => {
                                copyToClipboard(window.location.href).then((ok) => {
                                    if (ok) alert("Link copiado al portapapeles");
                                });
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            🔗 Copiar Link
                        </button>
                    </div>

                    <p className="text-xl text-slate-300 leading-relaxed border-l-4 border-violet-500/50 pl-4">
                        {item.excerpt}
                    </p>
                </header>

                {/* Markdown Content */}
                <div className="text-slate-300 leading-relaxed font-normal">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className="text-3xl font-bold text-white mt-10 mb-6">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-white/10">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="text-xl font-semibold text-violet-200 mt-8 mb-3">
                                    {children}
                                </h3>
                            ),
                            p: ({ children }) => <p className="mb-6">{children}</p>,
                            ul: ({ children }) => (
                                <ul className="list-disc pl-6 mb-6 space-y-2 marker:text-violet-500">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="list-decimal pl-6 mb-6 space-y-2 marker:text-violet-500">
                                    {children}
                                </ol>
                            ),
                            li: ({ children }) => <li className="pl-1">{children}</li>,
                            a: ({ href, children }) => (
                                <Link
                                    href={href as string}
                                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/30 hover:decoration-cyan-300 transition-all font-medium"
                                    target={href?.startsWith("http") ? "_blank" : undefined}
                                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                                >
                                    {children}
                                </Link>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-violet-500/50 pl-4 py-1 my-6 text-slate-400 italic bg-white/5 rounded-r-lg">
                                    {children}
                                </blockquote>
                            ),
                            code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                    <code className="bg-slate-800 text-violet-300 px-1.5 py-0.5 rounded text-sm font-mono border border-white/10">
                                        {children}
                                    </code>
                                ) : (
                                    <code className="block bg-slate-900 p-4 rounded-xl text-slate-300 text-sm font-mono overflow-x-auto border border-white/10 mb-6">
                                        {children}
                                    </code>
                                );
                            },
                            pre: ({ children }) => <pre className="contents">{children}</pre>,
                            strong: ({ children }) => (
                                <strong className="font-bold text-white">{children}</strong>
                            ),
                            em: ({ children }) => (
                                <em className="italic text-violet-200">{children}</em>
                            ),
                            hr: () => <hr className="border-t border-white/10 my-8" />,
                        }}
                    >
                        {item.body}
                    </ReactMarkdown>
                </div>
            </article>
        </main>
    );
}
