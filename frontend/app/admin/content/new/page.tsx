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
        setSaving(true);

        // Demo mode: save to localStorage only
        if (effectiveMode === "demo") {
            addItem(item);
            router.push("/admin/content");
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
            addItem(item);
            setSaving(false);
            setTimeout(() => router.push("/admin/content"), 1500);
            return;
        }

        try {
            await createContent({
                slug: item.slug,
                title: item.title,
                body: item.body,
                excerpt: item.excerpt,
                status: item.status
            });
            // Also save locally for immediate UI consistency
            addItem(item);
            router.push("/admin/content");
        } catch (err) {
            const apiErr = err as AdminContentError;
            console.error("[AdminContentNew] Backend error:", apiErr);
            setError(`Backend error: ${apiErr.message}. Saved locally as fallback.`);
            addItem(item);
            setSaving(false);
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
                    <span className={`text-xs px-2 py-1 rounded-full ${effectiveMode === "demo"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                        }`}>
                        {effectiveMode === "demo" ? "Demo" : "Real"}
                    </span>
                </div>
                <p className={ds.typo.subtitle("text-sm text-slate-500 mt-1")}>
                    Create a new content item for the feed
                </p>
            </div>

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

