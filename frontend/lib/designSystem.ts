import { isUiV11Enabled } from "@/lib/featureFlags";

/**
 * Visual Refresh Design System (T11.1)
 * 
 * Provides consistent token classes for:
 * - Layouts
 * - Typography
 * - Cards
 * - Buttons
 * - States
 * 
 * Logic:
 * - If FEATURE_UI_V11 is OFF: returns `defaultClasses` (exact preservation of legacy UI).
 * - If FEATURE_UI_V11 is ON: returns new consistent classes (ignoring `defaultClasses` usually, or merging if needed).
 */

type ClassNameFactory = (defaultClasses: string) => string;

export const ds = {
    layout: {
        /**
         * Standard page container.
         * Enforces consistent background, padding, and max-width.
         */
        page: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "min-h-screen bg-slate-50 text-slate-900 px-4 py-8 md:py-12";
        },
        /**
         * Content container max-width.
         */
        container: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "max-w-5xl mx-auto";
        }
    },
    typo: {
        /**
         * Main Page Title (H1).
         */
        h1: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight";
        },
        /**
         * Section Headers (H2).
         */
        h2: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "text-2xl font-bold text-slate-800 mb-4 tracking-tight";
        },
        /**
         * Subtitles / Descriptions.
         */
        subtitle: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed";
        },
        /**
        * Body text
        */
        body: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "text-base text-slate-700 leading-7";
        }
    },
    card: {
        /**
         * Card container style.
         */
        root: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "group flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden";
        }
    },
    button: {
        /**
         * Primary action button.
         */
        primary: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "inline-flex items-center justify-center px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer";
        },
        /**
         * Secondary/Ghost button.
         */
        secondary: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer";
        }
    },
    state: {
        /**
         * Empty state container.
         */
        empty: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "text-center py-20 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300";
        }
    }
};
