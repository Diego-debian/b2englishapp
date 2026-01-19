import { Metadata } from 'next';
import { isContentSeoV1Enabled } from "@/lib/featureFlags";

export async function generateMetadata(): Promise<Metadata> {
    const isSeoEnabled = isContentSeoV1Enabled();

    if (!isSeoEnabled) {
        return {};
    }

    return {
        title: "B2English Magazine - Grammar Strategies & Tips",
        description: "Explore our curated collection of grammar guides, learning strategies, and insights to help you master English fluency.",
        openGraph: {
            title: "B2English Magazine",
            description: "Explore our curated collection of grammar guides, learning strategies, and insights to help you master English fluency.",
            url: "/content/feed",
            type: "website",
        },
        alternates: {
            canonical: "/content/feed",
        },
    };
}

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
