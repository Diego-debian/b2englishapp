import type { Metadata } from "next";
import { isSupportEnabled } from "@/lib/featureFlags";

/**
 * Dynamic SEO + Social Share metadata for /support page.
 *
 * Robots behavior:
 * - FEATURE_SUPPORT=ON: index, follow
 * - FEATURE_SUPPORT=OFF: noindex, nofollow, noarchive
 *
 * Note: No OG image available - no assets found in /public folder.
 */
export function generateMetadata(): Metadata {
    const isEnabled = isSupportEnabled();

    // Base metadata (always present)
    const baseMetadata: Metadata = {
        title: "Donaciones — B2 English",
        description:
            "Apoya B2 English, una plataforma gratuita y open-source para aprender gramática inglesa. Tu apoyo nos ayuda a mejorar y crear más contenido.",
        keywords: ["donaciones", "apoyo", "B2 English", "aprender inglés", "gramática inglesa"],
        openGraph: {
            title: "Donaciones — B2 English",
            description:
                "Apoya B2 English, una plataforma gratuita para aprender gramática inglesa.",
            type: "website",
            locale: "es_ES",
            siteName: "B2 English",
        },
        twitter: {
            card: "summary",
            title: "Donaciones — B2 English",
            description:
                "Apoya B2 English, una plataforma gratuita para aprender gramática inglesa.",
        },
    };

    // Dynamic robots based on feature flag
    if (isEnabled) {
        return {
            ...baseMetadata,
            robots: {
                index: true,
                follow: true,
            },
        };
    }

    // Feature OFF: noindex, nofollow, noarchive
    // Note: The page.tsx will redirect to /, but this ensures
    // that if a crawler somehow reaches this page, it won't index it.
    return {
        ...baseMetadata,
        robots: {
            index: false,
            follow: false,
            noarchive: true,
            nocache: true,
        },
    };
}

import LatestContentBlock from "@/components/content/LatestContentBlock";

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <LatestContentBlock compact={true} />
        </>
    );
}
