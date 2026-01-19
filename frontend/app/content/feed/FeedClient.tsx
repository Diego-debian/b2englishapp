"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isContentEnabled, isContentUxV2Enabled } from "@/lib/featureFlags";
import { ContentItemV1, isPublished } from "@/lib/contentSpec";

interface FeedClientProps {
    initialContent: ContentItemV1[];
}

export default function FeedClient({ initialContent }: FeedClientProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Use props from Server Component
    const [contentItems] = useState<ContentItemV1[]>(initialContent);
    const [tagFilter, setTagFilter] = useState<string | "all">("all");

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

    // Derived data
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        contentItems.forEach((item) => {
            item.tags?.forEach((tag) => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [contentItems]);

    const filteredContent = useMemo(() => {
        return contentItems.filter((item) => {
            if (!isPublished(item)) return false;
            const matchTag =
                tagFilter === "all" ? true : item.tags?.includes(tagFilter);
            return matchTag;
        });
    }, [contentItems, tagFilter]);

    if (!mounted) return null;
    if (!isContentEnabled()) return null;

    const isV2 = isContentUxV2Enabled();

    // V2 UI: Glassmorphic, Professional Blog Style
    if (isV2) {
        return (
            <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-16 text-center space-y-4">
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-white to-violet-200 tracking-tight">
                            B2English Magazine
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            A curated collection of grammar guides, learning strategies, and insights for your journey to fluency.
                        </p>
                    </header>

                    {/* V2 Filters: Minimalist */}
                    <div className="mb-12 flex justify-center">
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                            <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Topic</span>
                            <div className="h-4 w-px bg-white/10"></div>
                            <select
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                                className="bg-transparent text-slate-200 text-sm font-medium focus:outline-none cursor-pointer hover:text-white transition-colors [&>option]:bg-slate-900"
                            >
                                <option value="all">All Topics</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* V2 Content Grid */}
                    {filteredContent.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredContent.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/content/${item.slug}`}
                                    className="group relative flex flex-col h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-violet-500/30 transition-all duration-500 shadow-xl hover:shadow-violet-900/10 hover:-translate-y-1"
                                >
                                    {/* Abstract Visual Header */}
                                    <div className="h-48 bg-gradient-to-br from-slate-800 via-slate-900 to-black relative overflow-hidden">
                                        <div className="absolute inset-0 bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors duration-500" />
                                        <div className="absolute top-4 left-4">
                                            <div className="flex gap-2">
                                                {item.tags?.slice(0, 2).map((tag) => (
                                                    <span key={tag} className="px-2 py-1 bg-black/50 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <h2 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-violet-300 transition-colors">
                                            {item.title}
                                        </h2>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                                            {item.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <time className="text-xs font-mono text-slate-500">
                                                {item.publishedAt || "Recently"}
                                            </time>
                                            <span className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 group-hover:text-violet-300 transition-colors">
                                                Read Article
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32">
                            <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
                            <button
                                onClick={() => setTagFilter("all")}
                                className="text-violet-400 hover:text-violet-300 underline underline-offset-4"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    // Legacy UI (UNCHANGED)
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Latest Content</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Explore our guides, tips, and resources to master English grammar.
                    </p>
                </header>

                {/* Filters Section */}
                <div className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-white/5 mx-auto">
                    {/* Tag Filter Only (Status filter removed) */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">Filter by Tag:</span>
                        <select
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                            className="bg-slate-800 text-slate-300 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="all">All Tags</option>
                            {allTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content Grid */}
                {filteredContent.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredContent.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/content/${item.slug}`}
                                className="group flex flex-col h-full bg-slate-900 border border-white/10 rounded-2xl hover:border-violet-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-violet-900/10 overflow-hidden"
                            >
                                {/* Card Header (Image placeholder or gradient) */}
                                <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 relative">
                                    {/* Status Badge REMOVED - all are published */}
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.tags?.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-white/5"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {(item.tags?.length || 0) > 3 && (
                                            <span className="text-[10px] px-2 py-1 text-slate-500">
                                                +{item.tags!.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-grow">
                                        {item.excerpt}
                                    </p>

                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
                                        <time className="text-xs text-slate-500 font-mono">
                                            {item.publishedAt || item.createdAt.split("T")[0]}
                                        </time>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    // Simple copy link logic for specific request
                                                    const url = window.location.origin + `/content/${item.slug}`;
                                                    navigator.clipboard.writeText(url).then(() => {
                                                        alert("Link copiado al portapapeles");
                                                    }).catch(() => {
                                                        alert("No se pudo copiar el link");
                                                    });
                                                }}
                                                className="text-xs font-semibold text-slate-500 hover:text-white transition-colors z-10"
                                                title="Copiar Link"
                                            >
                                                🔗
                                            </button>
                                            <span className="text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
                                                Read Article →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            No content found
                        </h3>
                        <p className="text-slate-400">
                            No published content available at this time.
                        </p>
                        <button
                            onClick={() => {
                                setTagFilter("all");
                            }}
                            className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
