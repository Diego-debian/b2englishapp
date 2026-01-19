import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { isContentSeoV1Enabled } from "@/lib/featureFlags";
import { MOCK_CONTENT } from "@/lib/mockContent";
import { isPublished } from "@/lib/contentSpec";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const isSeoEnabled = isContentSeoV1Enabled();

    if (!isSeoEnabled) {
        return {};
    }

    const params = await props.params;
    const { slug } = params;
    const item = MOCK_CONTENT.find((c) => c.slug === slug);

    if (!item || !isPublished(item)) {
        notFound();
    }

    // Safe metadata construction
    const title = item.title;
    const description = item.seoDescription || item.excerpt || "Read this article on B2English Magazine.";
    const url = `/content/${slug}`;
    const images = item.coverImageUrl ? [item.coverImageUrl] : [];

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: url,
            type: "article",
            images: images,
            publishedTime: item.publishedAt,
            authors: ["B2English Team"],
        },
        twitter: {
            card: images.length > 0 ? "summary_large_image" : "summary",
            title: title,
            description: description,
            images: images,
        },
        alternates: {
            canonical: url,
        },
    };
}

export default function DetailLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    return <>{children}</>;
}
