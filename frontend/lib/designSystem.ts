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
        },
        /**
         * Blockquote
         */
        quote: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "pl-4 border-l-4 border-violet-500 italic text-slate-700 my-6 py-2 bg-slate-50/50 rounded-r-lg";
        },
        /**
         * Content Links
         */
        link: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "font-medium text-violet-600 underline underline-offset-4 decoration-violet-200 hover:decoration-violet-500 transition-all";
        },
        /**
         * Lists (ul, ol)
         */
        list: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "pl-6 mb-6 space-y-2 text-slate-700 marker:text-violet-500";
        },
        /**
         * Inline Code
         */
        codeInline: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "px-1.5 py-0.5 rounded text-sm font-mono bg-slate-100 text-violet-700 border border-slate-200";
        },
        /**
         * Block Code
         */
        codeBlock: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "block p-4 rounded-xl bg-slate-900 text-slate-50 text-sm font-mono overflow-x-auto my-6 shadow-sm";
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
            return "text-center py-20 px-4 rounded-2xl bg-white border border-dashed border-slate-300 shadow-sm";
        },
        /**
         * Loading state container
         */
        loading: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "flex items-center justify-center p-12 text-slate-400 animate-pulse";
        },
        /**
         * Error state container
         */
        error: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-center";
        }
    },
    form: {
        /**
         * Standard Label
         */
        label: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "block text-sm font-semibold text-slate-700 mb-1.5";
        },
        /**
         * Standard Input / Select / Textarea
         */
        input: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "w-full rounded-lg border-slate-300 bg-white text-slate-900 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm";
        },
        /**
         * Help text
         */
        help: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "mt-1.5 text-xs text-slate-500";
        },
        /**
         * Error text
         */
        error: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "mt-1.5 text-xs font-medium text-red-600";
        },
        /**
         * Form Row / Group wrapper
         */
        row: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "space-y-1";
        }
    },
    actions: {
        /**
         * Action Bar (bottom of forms, top of lists)
         */
        bar: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            // Ensure flex layout is preserved or enhanced
            return "flex items-center gap-3 pt-6 border-t border-slate-100 mt-8";
        }
    },
    table: {
        /**
         * Table Head Cell
         */
        th: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "px-4 py-3 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200";
        },
        /**
         * Table Body Cell
         */
        td: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "px-4 py-4 text-sm text-slate-700 border-b border-slate-100 whitespace-nowrap";
        },
        /**
         * Table Row
         */
        tr: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "hover:bg-slate-50 transition-colors";
        }
    },
    meta: {
        /**
         * Metadata row container (dates, tags, authors)
         */
        row: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "flex items-center gap-4 text-sm text-slate-500 mb-6";
        },
        /**
         * Date / Time text
         */
        date: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "font-medium text-slate-500";
        },
        /**
         * Tag / Category Chip
         */
        tag: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800";
        }
    },
    media: {
        /**
         * Wrapper for responsive embeds/iframes
         */
        wrapper: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "relative w-full overflow-hidden rounded-xl bg-slate-100 my-8 aspect-video";
        }
    }
};


