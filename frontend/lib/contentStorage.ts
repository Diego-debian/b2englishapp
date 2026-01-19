import { ContentItemV1, ContentStatus as SpecStatus } from "./contentSpec";
import { ContentItem, TextItem, VideoItem, StoryItem } from "@/store/contentStore";

/**
 * Key used by the Admin Content Store (@/store/contentStore) via Zustand persist.
 */
const STORAGE_KEY = "b2english-content";

/**
 * Zustand persist wraps state in { state: ... , version: ... }
 */
interface ZustandStorage {
    state: {
        items: ContentItem[];
    };
    version: number;
}

/**
 * Retrieves a snapshot of PUBLISHED content from localStorage (Admin Store).
 * This runs client-side only.
 */
export const getPublishedContentSnapshot = (): ContentItemV1[] => {
    if (typeof window === "undefined") return [];

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw) as ZustandStorage;
        const items = parsed.state?.items || [];

        return items
            .filter((item) => item.status === "published")
            .map(mapStoreItemToSpec);
    } catch (error) {
        console.warn("Failed to load content snapshot from localStorage:", error);
        return [];
    }
};

/**
 * Maps detailed Admin Content types to the generic ContentItemV1 spec.
 * Synthesizes missing fields (like createdAt) using best-effort fallbacks.
 */
function mapStoreItemToSpec(item: ContentItem): ContentItemV1 {
    const now = new Date().toISOString();
    // Admin store uses snake_case and lacks createdAt/updatedAt
    // We use published_at as the primary date source
    const date = item.published_at || now;

    let body = "";
    let typePrefix = "";

    // Strategy to extract body content based on type
    switch (item.type) {
        case "text":
            body = (item as TextItem).body;
            break;
        case "video":
            const v = item as VideoItem;
            typePrefix = "[Video] ";
            body = `**Video ID:** ${v.video_id}\n\n${v.description || ""}`;
            break;
        case "story":
            body = (item as StoryItem).body || "";
            typePrefix = "[Story] ";
            break;
        case "cta":
            body = `CTA: ${(item as any).label} -> ${(item as any).target}`;
            break;
        default:
            body = "";
    }

    // Ensure unique ID if not present (slug is usually unique enough)
    const title = (item as any).title || (item as any).headline || (item as any).label || "Untitled";

    return {
        slug: item.slug,
        title: `${typePrefix}${title}`,
        excerpt: (item as any).excerpt || (item as any).description || "",
        body: body,
        status: item.status as SpecStatus,
        createdAt: date,
        updatedAt: date,
        publishedAt: item.published_at || undefined,
        // Try to preserve type as a tag
        tags: [item.type, (item as any).level, (item as any).tense].filter(Boolean) as string[],
    };
}
