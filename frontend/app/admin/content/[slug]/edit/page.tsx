"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useContentStore, ContentItem } from "@/store/contentStore";
import {
    isFeatureEnabled,
    FEATURE_FLAGS,
    isContentBackendWriteV1Enabled,
    isContentAdminDualModeV1Enabled
} from "@/lib/featureFlags";
import { ContentForm } from "@/components/admin/ContentForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TypeBadge } from "@/components/admin/TypeBadge";
import { Button } from "@/components/Button";
import { ds } from "@/lib/designSystem";
import { updateContent, hasAuthToken, AdminContentError } from "@/lib/adminContentClient";

// localStorage key for admin mode preference (shared with list page)
const ADMIN_MODE_KEY = "b2english-admin-content-mode";
type AdminMode = "demo" | "real";

function getStoredMode(): AdminMode {
    if (typeof window === "undefined") return "demo";
    const stored = localStorage.getItem(ADMIN_MODE_KEY);
    return stored === "real" ? "real" : "demo";
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
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!mounted || !isFeatureEnabled(FEATURE_FLAGS.ADMIN_CONTENT)) {
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
            <div className={ds.layout.container("max-w-2xl mx-auto px-4 py-8 text-center")}>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Item not found</h1>
                <p className="text-slate-500 mb-6">No content with slug &quot;{slug}&quot; exists.</p>
                <Link href="/admin/content">
                    <Button variant="secondary">Back to List</Button>
                </Link>
            </div>
        );
    }

    // Calculate effective mode
    const dualModeEnabled = isContentAdminDualModeV1Enabled();
    const backendWriteEnabled = isContentBackendWriteV1Enabled();
    const preferredMode = getStoredMode();
    const effectiveMode: AdminMode = dualModeEnabled && backendWriteEnabled
        ? preferredMode
        : "demo";

    const handleSubmit = async (updated: ContentItem) => {
        setError(null);
        setWarning(null);
        setSaving(true);

        // Preserve status when saving
        const finalItem = { ...updated, status: item.status };

        // Demo mode: save to localStorage only
        if (effectiveMode === "demo") {
            updateItem(slug, finalItem);
            setSuccess("✅ Changes saved successfully.");
            setSaving(false);
            setTimeout(() => router.push("/admin/content"), 1200);
            return;
        }

        // Real mode: attempt backend write
        // Only "text" type is supported for backend
        if (item.type !== "text") {
            setWarning(`Type "${item.type}" is not supported for backend. Saved locally.`);
            updateItem(slug, finalItem);
            setSaving(false);
            setTimeout(() => router.push("/admin/content"), 1500);
            return;
        }

        // Check auth
        if (!hasAuthToken()) {
            setWarning("Not authenticated. Changes saved locally. Please login for Real mode.");
            updateItem(slug, finalItem);
            setSaving(false);
            setTimeout(() => router.push("/admin/content"), 1500);
            return;
        }

        try {
            await updateContent(slug, {
                title: (finalItem as any).title,
                body: (finalItem as any).body,
                excerpt: (finalItem as any).excerpt,
                status: finalItem.status
            });
            // Also save locally for immediate UI consistency
            updateItem(slug, finalItem);
            setSuccess("✅ Changes saved successfully.");
            setSaving(false);
            setTimeout(() => router.push("/admin/content"), 1200);
        } catch (err) {
            const apiErr = err as AdminContentError;
            console.error("[AdminContentEdit] Backend error:", apiErr);
            setError(`Backend error: ${apiErr.message}. Saved locally as fallback.`);
            updateItem(slug, finalItem);
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push("/admin/content");
    };

    const executeConfirmedAction = () => {
        if (confirmAction === "publish") {
            setStatus(slug, "published");
            setItem({ ...item, status: "published" });
            setSuccess("✅ Published successfully!");
        } else if (confirmAction === "unpublish") {
            setStatus(slug, "draft");
            setItem({ ...item, status: "draft" });
            setSuccess("✅ Moved to drafts.");
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
        <div className={ds.layout.container("max-w-2xl mx-auto px-4 py-8")}>
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
                        <h1 className={ds.typo.h1("text-3xl font-black text-slate-900 tracking-tight")}>
                            Edit Content
                        </h1>
                        <TypeBadge type={item.type} />
                        <StatusBadge status={item.status} />
                        <span className={`text-xs px-2 py-1 rounded-full ${effectiveMode === "demo"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                            }`}>
                            {effectiveMode === "demo" ? "Demo" : "Real"}
                        </span>
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

            {/* Success */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
                    <p className="text-sm text-green-800">{success}</p>
                </div>
            )}

            {/* Warning */}
            {warning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
                    <p className="text-sm text-amber-800">⚠️ {warning}</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                    <p className="text-sm text-red-800">❌ {error}</p>
                </div>
            )}

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

