import { ContentItemV1, isPublished } from "@/lib/contentSpec";
import { MOCK_CONTENT } from "@/lib/mockContent";
import { isContentBackendReadV1Enabled } from "@/lib/featureFlags";

// Standard timeout for public content fetch to avoid hanging SSR
const FETCH_TIMEOUT_MS = 2000;

/**
 * Server-safe adapter to fetch content.
 * 
 * Strategy:
 * 1. Check Feature Flag.
 * 2. If ON, try fetch from Backend API.
 * 3. If OFF, Error, or Timeout -> Fallback to MOCK_CONTENT.
 */

function getApiUrl(): string {
    const base = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";
    return base.endsWith("/") ? base : `${base}/`;
}

interface BackendContentList {
    items: BackendContentItem[];
    total: number;
}

interface BackendContentItem {
    slug: string;
    title: string;
    excerpt?: string;
    body: string;
    status: string;
    published_at?: string;
    created_at: string;
    updated_at: string;
    // Backend doesn't store tags yet, so we might need to mix them in or accept empty
}

// Mapper: Backend -> Frontend Spec
function mapBackendItemToSpec(item: BackendContentItem): ContentItemV1 {
    return {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt || "",
        body: item.body,
        status: item.status as "published" | "draft", // backend enforces published for public
        publishedAt: item.published_at ? item.published_at.split("T")[0] : undefined,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        tags: [], // Tags not yet in backend, safe default
        seoTitle: item.title,
        seoDescription: item.excerpt,
    };
}

export async function fetchContentList(): Promise<ContentItemV1[]> {
    // 1. Feature Flag Check
    if (!isContentBackendReadV1Enabled()) {
        console.log("[ContentClient] Backend Read Disabled -> Using Mock");
        return MOCK_CONTENT.filter(isPublished);
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const url = `${getApiUrl()}content?limit=100`;
        console.log(`[ContentClient] Fetching list from ${url}`);

        const res = await fetch(url, {
            signal: controller.signal,
            cache: 'no-store', // Always fresh for now, or revalidate path logic later
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`Backend returned ${res.status}`);
        }

        const data: BackendContentList = await res.json();
        const mapped = data.items.map(mapBackendItemToSpec);
        console.log(`[ContentClient] Success: Loaded ${mapped.length} items from API`);
        return mapped;

    } catch (error) {
        console.error("[ContentClient] Fetch Error (Fallback to Mock):", error);
        return MOCK_CONTENT.filter(isPublished);
    }
}

export async function fetchContentBySlug(slug: string): Promise<ContentItemV1 | null> {
    // 1. Feature Flag Check
    if (!isContentBackendReadV1Enabled()) {
        const mock = MOCK_CONTENT.find(c => c.slug === slug);
        return mock && isPublished(mock) ? mock : null;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const url = `${getApiUrl()}content/${slug}`;
        console.log(`[ContentClient] Fetching detail for ${slug}`);

        const res = await fetch(url, {
            signal: controller.signal,
            cache: 'no-store',
        });

        clearTimeout(timeoutId);

        if (res.status === 404) {
            return null; // Explicit 404 from backend
        }

        if (!res.ok) {
            throw new Error(`Backend returned ${res.status}`);
        }

        const data: BackendContentItem = await res.json();
        return mapBackendItemToSpec(data);

    } catch (error) {
        console.error(`[ContentClient] Fetch Detail Error for ${slug} (Fallback):`, error);
        // Fallback to mock on network error
        const mock = MOCK_CONTENT.find(c => c.slug === slug);
        return mock && isPublished(mock) ? mock : null;
    }
}
