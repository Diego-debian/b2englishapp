/**
 * Utility to copy text to clipboard safely.
 * Handles permissions and fallback strategies if needed.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    if (typeof navigator === "undefined") return false;

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.warn("Failed to copy:", err);
        return false;
    }
};

/**
 * Utility to share content via Web Share API.
 * Falls back to copyToClipboard if Web Share API is not supported.
 * Returns 'shared', 'copied', or 'failed'.
 */
export const shareContent = async (
    data: { title?: string; text?: string; url: string }
): Promise<"shared" | "copied" | "failed"> => {
    if (typeof navigator === "undefined") return "failed";

    // Try Web Share API first
    if (navigator.share) {
        try {
            await navigator.share(data);
            return "shared";
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                console.warn("Share failed:", err);
            }
            // If user aborted, we consider it handled (not a failure of the mechanism per se, but no copy needed)
            // However, usually we might want to fallback if technical error.
            // For now, if share throws, we fallback to copy.
        }
    }

    // Fallback to clipboard
    const copied = await copyToClipboard(data.url);
    return copied ? "copied" : "failed";
};
