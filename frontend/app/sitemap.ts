import { MetadataRoute } from 'next';
import { isContentIndexV1Enabled } from '@/lib/featureFlags';
import { MOCK_CONTENT } from '@/lib/mockContent';
import { isPublished } from '@/lib/contentSpec';

export default function sitemap(): MetadataRoute.Sitemap {
    const isEnabled = isContentIndexV1Enabled();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Base routes always included (Home, Feed)
    const baseRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/content/feed`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
    ];

    if (!isEnabled) {
        return baseRoutes;
    }

    // Dynamic routes from Published content ONLY
    const contentRoutes = MOCK_CONTENT
        .filter(isPublished)
        .map((item) => ({
            url: `${baseUrl}/content/${item.slug}`,
            lastModified: new Date(item.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

    return [...baseRoutes, ...contentRoutes];
}
