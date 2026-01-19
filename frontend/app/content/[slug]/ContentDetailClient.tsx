"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isContentEnabled, isContentUxV2Enabled } from "@/lib/featureFlags";
import { shareContent, copyToClipboard } from "@/lib/share";
import { ContentItemV1 } from "@/lib/contentSpec";
import { ds } from "@/lib/designSystem";

interface ContentDetailClientProps {
    item: ContentItemV1;
}

export default function ContentDetailClient({ item }: ContentDetailClientProps) {
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

    const isV2 = isContentUxV2Enabled();

    // V2 UI: Editorial / Immersive
    if (isV2) {
        return (
            <main className="min-h-screen bg-slate-950 px-4 py-12 md:py-20">
                <article className="max-w-4xl mx-auto">
                    {/* Navigation */}
                    <nav className="mb-12 flex justify-between items-center">
                        <Link
                            href="/content/feed"
                            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            Back to Magazine
                        </Link>

                        {/* Subtle Share Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    shareContent({ title: item!.title, text: item!.excerpt, url: window.location.href });
                                }}
                                className="text-slate-400 hover:text-violet-400 transition-colors"
                                aria-label="Share article"
                            >
                                <span className="text-xl">📤</span>
                            </button>
                            <button
                                onClick={() => {
                                    copyToClipboard(window.location.href).then(ok => {
                                        if (ok) alert("Link copied!");
                                    });
                                }}
                                className="text-slate-400 hover:text-violet-400 transition-colors"
                                aria-label="Copy link"
                            >
                                <span className="text-xl">🔗</span>
                            </button>
                        </div>
                    </nav>

                    {/* Header */}
                    <header className="mb-16 text-center">
                        <div className="flex justify-center gap-2 mb-6">
                            {item.tags?.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-violet-500/10 text-violet-300 text-xs font-bold uppercase tracking-widest rounded-full border border-violet-500/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                            {item.title}
                        </h1>
                        <time className="block text-slate-500 font-mono text-sm">
                            {item.publishedAt ? `Published on ${item.publishedAt}` : "Recently published"}
                        </time>
                    </header>

                    {/* Excerpt / Intro */}
                    <div className="mb-16 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                        <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light italic text-center">
                            "{item.excerpt}"
                        </p>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-invert prose-lg md:prose-xl max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white 
                        prose-p:text-slate-300 prose-p:leading-8 
                        prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white prose-code:text-violet-300 prose-code:bg-slate-900 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                        prose-li:text-slate-300
                        ">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            // Pass minimum overrides, rely on Tailwind Typography (prose) mostly
                            components={{
                                // Custom link handling for safety/performance
                                a: ({ href, children }) => (
                                    <Link href={href as string} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                                        {children}
                                    </Link>
                                ),
                            }}
                        >
                            {item.body}
                        </ReactMarkdown>
                    </div>

                    {/* Footer / Post-read */}
                    <div className="mt-20 pt-10 border-t border-white/10 text-center">
                        <h4 className="text-slate-500 font-medium mb-4">Thanks for reading!</h4>
                        <Link
                            href="/content/feed"
                            className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors"
                        >
                            Read more articles
                        </Link>
                    </div>
                </article>
            </main>
        );
    }

    // Legacy UI (UNCHANGED logic, now styled via DS if enabled)
    return (
        <main className={ds.layout.page("min-h-screen bg-slate-950 px-4 py-16")}>
            <article className={ds.layout.container("max-w-3xl mx-auto")}>
                <Link
                    href="/content/feed"
                    className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    ← Volver al feed
                </Link>

                <header className="mb-8">
                    <div className={ds.meta.row("mb-4")}>
                        <time className={ds.meta.date("text-sm text-violet-400 block")}>
                            {item.publishedAt}
                        </time>
                    </div>

                    <h1 className={ds.typo.h1("text-3xl md:text-5xl font-bold text-white mb-6")}>
                        {item.title}
                    </h1>

                    {/* Actions Bar */}
                    <div className={ds.actions.bar("flex gap-4 mb-6 border-t-0 pt-0 mt-0")}>
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
                            className={ds.button.primary("px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2")}
                        >
                            📤 Compartir
                        </button>
                        <button
                            onClick={() => {
                                copyToClipboard(window.location.href).then((ok) => {
                                    if (ok) alert("Link copiado al portapapeles");
                                });
                            }}
                            className={ds.button.secondary("px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2")}
                        >
                            🔗 Copiar Link
                        </button>
                    </div>

                    <p className={ds.typo.subtitle("text-xl text-slate-300 leading-relaxed border-l-4 border-violet-500/50 pl-4")}>
                        {item.excerpt}
                    </p>
                </header>

                {/* Markdown Content */}
                <div className={ds.typo.body("text-slate-300 leading-relaxed font-normal")}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className={ds.typo.h2("text-3xl font-bold text-white mt-10 mb-6")}>
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className={ds.typo.h2("text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-white/10")}>
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
                                <ul className={ds.typo.list("list-disc pl-6 mb-6 space-y-2 marker:text-violet-500")}>
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className={ds.typo.list("list-decimal pl-6 mb-6 space-y-2 marker:text-violet-500")}>
                                    {children}
                                </ol>
                            ),
                            li: ({ children }) => <li className="pl-1">{children}</li>,
                            a: ({ href, children }) => (
                                <Link
                                    href={href as string}
                                    className={ds.typo.link("text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/30 hover:decoration-cyan-300 transition-all font-medium")}
                                    target={href?.startsWith("http") ? "_blank" : undefined}
                                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                                >
                                    {children}
                                </Link>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className={ds.typo.quote("border-l-4 border-violet-500/50 pl-4 py-1 my-6 text-slate-400 italic bg-white/5 rounded-r-lg")}>
                                    {children}
                                </blockquote>
                            ),
                            code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                    <code className={ds.typo.codeInline("bg-slate-800 text-violet-300 px-1.5 py-0.5 rounded text-sm font-mono border border-white/10")}>
                                        {children}
                                    </code>
                                ) : (
                                    <code className={ds.typo.codeBlock("block bg-slate-900 p-4 rounded-xl text-slate-300 text-sm font-mono overflow-x-auto border border-white/10 mb-6")}>
                                        {children}
                                    </code>
                                );
                            },
                            pre: ({ children }) => <pre className="contents">{children}</pre>,
                            strong: ({ children }) => (
                                <strong className="font-bold text-current">{children}</strong>
                            ),
                            em: ({ children }) => (
                                <em className="italic text-current">{children}</em>
                            ),
                            hr: () => <hr className="border-t border-slate-200 my-8" />,
                        }}
                    >
                        {item.body}
                    </ReactMarkdown>
                </div>
            </article>
        </main>
    );
}
