/**
 * Feature flag helper for B2English expansion zones.
 * Uses NEXT_PUBLIC_* env vars.
 *
 * IMPORTANT: Next.js inlines NEXT_PUBLIC_* values at BUILD TIME.
 * The static access must be at the exact usage site for proper inlining.
 */

// Flag name constants
export const FEATURE_FLAGS = {
    ADMIN_CONTENT: "FEATURE_ADMIN_CONTENT",
    CONTENT_FEED: "FEATURE_CONTENT_FEED",
    SUPPORT: "FEATURE_SUPPORT",
    CONTENT_PUBLIC_UX_V2: "FEATURE_CONTENT_PUBLIC_UX_V2",
    CONTENT_PUBLIC_SEO_V1: "FEATURE_CONTENT_PUBLIC_SEO_V1",
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;
export type FeatureFlagValue = typeof FEATURE_FLAGS[FeatureFlagKey];

/**
 * Strict boolean parse for feature flags.
 * ON only if value (case-insensitive) is one of: "1", "true", "on", "yes"
 * OFF for any other value or undefined.
 *
 * @param value - The env var value
 * @returns true if ON, false otherwise (default OFF)
 */
export const isFeatureOn = (value?: string): boolean => {
    if (!value) return false;
    const normalized = value.toLowerCase().trim();
    return ["1", "true", "on", "yes"].includes(normalized);
};

/**
 * Check if a feature flag is enabled.
 * Uses direct static access to ensure Next.js inlines the values correctly.
 * @param flag - The flag name constant from FEATURE_FLAGS
 * @returns true if the flag value passes isFeatureOn()
 */
export const isFeatureEnabled = (flag: FeatureFlagValue): boolean => {
    // Direct static access - Next.js will inline these at build time
    switch (flag) {
        case "FEATURE_ADMIN_CONTENT":
            return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_ADMIN_CONTENT);
        case "FEATURE_CONTENT_FEED":
            return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_CONTENT_FEED);
        case "FEATURE_SUPPORT":
            return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_SUPPORT);
        default:
            return false;
    }
};

// ============================================
// Convenience helpers for specific flags
// ============================================

/**
 * Check if FEATURE_SUPPORT is enabled.
 * Uses strict parsing - ON only for "1", "true", "on", "yes".
 * Default: OFF
 */
export const isSupportEnabled = (): boolean => {
    return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_SUPPORT);
};

/**
 * Check if FEATURE_ADMIN_CONTENT is enabled.
 */
export const isAdminContentEnabled = (): boolean => {
    return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_ADMIN_CONTENT);
};

/**
 * Check if FEATURE_CONTENT is enabled.
 * Controls access to public content feed and detail pages.
 */
export const isContentEnabled = (): boolean => {
    return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_CONTENT);
};

/**
 * Check if FEATURE_CONTENT_PUBLIC_UX_V2 is enabled.
 * Controls the new "blog/magazine" UI for public content.
 */
export const isContentUxV2Enabled = (): boolean => {
    return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_CONTENT_PUBLIC_UX_V2);
};

/**
 * Check if FEATURE_CONTENT_PUBLIC_SEO_V1 is enabled.
 * Controls dynamic metadata generation for content routes.
 */
export const isContentSeoV1Enabled = (): boolean => {
    return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_CONTENT_PUBLIC_SEO_V1);
};
