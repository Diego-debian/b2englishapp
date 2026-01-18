"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useContentStore, ContentItem } from "@/store/contentStore";
import { isFeatureEnabled, FEATURE_FLAGS } from "@/lib/featureFlags";
import { ContentForm } from "@/components/admin/ContentForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TypeBadge } from "@/components/admin/TypeBadge";
import { Button } from "@/components/Button";

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
            <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
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

export default function AdminContentEditPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const hydrated = useContentStore((s) => s.hydrated);
    const items = useContentStore((s) => s.items);
    const getBySlug = useContentStore((s) => s.getBySlug);
    const updateItem = useContentStore((s) => s.updateItem);
    const setStatus = useContentStore((s) => s.setStatus);
    const loadItems = useContentStore((s) => s.loadItems);

    const [item, setItem] = useState<ContentItem | undefined>(undefined);
    const [confirmAction, setConfirmAction] = useState<"publish" | "unpublish" | null>(null);

    // Feature flag guard
    useEffect(() => {
        if (!isFeatureEnabled(FEATURE_FLAGS.ADMIN_CONTENT)) {
            router.replace("/");
        }
    }, [router]);

    // Load items on mount
    useEffect(() => {
        loadItems();
    }, [loadItems]);

    // Get item when hydrated
    useEffect(() => {
        if (hydrated && slug) {
            const found = getBySlug(slug);
            setItem(found);
        }
    }, [hydrated, slug, getBySlug]);

    if (!isFeatureEnabled(FEATURE_FLAGS.ADMIN_CONTENT)) {
        return null;
    }

    if (!hydrated) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-slate-400">Loading...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Item not found</h1>
                <p className="text-slate-500 mb-6">No content with slug &quot;{slug}&quot; exists.</p>
                <Link href="/admin/content">
                    <Button variant="secondary">Back to List</Button>
                </Link>
            </div>
        );
    }

    const handleSubmit = (updated: ContentItem) => {
        // Preserve status when saving
        updateItem(slug, { ...updated, status: item.status });
        router.push("/admin/content");
    };

    const handleCancel = () => {
        router.push("/admin/content");
    };

    const executeConfirmedAction = () => {
        if (confirmAction === "publish") {
            setStatus(slug, "published");
            setItem({ ...item, status: "published" });
        } else if (confirmAction === "unpublish") {
            setStatus(slug, "draft");
            setItem({ ...item, status: "draft" });
        }
        setConfirmAction(null);
    };

    const getItemTitle = (): string => {
        if (item.type === "story") return item.headline;
        if (item.type === "cta") return item.label;
        return item.title;
    };

    const existingSlugs = items.map((i) => i.slug);

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Confirm Modal */}
            {confirmAction && (
                <ConfirmModal
                    isOpen={!!confirmAction}
                    title={confirmAction === "publish" ? "Publish Content?" : "Unpublish Content?"}
                    message={
                        confirmAction === "publish"
                            ? `"${getItemTitle()}" will be visible in the public feed.`
                            : `"${getItemTitle()}" will be hidden from the public feed and moved to drafts.`
                    }
                    confirmLabel={confirmAction === "publish" ? "Publish" : "Unpublish"}
                    confirmVariant={confirmAction === "publish" ? "primary" : "secondary"}
                    onConfirm={executeConfirmedAction}
                    onCancel={() => setConfirmAction(null)}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Edit Content
                        </h1>
                        <TypeBadge type={item.type} />
                        <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-slate-500">
                        Editing: <code className="bg-slate-100 px-1 rounded">{slug}</code>
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/admin/content/${slug}/preview`}>
                        <Button variant="ghost" className="px-4">
                            👁️ Preview
                        </Button>
                    </Link>
                    {item.status === "draft" ? (
                        <Button
                            variant="primary"
                            className="px-4"
                            onClick={() => setConfirmAction("publish")}
                        >
                            Publish
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            className="px-4"
                            onClick={() => setConfirmAction("unpublish")}
                        >
                            Unpublish
                        </Button>
                    )}
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <ContentForm
                    initialData={item}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isEdit
                    existingSlugs={existingSlugs}
                />
            </div>
        </div>
    );
}
