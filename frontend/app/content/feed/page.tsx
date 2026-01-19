"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isContentEnabled } from "@/lib/featureFlags";
import { MOCK_CONTENT } from "@/lib/mockContent";
import { ContentStatus } from "@/lib/contentSpec";

type FilterStatus = ContentStatus | "all";

export default function ContentFeedPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("published");
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
        MOCK_CONTENT.forEach((item) => {
            item.tags?.forEach((tag) => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, []);

    const filteredContent = useMemo(() => {
        return MOCK_CONTENT.filter((item) => {
            const matchStatus =
                statusFilter === "all" ? true : item.status === statusFilter;
            const matchTag =
                tagFilter === "all" ? true : item.tags?.includes(tagFilter);
            return matchStatus && matchTag;
        });
    }, [statusFilter, tagFilter]);

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
                    {/* Status Filter */}
                    <div className="flex gap-2 p-1 bg-slate-800 rounded-xl">
                        {(["published", "draft", "archived", "all"] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                                    } capitalize`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Tag Filter */}
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
                                    <div className="absolute top-4 right-4">
                                        <StatusBadge status={item.status} />
                                    </div>
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
                                            {item.status === "published" && item.publishedAt
                                                ? item.publishedAt
                                                : item.createdAt.split("T")[0]}
                                        </time>
                                        <span className="text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
                                            Read Article →
                                        </span>
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
                            Try adjusting your status or tag filters.
                        </p>
                        <button
                            onClick={() => {
                                setStatusFilter("all");
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

function StatusBadge({ status }: { status: ContentStatus }) {
    const colors = {
        published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        archived: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };

    return (
        <span
            className={`px-2 py-1 rounded-md text-xs font-bold border capitalize ${colors[status]}`}
        >
            {status}
        </span>
    );
}
