"use client";

import React from "react";
import type { ContentStatus } from "@/store/contentStore";

interface StatusBadgeProps {
    status: ContentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<ContentStatus, string> = {
        draft: "bg-slate-100 text-slate-600 border-slate-200",
        published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    const labels: Record<ContentStatus, string> = {
        draft: "Draft",
        published: "Published",
    };

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}
