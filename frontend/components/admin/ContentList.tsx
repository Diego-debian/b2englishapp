"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { ContentItem, ContentStatus } from "@/store/contentStore";
import { useContentStore } from "@/store/contentStore";
import { StatusBadge } from "./StatusBadge";
import { TypeBadge } from "./TypeBadge";
import { Button } from "@/components/Button";

interface ContentListProps {
    items: ContentItem[];
    filter: "all" | "draft" | "published";
    onFilterChange: (filter: "all" | "draft" | "published") => void;
}

// Confirm Modal Component
function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel,
    confirmVariant = "primary",
    onConfirm,
    onCancel,
}: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant?: "primary" | "secondary" | "ghost";
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancel}
            />
            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel} className="px-4">
                        Cancel
                    </Button>
                    <Button variant={confirmVariant} onClick={onConfirm} className="px-4">
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

import { ds } from "@/lib/designSystem";

export function ContentList({ items, filter, onFilterChange }: ContentListProps) {
    const setStatus = useContentStore((s) => s.setStatus);
    const deleteItem = useContentStore((s) => s.deleteItem);

    // Confirm modal state
    const [confirmAction, setConfirmAction] = useState<{
        type: "publish" | "unpublish" | "delete";
        slug: string;
        title: string;
    } | null>(null);

    const getTitle = (item: ContentItem): string => {
        if (item.type === "story") return item.headline;
        if (item.type === "cta") return item.label;
        return item.title;
    };

    const filteredItems = items.filter((item) => {
        if (filter === "all") return true;
        return item.status === filter;
    });

    const handleStatusChange = (slug: string, newStatus: ContentStatus, itemTitle: string) => {
        setConfirmAction({
            type: newStatus === "published" ? "publish" : "unpublish",
            slug,
            title: itemTitle,
        });
    };

    const handleDelete = (slug: string, itemTitle: string) => {
        setConfirmAction({
            type: "delete",
            slug,
            title: itemTitle,
        });
    };

    const executeConfirmedAction = () => {
        if (!confirmAction) return;

        if (confirmAction.type === "publish") {
            setStatus(confirmAction.slug, "published");
        } else if (confirmAction.type === "unpublish") {
            setStatus(confirmAction.slug, "draft");
        } else if (confirmAction.type === "delete") {
            deleteItem(confirmAction.slug);
        }
        setConfirmAction(null);
    };

    const getConfirmModalProps = () => {
        if (!confirmAction) return null;

        switch (confirmAction.type) {
            case "publish":
                return {
                    title: "Publish Content?",
                    message: `"${confirmAction.title}" will be visible in the public feed.`,
                    confirmLabel: "Publish",
                    confirmVariant: "primary" as const,
                };
            case "unpublish":
                return {
                    title: "Unpublish Content?",
                    message: `"${confirmAction.title}" will be hidden from the public feed and moved to drafts.`,
                    confirmLabel: "Unpublish",
                    confirmVariant: "secondary" as const,
                };
            case "delete":
                return {
                    title: "Delete Content?",
                    message: `"${confirmAction.title}" will be permanently deleted. This cannot be undone.`,
                    confirmLabel: "Delete",
                    confirmVariant: "primary" as const,
                };
        }
    };

    // Empty state for when no items exist at all
    if (items.length === 0) {
        return (
            <div className="space-y-4">
                {/* Filter Tabs (disabled) */}
                <div className="flex gap-2">
                    {(["all", "draft", "published"] as const).map((f) => (
                        <button
                            key={f}
                            disabled
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed"
                        >
                            {f === "all" ? "All" : f === "draft" ? "Drafts" : "Published"}
                        </button>
                    ))}
                </div>

                {/* Empty State */}
                <div className={ds.state.empty("rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center")}>
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className={ds.typo.h2("text-lg font-bold text-slate-900 mb-2")}>No content yet</h3>
                    <p className={ds.typo.body("text-sm text-slate-500 mb-6 max-w-sm mx-auto")}>
                        Create your first piece of content to get started. You can add videos, articles, stories, or calls to action.
                    </p>
                    <Link href="/admin/content/new">
                        <Button variant="primary" className="px-6">
                            + Create First Content
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Confirm Modal */}
            {confirmAction && (
                <ConfirmModal
                    isOpen={!!confirmAction}
                    onConfirm={executeConfirmedAction}
                    onCancel={() => setConfirmAction(null)}
                    {...getConfirmModalProps()!}
                />
            )}

            {/* Filter Tabs */}
            <div className={ds.filter.group("flex gap-2")}>
                {(["all", "draft", "published"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => onFilterChange(f)}
                        className={filter === f
                            ? ds.filter.active("px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-900 text-white")
                            : ds.filter.inactive("px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-slate-100 text-slate-600 hover:bg-slate-200")
                        }
                    >
                        {f === "all" ? "All" : f === "draft" ? "Drafts" : "Published"}
                        {f !== "all" && (
                            <span className="ml-1.5 text-xs opacity-70">
                                ({items.filter((i) => i.status === f).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className={ds.table.container("overflow-hidden rounded-xl border border-slate-200 bg-white")}>
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className={ds.table.th("text-left px-4 py-3 font-semibold text-slate-600")}>Title</th>
                            <th className={ds.table.th("text-left px-4 py-3 font-semibold text-slate-600")}>Type</th>
                            <th className={ds.table.th("text-left px-4 py-3 font-semibold text-slate-600")}>Status</th>
                            <th className={ds.table.th("text-left px-4 py-3 font-semibold text-slate-600")}>Slug</th>
                            <th className={ds.table.th("text-right px-4 py-3 font-semibold text-slate-600")}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center">
                                    <div className={ds.state.empty("text-slate-400")}>
                                        <span className={ds.typo.h2("text-2xl block mb-2")}>🔍</span>
                                        <p className={ds.typo.body("inline")}>
                                            No {filter === "draft" ? "drafts" : filter === "published" ? "published items" : "items"} found.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr key={item.slug} className={ds.table.tr("hover:bg-slate-50 transition-colors")}>
                                    <td className={ds.table.td("px-4 py-3 font-medium text-slate-900 max-w-xs truncate")}>
                                        {getTitle(item)}
                                    </td>
                                    <td className={ds.table.td("px-4 py-3")}>
                                        <TypeBadge type={item.type} />
                                    </td>
                                    <td className={ds.table.td("px-4 py-3")}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className={ds.table.td("px-4 py-3")}>
                                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">
                                            {item.slug}
                                        </code>
                                    </td>
                                    <td className={ds.table.td("px-4 py-3")}>
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
                                                    onClick={() => handleStatusChange(item.slug, "published", getTitle(item))}
                                                >
                                                    Publish
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    className="text-xs px-3 py-1"
                                                    onClick={() => handleStatusChange(item.slug, "draft", getTitle(item))}
                                                >
                                                    Unpublish
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                className="text-xs px-2 py-1 text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(item.slug, getTitle(item))}
                                            >
                                                🗑️
                                            </Button>
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
