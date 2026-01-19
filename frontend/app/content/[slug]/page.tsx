import React from "react";
import { notFound } from "next/navigation";
import ContentDetailClient from "./ContentDetailClient";
import { fetchContentBySlug } from "@/lib/contentClient";

export const dynamic = "force-dynamic";

export default async function ContentDetailPage(props: any) {
    const params = await props.params;
    const { slug } = params || {};

    // Server-side fetch (fallback included in adapter)
    const item = await fetchContentBySlug(slug);

    if (!item) {
        return notFound();
    }

    return <ContentDetailClient item={item} />;
}
