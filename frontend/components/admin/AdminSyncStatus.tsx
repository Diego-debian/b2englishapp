"use client";

import React from "react";

/**
 * Sync status for admin operations
 */
export type SyncStatus = "idle" | "synced" | "saved_local" | "error" | "syncing";

export interface AdminSyncStatusProps {
    /** Current mode (demo or real) */
    mode: "demo" | "real";
    /** Whether backend write is enabled */
    writeEnabled: boolean;
    /** Current sync status */
    syncStatus: SyncStatus;
    /** Optional message to display (for errors or warnings) */
    message?: string;
    /** Optional action button label */
    actionLabel?: string;
    /** Optional action button callback */
    onAction?: () => void;
    /** Whether action button is disabled */
    actionDisabled?: boolean;
    /** Hint text when action is disabled */
    actionHint?: string;
}

/**
 * AdminSyncStatus - Displays current admin mode and sync status
 * 
 * Shows:
 * - Mode badge (Demo/Real)
 * - Write enabled/disabled indicator
 * - Sync status with appropriate icon
 * - Optional action button (e.g., Retry sync)
 */
export function AdminSyncStatus({
    mode,
    writeEnabled,
    syncStatus,
    message,
    actionLabel,
    onAction,
    actionDisabled,
    actionHint,
}: AdminSyncStatusProps) {
    // Mode badge styles
    const modeStyles = mode === "demo"
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-green-100 text-green-800 border-green-200";
    const modeLabel = mode === "demo" ? "📁 Demo" : "🌐 Real";

    // Write status
    const writeLabel = writeEnabled ? "Write: ✓" : "Write: ✗";
    const writeStyles = writeEnabled
        ? "text-green-700"
        : "text-slate-500";

    // Sync status config
    const syncConfig: Record<SyncStatus, { icon: string; label: string; style: string }> = {
        idle: { icon: "⏳", label: "Ready", style: "text-slate-500" },
        synced: { icon: "☁️", label: "Synced", style: "text-green-700" },
        saved_local: { icon: "💾", label: "Saved locally", style: "text-amber-700" },
        error: { icon: "⚠️", label: "Error", style: "text-red-700" },
        syncing: { icon: "🔄", label: "Syncing...", style: "text-blue-700" },
    };

    const sync = syncConfig[syncStatus];

    return (
        <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Mode Badge */}
            <span className={`inline-flex items-center px-2 py-1 rounded-full border font-medium ${modeStyles}`}>
                {modeLabel}
            </span>

            {/* Write Status (only show in real mode) */}
            {mode === "real" && (
                <span className={`font-medium ${writeStyles}`}>
                    {writeLabel}
                </span>
            )}

            {/* Sync Status */}
            {syncStatus !== "idle" && (
                <span className={`font-medium ${sync.style}`}>
                    {sync.icon} {sync.label}
                </span>
            )}

            {/* Optional Message */}
            {message && (
                <span className="text-slate-600 italic">
                    — {message}
                </span>
            )}

            {/* Optional Action Button */}
            {actionLabel && onAction && (
                <span className="flex items-center gap-1">
                    <button
                        onClick={onAction}
                        disabled={actionDisabled || syncStatus === "syncing"}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${actionDisabled || syncStatus === "syncing"
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
                            }`}
                    >
                        {syncStatus === "syncing" ? "🔄 Syncing..." : actionLabel}
                    </button>
                    {actionDisabled && actionHint && (
                        <span className="text-slate-500 text-xs italic">
                            ({actionHint})
                        </span>
                    )}
                </span>
            )}
        </div>
    );
}

