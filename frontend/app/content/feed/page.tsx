import React from "react";
import FeedClient from "./FeedClient";
import { fetchContentList } from "@/lib/contentClient";

export const dynamic = "force-dynamic"; // Use dynamic rendering to allow backend fetch

export default async function ContentFeedPage() {
    // Server-side fetch (with backend/mock fallback)
    const items = await fetchContentList();

    return <FeedClient initialContent={items} />;
}
