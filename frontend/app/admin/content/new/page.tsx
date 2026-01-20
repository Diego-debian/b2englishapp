"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContentStore, ContentItem } from "@/store/contentStore";
import {
    isFeatureEnabled,
    FEATURE_FLAGS,
    isContentBackendWriteV1Enabled,
    isContentAdminDualModeV1Enabled
} from "@/lib/featureFlags";
import { ContentForm } from "@/components/admin/ContentForm";
import { AdminSyncStatus, SyncStatus } from "@/components/admin/AdminSyncStatus";
import { ds } from "@/lib/designSystem";
import { createContent, hasAuthToken, AdminContentError } from "@/lib/adminContentClient";

// localStorage key for admin mode preference (shared with list page)
const ADMIN_MODE_KEY = "b2english-admin-content-mode";
type AdminMode = "demo" | "real";

function getStoredMode(): AdminMode {
    if (typeof window === "undefined") return "demo";
    const stored = localStorage.getItem(ADMIN_MODE_KEY);
    return stored === "real" ? "real" : "demo";
}

export default function AdminContentNewPage() {
    const router = useRouter();
    const hydrated = useContentStore((s) => s.hydrated);
    const items = useContentStore((s) => s.items);
    const addItem = useContentStore((s) => s.addItem);
    const loadItems = useContentStore((s) => s.loadItems);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<"draft" | "published">("draft");
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
    const [syncMessage, setSyncMessage] = useState<string | undefined>(undefined);
    // Store payload for retry sync
    const [lastSavedPayload, setLastSavedPayload] = useState<{
        slug: string;
        title: string;
        body: string;
        excerpt?: string;
        status: "draft" | "published";
    } | null>(null);

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

    // Calculate effective mode
    const dualModeEnabled = isContentAdminDualModeV1Enabled();
    const backendWriteEnabled = isContentBackendWriteV1Enabled();
    const preferredMode = getStoredMode();
    const effectiveMode: AdminMode = dualModeEnabled && backendWriteEnabled
        ? preferredMode
        : "demo";

    const handleSubmit = async (item: ContentItem) => {
        setError(null);
        setWarning(null);
        setSuccess(null);
        setSaving(true);

        // Apply selected status to item
        const itemWithStatus = { ...item, status: selectedStatus };

        // Demo mode: save to localStorage only
        if (effectiveMode === "demo") {
            addItem(itemWithStatus);
            const msg = selectedStatus === "published" ? "✅ Published successfully!" : "✅ Saved as draft.";
            setSuccess(msg);
            setSyncStatus("saved_local");
            setSaving(false);
            setTimeout(() => router.push("/admin/content"), 1200);
            return;
        }

        // Real mode: attempt backend write
        // Only "text" type is supported for backend
        if (item.type !== "text") {
            setWarning(`Type "${item.type}" is not supported for backend. Saved locally.`);
            addItem(item);
            setSaving(false);
            setTimeout(() => router.push("/admin/content"), 1500);
            return;
        }

        // Check auth
        if (!hasAuthToken()) {
            setWarning("Not authenticated. Content saved locally. Please login for Real mode.");
            addItem(itemWithStatus);
            setSyncStatus("saved_local");
            setSyncMessage("no auth");
            // Store payload for potential retry after login
            setLastSavedPayload({
                slug: item.slug,
                title: item.title,
                body: item.body,
                excerpt: item.excerpt,
                status: selectedStatus
            });
            setSaving(false);
            return;
        }

        try {
            await createContent({
                slug: item.slug,
                title: item.title,
                body: item.body,
                excerpt: item.excerpt,
                status: selectedStatus
            });
            // Also save locally for immediate UI consistency
            addItem(itemWithStatus);
            const msg = selectedStatus === "published" ? "✅ Published successfully!" : "✅ Saved as draft.";
            setSuccess(msg);
            setSyncStatus("synced");
            setSaving(false);
            setTimeout(() => router.push("/admin/content"), 1200);
        } catch (err) {
            const apiErr = err as AdminContentError;
            console.error("[AdminContentNew] Backend error:", apiErr);
            // Categorize error messages
            let errorMsg = "Backend error";
            if (apiErr.status === 401) {
                errorMsg = "Authentication failed. Please login again.";
            } else if (apiErr.status === 409) {
                errorMsg = "Content already exists with this slug.";
            } else if (apiErr.status >= 500) {
                errorMsg = "Server error. Try again later.";
            } else {
                errorMsg = apiErr.message;
            }
            setError(`${errorMsg} Saved locally as fallback.`);
            addItem(itemWithStatus);
            setSyncStatus("saved_local");
            setSyncMessage(apiErr.status === 401 ? "auth expired" : "backend error");
            // Store payload for retry
            setLastSavedPayload({
                slug: item.slug,
                title: item.title,
                body: item.body,
                excerpt: item.excerpt,
                status: selectedStatus
            });
            setSaving(false);
        }
    };

    // Retry sync handler
    const handleRetrySync = async () => {
        if (!lastSavedPayload) return;

        setError(null);
        setSuccess(null);
        setSyncStatus("syncing");
        setSyncMessage(undefined);

        try {
            await createContent(lastSavedPayload);
            setSuccess("✅ Synced to backend successfully!");
            setSyncStatus("synced");
            setLastSavedPayload(null);
            setTimeout(() => router.push("/admin/content"), 1200);
        } catch (err) {
            const apiErr = err as AdminContentError;
            console.error("[AdminContentNew] Retry sync error:", apiErr);
            // Categorize error
            let errorMsg = "Sync failed";
            let syncMsg = "backend error";
            if (apiErr.status === 401) {
                errorMsg = "Authentication expired. Please login again.";
                syncMsg = "auth expired";
            } else if (apiErr.status === 409) {
                errorMsg = "Content already exists on server.";
                syncMsg = "conflict";
            } else if (apiErr.status >= 500) {
                errorMsg = "Server unavailable. Try again later.";
                syncMsg = "server error";
            }
            setError(errorMsg);
            setSyncStatus("saved_local");
            setSyncMessage(syncMsg);
        }
    };

    const handleCancel = () => {
        router.push("/admin/content");
    };

    const existingSlugs = items.map((i) => i.slug);

    return (
        <div className={ds.layout.container("max-w-2xl mx-auto px-4 py-8")}>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className={ds.typo.h1("text-3xl font-black text-slate-900 tracking-tight")}>
                        New Content
                    </h1>
                </div>
                <p className={ds.typo.subtitle("text-sm text-slate-500 mt-1 mb-2")}>
                    Create a new content item for the feed
                </p>
                {/* Sync Status */}
                <AdminSyncStatus
                    mode={effectiveMode}
                    writeEnabled={backendWriteEnabled}
                    syncStatus={syncStatus}
                    message={syncMessage}
                    actionLabel={syncStatus === "saved_local" && effectiveMode === "real" ? "🔄 Retry sync" : undefined}
                    onAction={syncStatus === "saved_local" && effectiveMode === "real" ? handleRetrySync : undefined}
                    actionDisabled={!hasAuthToken()}
                    actionHint={!hasAuthToken() ? "Login required" : undefined}
                />
            </div>

            {/* Status Selector */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">Save as:</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="draft"
                            checked={selectedStatus === "draft"}
                            onChange={() => setSelectedStatus("draft")}
                            className="w-4 h-4 text-slate-600"
                        />
                        <span className="text-sm text-slate-700">📝 Draft</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value="published"
                            checked={selectedStatus === "published"}
                            onChange={() => setSelectedStatus("published")}
                            className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm text-slate-700">🌐 Published</span>
                    </label>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    {selectedStatus === "draft"
                        ? "Draft items are not visible to the public."
                        : "Published items are visible in the public feed immediately."}
                </p>
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
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    existingSlugs={existingSlugs}
                />
            </div>
        </div>
    );
}

