import { MetadataRoute } from 'next';
import { isContentIndexV1Enabled } from '@/lib/featureFlags';

export default function robots(): MetadataRoute.Robots {
    const isEnabled = isContentIndexV1Enabled();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Flag ON: Allow public content, Disallow admin, include Sitemap
    if (isEnabled) {
        return {
            rules: {
                userAgent: '*',
                allow: '/content/',
                disallow: '/admin/',
            },
            sitemap: `${baseUrl}/sitemap.xml`,
        };
    }

    // Flag OFF: Conservative default
    // Disallow /admin/ AND /content/ (prevent accidental indexing before launch)
    return {
        rules: {
            userAgent: '*',
            disallow: ['/admin/', '/content/'],
        },
        // No sitemap provided to robots when off
    };
}
