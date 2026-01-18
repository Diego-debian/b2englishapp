"use client";

import React from "react";
import Link from "next/link";
import type { ContentItem } from "@/store/contentStore";
import { useContentStore } from "@/store/contentStore";
import { StatusBadge } from "./StatusBadge";
import { TypeBadge } from "./TypeBadge";
import { Button } from "@/components/Button";

interface ContentListProps {
    items: ContentItem[];
    filter: "all" | "draft" | "published";
    onFilterChange: (filter: "all" | "draft" | "published") => void;
}

export function ContentList({ items, filter, onFilterChange }: ContentListProps) {
    const setStatus = useContentStore((s) => s.setStatus);

    const getTitle = (item: ContentItem): string => {
        if (item.type === "story") return item.headline;
        if (item.type === "cta") return item.label;
        return item.title;
    };

    const filteredItems = items.filter((item) => {
        if (filter === "all") return true;
        return item.status === filter;
    });

    return (
        <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(["all", "draft", "published"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => onFilterChange(f)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === f
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {f === "all" ? "All" : f === "draft" ? "Drafts" : "Published"}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                            <th className="text-left px-4 py-3 font-semibold text-slate-600">Slug</th>
                            <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr key={item.slug} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                                        {getTitle(item)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <TypeBadge type={item.type} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">
                                            {item.slug}
                                        </code>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/content/${item.slug}/preview`}>
                                                <Button variant="ghost" className="text-xs px-3 py-1">
                                                    Preview
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/content/${item.slug}/edit`}>
                                                <Button variant="secondary" className="text-xs px-3 py-1">
                                                    Edit
                                                </Button>
                                            </Link>
                                            {item.status === "draft" ? (
                                                <Button
                                                    variant="primary"
                                                    className="text-xs px-3 py-1"
                                                    onClick={() => setStatus(item.slug, "published")}
                                                >
                                                    Publish
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    className="text-xs px-3 py-1"
                                                    onClick={() => setStatus(item.slug, "draft")}
                                                >
                                                    Unpublish
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
