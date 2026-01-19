"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isContentEnabled } from "@/lib/featureFlags";
import { MOCK_CONTENT } from "@/lib/mockContent";
import { getPublishedContentSnapshot } from "@/lib/contentStorage";
import { ContentItemV1, isPublished } from "@/lib/contentSpec";

export default function ContentFeedPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    // Initialize with filtered mock content to ensure no drafts leak from initial state
    const [contentItems, setContentItems] = useState<ContentItemV1[]>(
        MOCK_CONTENT.filter(isPublished)
    );
    // Status filter removed (always "published")
    const [tagFilter, setTagFilter] = useState<string | "all">("all");

    useEffect(() => {
        setMounted(true);
        // Load from local storage snapshot if available
        // Note: getPublishedContentSnapshot() ALREADY checks for status === "published"
        const snapshot = getPublishedContentSnapshot();
        if (snapshot.length > 0) {
            console.log("Loaded content from localStorage snapshot:", snapshot.length);
            setContentItems(snapshot);
        }
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
            // Redundant double-check for safety:
            if (!isPublished(item)) return false;

            const matchTag =
                tagFilter === "all" ? true : item.tags?.includes(tagFilter);
            return matchTag;
        });
    }, [contentItems, tagFilter]);

    if (!mounted) return null;
    if (!isContentEnabled()) return null;

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

