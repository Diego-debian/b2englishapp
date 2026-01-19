"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContentStore } from "@/store/contentStore";
import { isFeatureEnabled, FEATURE_FLAGS } from "@/lib/featureFlags";
import { ContentList } from "@/components/admin/ContentList";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";

export default function AdminContentPage() {
    const router = useRouter();
    const hydrated = useContentStore((s) => s.hydrated);
    const items = useContentStore((s) => s.items);
    const loadItems = useContentStore((s) => s.loadItems);
    const [filter, setFilter] = useState<"all" | "draft" | "published">("all");

    // Mounted gate to prevent hydration mismatch
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    // Render nothing until mounted (prevents SSR/client mismatch)
    if (!mounted) {
        return null;
    }

    // Feature flag check (evaluated once on client)
    if (!isFeatureEnabled(FEATURE_FLAGS.ADMIN_CONTENT)) {
        return null;
    }

    if (!hydrated) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Content Admin
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage content items for the feed
                    </p>
                </div>
                <Link href="/admin/content/new">
                    <Button variant="primary" className="px-6">
                        + New Content
                    </Button>
                </Link>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
                <p className="text-sm text-blue-800">
                    <strong>⚠️ Beta:</strong> Changes are stored in your browser&apos;s localStorage.
                    To persist permanently, export and commit to <code className="bg-blue-100 px-1 rounded">content.json</code>.
                </p>
            </div>

            {/* List */}
            <ContentList items={items} filter={filter} onFilterChange={setFilter} />
        </div>
    );
}
