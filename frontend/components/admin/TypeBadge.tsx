"use client";

import React from "react";
import type { ContentType } from "@/store/contentStore";

interface TypeBadgeProps {
    type: ContentType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
    const styles: Record<ContentType, string> = {
        video: "bg-red-50 text-red-700 border-red-200",
        text: "bg-blue-50 text-blue-700 border-blue-200",
        story: "bg-amber-50 text-amber-700 border-amber-200",
        cta: "bg-violet-50 text-violet-700 border-violet-200",
    };

    const icons: Record<ContentType, string> = {
        video: "🎬",
        text: "📝",
        story: "💡",
        cta: "🔗",
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[type]}`}
        >
            <span>{icons[type]}</span>
            {type}
        </span>
    );
}
