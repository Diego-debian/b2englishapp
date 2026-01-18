/**
 * Content store for Admin Content UI.
 * Isolated from core stores (authStore, practiceStore).
 * Persists to localStorage for demo purposes.
 * 
 * LIMITATION: Data is stored in browser localStorage only.
 * Changes are lost when localStorage is cleared.
 * For production, migrate to backend API.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import initialData from "@/data/content.json";

// Content item types
export type ContentType = "video" | "text" | "story" | "cta";
export type ContentStatus = "draft" | "published";

export interface ContentItemBase {
    type: ContentType;
    slug: string;
    status: ContentStatus;
    published_at: string | null;
}

export interface VideoItem extends ContentItemBase {
    type: "video";
    title: string;
    video_id: string;
    description?: string;
    level?: string;
    tense?: string;
}

export interface TextItem extends ContentItemBase {
    type: "text";
    title: string;
    body: string;
    excerpt?: string;
    level?: string;
    tense?: string;
    reading_time?: number;
}

export interface StoryItem extends ContentItemBase {
    type: "story";
    headline: string;
    body?: string;
    highlight?: boolean;
    level?: string;
}

export interface CtaItem extends ContentItemBase {
    type: "cta";
    label: string;
    action: "internal_link" | "external_link" | "practice";
    target: string;
    description?: string;
    style?: "primary" | "secondary" | "subtle";
}

export type ContentItem = VideoItem | TextItem | StoryItem | CtaItem;

interface ContentState {
    items: ContentItem[];
    hydrated: boolean;

    // Actions
    loadItems: () => void;
    addItem: (item: ContentItem) => void;
    updateItem: (slug: string, updates: Partial<ContentItem>) => void;
    deleteItem: (slug: string) => void;
    getBySlug: (slug: string) => ContentItem | undefined;
    setStatus: (slug: string, status: ContentStatus) => void;
    slugExists: (slug: string, excludeSlug?: string) => boolean;
}

export const useContentStore = create<ContentState>()(
    persist(
        (set, get) => ({
            items: [],
            hydrated: false,

            loadItems: () => {
                const state = get();
                // If no items in store, load from initial JSON
                if (state.items.length === 0) {
                    set({
                        items: initialData.items as ContentItem[],
                        hydrated: true
                    });
                } else {
                    set({ hydrated: true });
                }
            },

            addItem: (item) => {
                set((state) => ({
                    items: [...state.items, item],
                }));
            },

            updateItem: (slug, updates) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.slug === slug ? ({ ...item, ...updates } as ContentItem) : item
                    ),
                }));
            },

            deleteItem: (slug) => {
                set((state) => ({
                    items: state.items.filter((item) => item.slug !== slug),
                }));
            },

            getBySlug: (slug) => {
                return get().items.find((item) => item.slug === slug);
            },

            setStatus: (slug, status) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.slug === slug
                            ? {
                                ...item,
                                status,
                                published_at:
                                    status === "published"
                                        ? new Date().toISOString()
                                        : item.published_at,
                            }
                            : item
                    ),
                }));
            },

            slugExists: (slug, excludeSlug) => {
                return get().items.some(
                    (item) => item.slug === slug && item.slug !== excludeSlug
                );
            },
        }),
        {
            name: "b2english-content",
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // If localStorage was empty, load initial data
                    if (state.items.length === 0) {
                        state.items = initialData.items as ContentItem[];
                    }
                    state.hydrated = true;
                }
            },
        }
    )
);
