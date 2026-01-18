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

    const handlePublish = () => {
        setStatus(slug, "published");
        setItem({ ...item, status: "published" });
    };

    const handleUnpublish = () => {
        setStatus(slug, "draft");
        setItem({ ...item, status: "draft" });
    };

    const existingSlugs = items.map((i) => i.slug);

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
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
                        <Button variant="primary" className="px-4" onClick={handlePublish}>
                            Publish
                        </Button>
                    ) : (
                        <Button variant="secondary" className="px-4" onClick={handleUnpublish}>
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
