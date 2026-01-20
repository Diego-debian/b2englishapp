import React from "react";
import FeedClient from "./FeedClient";
import { fetchContentListWithMetadata } from "@/lib/contentClient";
import LatestContentBlock from "@/components/content/LatestContentBlock";

export const dynamic = "force-dynamic"; // Use dynamic rendering to allow backend fetch

export default async function ContentFeedPage() {
    // Server-side fetch (with backend/mock fallback)
    const { items, source, timestamp } = await fetchContentListWithMetadata();
    const currentSlugs = items.map(item => item.slug);

    return (
        <>
            <FeedClient initialContent={items} source={source} timestamp={timestamp} />
            <LatestContentBlock
                title="More from the Magazine"
                compact={true}
                excludeSlugs={currentSlugs}
            />
        </>
    );
}
