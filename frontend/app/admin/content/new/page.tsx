"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContentStore, ContentItem } from "@/store/contentStore";
import { isFeatureEnabled, FEATURE_FLAGS } from "@/lib/featureFlags";
import { ContentForm } from "@/components/admin/ContentForm";
import { ds } from "@/lib/designSystem";

export default function AdminContentNewPage() {
    const router = useRouter();
    const hydrated = useContentStore((s) => s.hydrated);
    const items = useContentStore((s) => s.items);
    const addItem = useContentStore((s) => s.addItem);
    const loadItems = useContentStore((s) => s.loadItems);

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

    const handleSubmit = (item: ContentItem) => {
        addItem(item);
        router.push("/admin/content");
    };

    const handleCancel = () => {
        router.push("/admin/content");
    };

    const existingSlugs = items.map((i) => i.slug);

    return (
        <div className={ds.layout.container("max-w-2xl mx-auto px-4 py-8")}>
            {/* Header */}
            <div className="mb-8">
                <h1 className={ds.typo.h1("text-3xl font-black text-slate-900 tracking-tight")}>
                    New Content
                </h1>
                <p className={ds.typo.subtitle("text-sm text-slate-500 mt-1")}>
                    Create a new content item for the feed
                </p>
            </div>

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
