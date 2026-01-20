"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContentStore } from "@/store/contentStore";
import {
    isFeatureEnabled,
    FEATURE_FLAGS,
    isContentBackendWriteV1Enabled,
    isContentAdminDualModeV1Enabled
} from "@/lib/featureFlags";
import { ContentList } from "@/components/admin/ContentList";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { ds } from "@/lib/designSystem";

// localStorage key for admin mode preference
const ADMIN_MODE_KEY = "b2english-admin-content-mode";
type AdminMode = "demo" | "real";

// Get stored mode preference
function getStoredMode(): AdminMode {
    if (typeof window === "undefined") return "demo";
    const stored = localStorage.getItem(ADMIN_MODE_KEY);
    return stored === "real" ? "real" : "demo";
}

// Set mode preference
function setStoredMode(mode: AdminMode): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ADMIN_MODE_KEY, mode);
}

export default function AdminContentPage() {
    const router = useRouter();
    const hydrated = useContentStore((s) => s.hydrated);
    const items = useContentStore((s) => s.items);
    const loadItems = useContentStore((s) => s.loadItems);
    const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

    // Mounted gate to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);

    // Mode state (only relevant if dual-mode is enabled)
    const [preferredMode, setPreferredMode] = useState<AdminMode>("demo");

    useEffect(() => {
        setMounted(true);
        // Load stored preference on mount
        setPreferredMode(getStoredMode());
    }, []);

    // Feature flag guard + load items (only after mount)
    useEffect(() => {
        if (!mounted) return;

        if (!isFeatureEnabled(FEATURE_FLAGS.ADMIN_CONTENT)) {
            router.replace("/");
            return;
        }

        loadItems();
    }, [mounted, router, loadItems]);

    // Handle mode toggle
    const handleModeToggle = useCallback((newMode: AdminMode) => {
        setPreferredMode(newMode);
        setStoredMode(newMode);
    }, []);

    // Render nothing until mounted (prevents SSR/client mismatch)
    if (!mounted) {
        return null;
    }

    // Feature flag check (evaluated once on client)
    if (!isFeatureEnabled(FEATURE_FLAGS.ADMIN_CONTENT)) {
        return null;
    }

    // Calculate effective mode
    const dualModeEnabled = isContentAdminDualModeV1Enabled();
    const backendWriteEnabled = isContentBackendWriteV1Enabled();

    // Effective mode logic:
    // - If dual-mode OFF => always "demo"
    // - If dual-mode ON but write OFF => forced "demo" (with warning)
    // - If dual-mode ON and write ON => user's preference
    const effectiveMode: AdminMode = dualModeEnabled && backendWriteEnabled
        ? preferredMode
        : "demo";

    const showModeToggle = dualModeEnabled;
    const writeDisabledWarning = dualModeEnabled && !backendWriteEnabled;

    if (!hydrated) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className={ds.layout.container("max-w-6xl mx-auto px-4 py-8")}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className={ds.typo.h1("text-3xl font-black text-slate-900 tracking-tight")}>
                        Content Admin
                    </h1>
                    <p className={ds.typo.subtitle("text-sm text-slate-500 mt-1")}>
                        Manage content items for the feed
                    </p>
                </div>
                <Link href="/admin/content/new">
                    <Button variant="primary" className="px-6">
                        + New Content
                    </Button>
                </Link>
            </div>

            {/* Dual Mode Toggle (only shown if flag enabled) */}
            {showModeToggle && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-700">Data Source:</span>
                            <div className="flex bg-slate-200 rounded-lg p-0.5">
                                <button
                                    onClick={() => handleModeToggle("demo")}
                                    disabled={writeDisabledWarning}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${effectiveMode === "demo"
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                        } ${writeDisabledWarning ? "cursor-not-allowed" : ""}`}
                                >
                                    📁 Demo (localStorage)
                                </button>
                                <button
                                    onClick={() => handleModeToggle("real")}
                                    disabled={!backendWriteEnabled}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${effectiveMode === "real"
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                        } ${!backendWriteEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    🌐 Real (Backend API)
                                </button>
                            </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${effectiveMode === "demo"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                            {effectiveMode === "demo" ? "Demo Mode" : "Production Mode"}
                        </span>
                    </div>

                    {/* Warning if backend write is disabled */}
                    {writeDisabledWarning && (
                        <p className="text-xs text-amber-700 mt-2">
                            ⚠️ Backend write is disabled. Enable <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_WRITE_V1</code> to use Real mode.
                        </p>
                    )}
                </div>
            )}

            {/* Info Banner */}
            <div className={`border rounded-lg px-4 py-3 mb-6 ${effectiveMode === "demo"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-green-50 border-green-200"
                }`}>
                <p className={`text-sm ${effectiveMode === "demo" ? "text-blue-800" : "text-green-800"}`}>
                    {effectiveMode === "demo" ? (
                        <>
                            <strong>📁 Demo Mode:</strong> Changes are stored in your browser&apos;s localStorage.
                            To persist permanently, export and commit to <code className="bg-blue-100 px-1 rounded">content.json</code>.
                        </>
                    ) : (
                        <>
                            <strong>🌐 Production Mode:</strong> Changes are saved directly to the backend database.
                        </>
                    )}
                </p>
            </div>

            {/* List */}
            <ContentList items={items} filter={filter} onFilterChange={setFilter} />
        </div>
    );
}

