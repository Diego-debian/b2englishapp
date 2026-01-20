/**
 * Admin Content API Client
 * 
 * Handles POST/PUT operations to backend /admin/content endpoints.
 * Uses existing auth token from storage.
 */

import { storage } from "./storage";

// Response type from backend
export interface ContentItemAdmin {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    body: string;
    status: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

// Payload for creating content
export interface ContentCreatePayload {
    slug: string;
    title: string;
    body: string;
    excerpt?: string;
    status?: "draft" | "published";
}

// Payload for updating content
export interface ContentUpdatePayload {
    title?: string;
    body?: string;
    excerpt?: string;
    status?: "draft" | "published" | "archived";
}

// Error type
export interface AdminContentError {
    status: number;
    message: string;
    detail?: unknown;
}

function getApiUrl(): string {
    const raw = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();
    if (!raw) {
        throw { status: 0, message: "NEXT_PUBLIC_API_URL not configured" } as AdminContentError;
    }
    return raw.endsWith("/") ? raw : raw + "/";
}

function getAuthToken(): string | null {
    const st = storage.read();
    return st?.token ?? null;
}

/**
 * POST /admin/content - Create new content
 */
export async function createContent(
    payload: ContentCreatePayload
): Promise<ContentItemAdmin> {
    const token = getAuthToken();

    if (!token) {
        throw {
            status: 401,
            message: "Not authenticated. Please login to use Real mode."
        } as AdminContentError;
    }

    const url = `${getApiUrl()}admin/content`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw {
            status: res.status,
            message: data?.detail || data?.message || `Backend returned ${res.status}`,
            detail: data
        } as AdminContentError;
    }

    return data as ContentItemAdmin;
}

/**
 * PUT /admin/content/{slug} - Update existing content
 */
export async function updateContent(
    slug: string,
    payload: ContentUpdatePayload
): Promise<ContentItemAdmin> {
    const token = getAuthToken();

    if (!token) {
        throw {
            status: 401,
            message: "Not authenticated. Please login to use Real mode."
        } as AdminContentError;
    }

    const url = `${getApiUrl()}admin/content/${encodeURIComponent(slug)}`;

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw {
            status: res.status,
            message: data?.detail || data?.message || `Backend returned ${res.status}`,
            detail: data
        } as AdminContentError;
    }

    return data as ContentItemAdmin;
}

/**
 * Check if auth token is available
 */
export function hasAuthToken(): boolean {
    return getAuthToken() !== null;
}

// Response type for content list
export interface ContentListResponse {
    items: ContentItemAdmin[];
    total: number;
}

/**
 * GET /content - List content (public endpoint, uses same types)
 * Uses public endpoint since admin list needs all statuses eventually
 * but for now reuses public endpoint structure
 */
export async function listContent(): Promise<ContentItemAdmin[]> {
    const url = `${getApiUrl()}content`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw {
            status: res.status,
            message: data?.detail || data?.message || `Backend returned ${res.status}`,
            detail: data
        } as AdminContentError;
    }

    // Backend returns { items: [...], total: N }
    const list = data as ContentListResponse;
    return list.items ?? [];
}

/**
 * GET /content/{slug} - Get single content item (public endpoint)
 */
export async function getContent(slug: string): Promise<ContentItemAdmin | null> {
    const url = `${getApiUrl()}content/${encodeURIComponent(slug)}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (res.status === 404) {
        return null;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw {
            status: res.status,
            message: data?.detail || data?.message || `Backend returned ${res.status}`,
            detail: data
        } as AdminContentError;
    }

    return data as ContentItemAdmin;
}
