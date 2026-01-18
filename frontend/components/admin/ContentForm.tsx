"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import type { ContentItem, ContentType, ContentStatus } from "@/store/contentStore";

interface ContentFormProps {
    initialData?: ContentItem;
    onSubmit: (data: ContentItem) => void;
    onCancel: () => void;
    isEdit?: boolean;
    existingSlugs: string[];
}

const CONTENT_TYPES: ContentType[] = ["video", "text", "story", "cta"];
const LEVELS = ["B1", "B2", "C1"];
const CTA_ACTIONS = ["internal_link", "external_link", "practice"] as const;
const CTA_STYLES = ["primary", "secondary", "subtle"] as const;

export function ContentForm({
    initialData,
    onSubmit,
    onCancel,
    isEdit = false,
    existingSlugs,
}: ContentFormProps) {
    const [type, setType] = useState<ContentType>(initialData?.type ?? "video");
    const [slug, setSlug] = useState(initialData?.slug ?? "");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Video fields
    const [title, setTitle] = useState("");
    const [videoId, setVideoId] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState("");

    // Text fields
    const [body, setBody] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [readingTime, setReadingTime] = useState<number | "">("");

    // Story fields
    const [headline, setHeadline] = useState("");
    const [highlight, setHighlight] = useState(false);

    // CTA fields
    const [label, setLabel] = useState("");
    const [action, setAction] = useState<typeof CTA_ACTIONS[number]>("internal_link");
    const [target, setTarget] = useState("");
    const [ctaDescription, setCtaDescription] = useState("");
    const [style, setStyle] = useState<typeof CTA_STYLES[number]>("primary");

    // Load initial data
    useEffect(() => {
        if (!initialData) return;
        setType(initialData.type);
        setSlug(initialData.slug);

        if (initialData.type === "video") {
            setTitle(initialData.title);
            setVideoId(initialData.video_id);
            setDescription(initialData.description ?? "");
            setLevel(initialData.level ?? "");
        } else if (initialData.type === "text") {
            setTitle(initialData.title);
            setBody(initialData.body);
            setExcerpt(initialData.excerpt ?? "");
            setLevel(initialData.level ?? "");
            setReadingTime(initialData.reading_time ?? "");
        } else if (initialData.type === "story") {
            setHeadline(initialData.headline);
            setBody(initialData.body ?? "");
            setHighlight(initialData.highlight ?? false);
            setLevel(initialData.level ?? "");
        } else if (initialData.type === "cta") {
            setLabel(initialData.label);
            setAction(initialData.action);
            setTarget(initialData.target);
            setCtaDescription(initialData.description ?? "");
            setStyle(initialData.style ?? "primary");
        }
    }, [initialData]);

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 100);
    };

    const validateSlug = (s: string): string | null => {
        if (!s) return "Slug is required";
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) {
            return "Use only lowercase letters, numbers, and hyphens";
        }
        if (existingSlugs.includes(s) && s !== initialData?.slug) {
            return "This slug is already in use";
        }
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        // Validate slug
        const slugError = validateSlug(slug);
        if (slugError) newErrors.slug = slugError;

        // Validate by type
        if (type === "video") {
            if (!title) newErrors.title = "Title is required";
            if (!videoId) newErrors.videoId = "Video ID is required";
            if (videoId && videoId.length !== 11) newErrors.videoId = "Video ID must be 11 characters";
        } else if (type === "text") {
            if (!title) newErrors.title = "Title is required";
            if (!body) newErrors.body = "Body is required";
        } else if (type === "story") {
            if (!headline) newErrors.headline = "Headline is required";
            if (headline && headline.length > 140) newErrors.headline = "Max 140 characters";
        } else if (type === "cta") {
            if (!label) newErrors.label = "Label is required";
            if (label && label.length > 50) newErrors.label = "Max 50 characters";
            if (!target) newErrors.target = "Target is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Build item
        const status: ContentStatus = initialData?.status ?? "draft";
        const published_at = initialData?.published_at ?? null;

        let item: ContentItem;
        if (type === "video") {
            item = {
                type: "video",
                slug,
                title,
                video_id: videoId,
                description: description || undefined,
                level: level || undefined,
                status,
                published_at,
            };
        } else if (type === "text") {
            item = {
                type: "text",
                slug,
                title,
                body,
                excerpt: excerpt || undefined,
                level: level || undefined,
                reading_time: readingTime ? Number(readingTime) : undefined,
                status,
                published_at,
            };
        } else if (type === "story") {
            item = {
                type: "story",
                slug,
                headline,
                body: body || undefined,
                highlight: highlight || undefined,
                level: level || undefined,
                status,
                published_at,
            };
        } else {
            item = {
                type: "cta",
                slug,
                label,
                action,
                target,
                description: ctaDescription || undefined,
                style: style || undefined,
                status,
                published_at,
            };
        }

        onSubmit(item);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type selector (only for new items) */}
            {!isEdit && (
                <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Content Type
                    </label>
                    <div className="flex gap-2">
                        {CONTENT_TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${type === t
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Slug */}
            <div>
                <Input
                    label="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-content-slug"
                    disabled={isEdit}
                    error={errors.slug}
                />
                {!isEdit && type === "video" && title && (
                    <button
                        type="button"
                        onClick={() => setSlug(generateSlug(title))}
                        className="mt-1 text-xs text-violet-600 hover:underline"
                    >
                        Generate from title
                    </button>
                )}
            </div>

            {/* Video Fields */}
            {type === "video" && (
                <>
                    <Input
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Introduction to Present Simple"
                        error={errors.title}
                    />
                    <Input
                        label="YouTube Video ID"
                        value={videoId}
                        onChange={(e) => setVideoId(e.target.value)}
                        placeholder="dQw4w9WgXcQ"
                        maxLength={11}
                        error={errors.videoId}
                    />
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the video..."
                            className="input-pro min-h-[100px]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Level
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="input-pro"
                        >
                            <option value="">Select level...</option>
                            {LEVELS.map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {/* Text Fields */}
            {type === "text" && (
                <>
                    <Input
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="10 Common Grammar Mistakes"
                        error={errors.title}
                    />
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Body (Markdown)
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="# Introduction&#10;&#10;Write your content here..."
                            className="input-pro min-h-[200px] font-mono text-sm"
                        />
                        {errors.body && <p className="mt-1 text-xs font-medium text-red-600">{errors.body}</p>}
                    </div>
                    <Input
                        label="Excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Short preview for the feed..."
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Level
                            </label>
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="input-pro"
                            >
                                <option value="">Select level...</option>
                                {LEVELS.map((l) => (
                                    <option key={l} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Reading Time (min)"
                            type="number"
                            value={readingTime}
                            onChange={(e) => setReadingTime(e.target.value ? Number(e.target.value) : "")}
                            placeholder="5"
                            min={1}
                        />
                    </div>
                </>
            )}

            {/* Story Fields */}
            {type === "story" && (
                <>
                    <div>
                        <Input
                            label="Headline"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="📝 Quick tip about grammar..."
                            maxLength={140}
                            error={errors.headline}
                        />
                        <p className="mt-1 text-xs text-slate-400">{headline.length}/140</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Body (optional)
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Additional context..."
                            className="input-pro min-h-[80px]"
                            maxLength={280}
                        />
                        <p className="mt-1 text-xs text-slate-400">{body.length}/280</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="highlight"
                            checked={highlight}
                            onChange={(e) => setHighlight(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="highlight" className="text-sm font-medium text-slate-700">
                            Highlight this story
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Level
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="input-pro"
                        >
                            <option value="">Select level...</option>
                            {LEVELS.map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {/* CTA Fields */}
            {type === "cta" && (
                <>
                    <div>
                        <Input
                            label="Label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Try Focus Mode"
                            maxLength={50}
                            error={errors.label}
                        />
                        <p className="mt-1 text-xs text-slate-400">{label.length}/50</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Action Type
                        </label>
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value as typeof action)}
                            className="input-pro"
                        >
                            {CTA_ACTIONS.map((a) => (
                                <option key={a} value={a}>
                                    {a.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Target URL"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder={action === "external_link" ? "https://..." : "/practice/focus"}
                        error={errors.target}
                    />
                    <Input
                        label="Description"
                        value={ctaDescription}
                        onChange={(e) => setCtaDescription(e.target.value)}
                        placeholder="Practice your grammar skills..."
                    />
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Style
                        </label>
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value as typeof style)}
                            className="input-pro"
                        >
                            {CTA_STYLES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button type="submit" variant="primary" className="px-6">
                    {isEdit ? "Save Changes" : "Save as Draft"}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
