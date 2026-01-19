/**
 * Feature flag helper for B2English expansion zones.
 * Uses NEXT_PUBLIC_* env vars with "1" = enabled.
 *
 * IMPORTANT: Next.js inlines NEXT_PUBLIC_* values at BUILD TIME.
 * The static access must be at the exact usage site for proper inlining.
 */

// Flag name constants
export const FEATURE_FLAGS = {
    ADMIN_CONTENT: "FEATURE_ADMIN_CONTENT",
    CONTENT_FEED: "FEATURE_CONTENT_FEED",
    SUPPORT: "FEATURE_SUPPORT",
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;
export type FeatureFlagValue = typeof FEATURE_FLAGS[FeatureFlagKey];

/**
 * Check if a feature flag is enabled.
 * Uses direct static access to ensure Next.js inlines the values correctly.
 * @param flag - The flag name constant from FEATURE_FLAGS
 * @returns true if the flag value is "1"
 */
export const isFeatureEnabled = (flag: FeatureFlagValue): boolean => {
    // Direct static access - Next.js will inline these at build time
    switch (flag) {
        case "FEATURE_ADMIN_CONTENT":
            return process.env.NEXT_PUBLIC_FEATURE_ADMIN_CONTENT === "1";
        case "FEATURE_CONTENT_FEED":
            return process.env.NEXT_PUBLIC_FEATURE_CONTENT_FEED === "1";
        case "FEATURE_SUPPORT":
            return process.env.NEXT_PUBLIC_FEATURE_SUPPORT === "1";
        default:
            return false;
    }
};
