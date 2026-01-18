"use client";

import React from "react";
import Link from "next/link";
import type { ContentItem } from "@/store/contentStore";
import { Button } from "@/components/Button";

interface ContentPreviewProps {
    item: ContentItem;
    showBanner?: boolean;
}

export function ContentPreview({ item, showBanner = true }: ContentPreviewProps) {
    return (
        <div className="space-y-4">
            {/* Preview Banner */}
            {showBanner && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-amber-600">👁️</span>
                        <span className="text-sm font-medium text-amber-800">
                            Preview Mode — This is how the content will appear
                        </span>
                    </div>
                    <Link href={`/admin/content/${item.slug}/edit`}>
                        <Button variant="secondary" className="text-xs px-3 py-1">
                            Back to Edit
                        </Button>
                    </Link>
                </div>
            )}

            {/* Content Render */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
                {item.type === "video" && <VideoPreview item={item} />}
                {item.type === "text" && <TextPreview item={item} />}
                {item.type === "story" && <StoryPreview item={item} />}
                {item.type === "cta" && <CtaPreview item={item} />}
            </div>
        </div>
    );
}

// Video Preview
function VideoPreview({ item }: { item: ContentItem & { type: "video" } }) {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">{item.title}</h1>
            {item.description && (
                <p className="text-slate-600">{item.description}</p>
            )}
            <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${item.video_id}`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
            {item.level && (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-violet-100 text-violet-700 rounded">
                    Level: {item.level}
                </span>
            )}
        </div>
    );
}

// Text Preview
function TextPreview({ item }: { item: ContentItem & { type: "text" } }) {
    // Simple markdown rendering (headers, bold, italic, lists)
    const renderMarkdown = (text: string) => {
        const lines = text.split("\n");
        return lines.map((line, i) => {
            // Headers
            if (line.startsWith("# ")) {
                return <h1 key={i} className="text-2xl font-bold text-slate-900 mt-4 mb-2">{line.slice(2)}</h1>;
            }
            if (line.startsWith("## ")) {
                return <h2 key={i} className="text-xl font-bold text-slate-900 mt-3 mb-2">{line.slice(3)}</h2>;
            }
            if (line.startsWith("### ")) {
                return <h3 key={i} className="text-lg font-bold text-slate-900 mt-2 mb-1">{line.slice(4)}</h3>;
            }
            // List items
            if (line.startsWith("- ")) {
                return <li key={i} className="ml-4 text-slate-700">{formatInline(line.slice(2))}</li>;
            }
            // Empty line
            if (!line.trim()) {
                return <br key={i} />;
            }
            // Regular paragraph
            return <p key={i} className="text-slate-700 my-1">{formatInline(line)}</p>;
        });
    };

    const formatInline = (text: string) => {
        // Bold
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Italic
        text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
        // Code
        text = text.replace(/`(.*?)`/g, "<code class='bg-slate-100 px-1 rounded text-sm'>$1</code>");
        return <span dangerouslySetInnerHTML={{ __html: text }} />;
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">{item.title}</h1>
            {item.level && (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-violet-100 text-violet-700 rounded">
                    Level: {item.level}
                </span>
            )}
            {item.reading_time && (
                <span className="inline-block ml-2 px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded">
                    {item.reading_time} min read
                </span>
            )}
            <div className="prose prose-slate max-w-none">
                {renderMarkdown(item.body)}
            </div>
        </div>
    );
}

// Story Preview
function StoryPreview({ item }: { item: ContentItem & { type: "story" } }) {
    return (
        <div className={`p-6 rounded-xl ${item.highlight ? "bg-amber-50 border-2 border-amber-200" : "bg-slate-50"}`}>
            <p className="text-xl font-bold text-slate-900">{item.headline}</p>
            {item.body && (
                <p className="mt-2 text-slate-600">{item.body}</p>
            )}
            {item.level && (
                <span className="inline-block mt-3 px-2 py-1 text-xs font-semibold bg-violet-100 text-violet-700 rounded">
                    Level: {item.level}
                </span>
            )}
        </div>
    );
}

// CTA Preview
function CtaPreview({ item }: { item: ContentItem & { type: "cta" } }) {
    const buttonStyles = {
        primary: "bg-gradient-to-r from-violet-500 to-cyan-500 text-white",
        secondary: "bg-slate-100 text-slate-900 border border-slate-200",
        subtle: "bg-transparent text-slate-600 border border-slate-200",
    };

    return (
        <div className="text-center py-8">
            {item.description && (
                <p className="text-slate-600 mb-4">{item.description}</p>
            )}
            <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 ${buttonStyles[item.style ?? "primary"]
                    }`}
                onClick={() => alert(`This would navigate to: ${item.target}`)}
            >
                {item.label}
            </button>
            <p className="mt-4 text-xs text-slate-400">
                Target: <code className="bg-slate-100 px-1 rounded">{item.target}</code>
            </p>
        </div>
    );
}
