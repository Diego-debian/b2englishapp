/**
 * Content Spec v1 Definition
 * Source of truth: docs/content-spec-v1.md
 */

export const CONTENT_SPEC_VERSION = 1 as const;

export type ContentStatus = "draft" | "published" | "archived";

export interface ContentItemV1 {
    // Required fields
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    status: ContentStatus;
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601

    // Optional fields
    id?: string;
    publishedAt?: string; // ISO 8601, required if status is 'published'
    tags?: string[];
    coverImageUrl?: string;
    readingTimeMinutes?: number;
    seoTitle?: string;
    seoDescription?: string;
}

/**
 * Helper to check if content is published.
 */
export const isPublished = (item: ContentItemV1): boolean => {
    return item.status === "published";
};
