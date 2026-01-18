"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useContentStore, ContentItem } from "@/store/contentStore";
import { isFeatureEnabled, FEATURE_FLAGS } from "@/lib/featureFlags";
import { ContentPreview } from "@/components/admin/ContentPreview";
import { Button } from "@/components/Button";

export default function AdminContentPreviewPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const hydrated = useContentStore((s) => s.hydrated);
    const getBySlug = useContentStore((s) => s.getBySlug);
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

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <ContentPreview item={item} showBanner />
        </div>
    );
}
