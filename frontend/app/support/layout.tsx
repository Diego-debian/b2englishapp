import type { Metadata } from "next";

/**
 * SEO + Social Share metadata for /support page.
 *
 * Note: No OG image available - no assets found in /public folder.
 * When an image is added, update the openGraph.images field.
 */
export const metadata: Metadata = {
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
        // No image available - see docs/f6-t5-support-seo-social.md
    },
    twitter: {
        card: "summary",
        title: "Donaciones — B2 English",
        description:
            "Apoya B2 English, una plataforma gratuita para aprender gramática inglesa.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
