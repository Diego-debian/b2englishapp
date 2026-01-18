/**
 * Feature flag helper for B2English expansion zones.
 * Uses NEXT_PUBLIC_* env vars with "1" = enabled.
 */

export const isFeatureEnabled = (flag: string): boolean => {
    if (typeof window === "undefined") {
        // SSR: check process.env directly
        return process.env[`NEXT_PUBLIC_${flag}`] === "1";
    }
    // Client: check window env
    return (process.env[`NEXT_PUBLIC_${flag}`] as string) === "1";
};

// Convenience constants
export const FEATURE_FLAGS = {
    ADMIN_CONTENT: "FEATURE_ADMIN_CONTENT",
    CONTENT_FEED: "FEATURE_CONTENT_FEED",
    SUPPORT: "FEATURE_SUPPORT",
} as const;
