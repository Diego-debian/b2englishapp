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

const v11 = {
    surface: {
        page: "bg-slate-50",
        card: "bg-white",
        panel: "bg-slate-100/50",
        interactivePrimary: "bg-violet-600 hover:bg-violet-700",
        interactiveSecondary: "bg-white hover:bg-slate-50",
        input: "bg-white",
        header: "bg-slate-50",
    },
    text: {
        primary: "text-slate-900",
        secondary: "text-slate-700",
        muted: "text-slate-500",
        onInteractive: "text-white",
        accent: "text-violet-600",
        accentHover: "hover:text-violet-500",
        error: "text-red-600",
    },
    border: {
        default: "border-slate-200",
        subtle: "border-slate-100",
        error: "border-red-200",
        interactive: "border-slate-300",
        focus: "focus:border-violet-500",
    },
    effects: {
        shadow: "shadow-sm",
        shadowHover: "hover:shadow-md hover:-translate-y-1",
        radius: "rounded-xl",
        radiusSm: "rounded-lg",
        focusRing: "focus:ring-2 focus:ring-violet-500 focus:outline-none",
        transition: "transition-all duration-200",
    },
    spacing: {
        page: "px-4 py-8 md:py-12",
    }
};

export const ds = {
    layout: {
        /**
         * Standard page container.
         * Enforces consistent background, padding, and max-width.
         */
        page: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `min-h-screen ${v11.surface.page} ${v11.text.primary} ${v11.spacing.page}`;
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
            return `text-3xl md:text-4xl font-extrabold ${v11.text.primary} mb-4 tracking-tight`;
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
            return `text-lg ${v11.text.secondary} max-w-2xl mx-auto leading-relaxed`;
        },
        /**
        * Body text
        */
        body: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `text-base ${v11.text.secondary} leading-7`;
        },
        /**
         * Blockquote
         */
        quote: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `pl-4 border-l-4 border-violet-500 italic ${v11.text.secondary} my-6 py-2 ${v11.surface.panel} rounded-r-lg`;
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
            return `pl-6 mb-6 space-y-2 ${v11.text.secondary} marker:text-violet-500`;
        },
        /**
         * Inline Code
         */
        codeInline: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `px-1.5 py-0.5 rounded text-sm font-mono bg-slate-100 text-violet-700 border ${v11.border.default}`;
        },
        /**
         * Block Code
         */
        codeBlock: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `block p-4 ${v11.effects.radius} bg-slate-900 text-slate-50 text-sm font-mono overflow-x-auto my-6 ${v11.effects.shadow}`;
        }
    },
    card: {
        /**
         * Card container style.
         */
        root: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `group flex flex-col h-full ${v11.surface.card} border ${v11.border.default} ${v11.effects.radius} ${v11.effects.shadow} ${v11.effects.shadowHover} ${v11.effects.transition} overflow-hidden`;
        }
    },
    button: {
        /**
         * Primary action button.
         */
        primary: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `inline-flex items-center justify-center px-6 py-2.5 ${v11.surface.interactivePrimary} ${v11.text.onInteractive} font-medium ${v11.effects.radiusSm} transition-colors ${v11.effects.shadow} cursor-pointer`;
        },
        /**
         * Secondary/Ghost button.
         */
        secondary: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `inline-flex items-center justify-center px-4 py-2 ${v11.surface.interactiveSecondary} border ${v11.border.default} hover:bg-slate-50 ${v11.text.secondary} font-medium ${v11.effects.radiusSm} transition-colors cursor-pointer`;
        }
    },
    state: {
        /**
         * Empty state container.
         */
        empty: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `text-center py-20 px-4 ${v11.effects.radius} ${v11.surface.card} border border-dashed border-slate-300 ${v11.effects.shadow}`;
        },
        /**
         * Loading state container
         */
        loading: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `flex items-center justify-center p-12 ${v11.text.muted} animate-pulse`;
        },
        /**
         * Error state container
         */
        error: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `p-4 ${v11.effects.radiusSm} bg-red-50 border ${v11.border.error} ${v11.text.error} text-center`;
        }
    },
    form: {
        /**
         * Standard Label
         */
        label: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `block text-sm font-semibold ${v11.text.secondary} mb-1.5`;
        },
        /**
         * Standard Input / Select / Textarea
         */
        input: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `w-full ${v11.effects.radiusSm} ${v11.border.interactive} ${v11.surface.input} ${v11.text.primary} ${v11.effects.shadow} ${v11.border.focus} ${v11.effects.focusRing} sm:text-sm`;
        },
        /**
         * Help text
         */
        help: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `mt-1.5 text-xs ${v11.text.muted}`;
        },
        /**
         * Error text
         */
        error: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `mt-1.5 text-xs font-medium ${v11.text.error}`;
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
            return `flex items-center gap-3 pt-6 border-t ${v11.border.subtle} mt-8`;
        }
    },
    table: {
        /**
         * Table Wrapper
         */
        container: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `overflow-hidden ${v11.effects.radius} border ${v11.border.default} ${v11.surface.card} ${v11.effects.shadow} ring-1 ring-slate-900/5`;
        },
        /**
         * Table Head Cell
         */
        th: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `px-4 py-3 ${v11.surface.header} text-left text-xs font-semibold ${v11.text.muted} uppercase tracking-wider border-b ${v11.border.default}`;
        },
        /**
         * Table Body Cell
         */
        td: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `px-4 py-4 text-sm ${v11.text.secondary} border-b ${v11.border.subtle} whitespace-nowrap`;
        },
        /**
         * Table Row
         */
        tr: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return "hover:bg-slate-50 transition-colors";
        }
    },
    filter: {
        /**
         * Filter Group Container
         */
        group: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `inline-flex items-center p-1 ${v11.surface.panel} ${v11.effects.radius} border ${v11.border.default} gap-1`;
        },
        /**
         * Active Filter Tab
         */
        active: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `px-4 py-2 text-sm font-semibold ${v11.effects.radiusSm} ${v11.surface.card} text-violet-700 ${v11.effects.shadow} ring-1 ring-black/5 ${v11.effects.transition}`;
        },
        /**
         * Inactive Filter Tab
         */
        inactive: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `px-4 py-2 text-sm font-medium ${v11.text.secondary} hover:text-slate-900 hover:bg-slate-200/50 ${v11.effects.transition}`;
        }
    },
    meta: {
        /**
         * Metadata row container (dates, tags, authors)
         */
        row: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `flex items-center gap-4 text-sm ${v11.text.muted} mb-6`;
        },
        /**
         * Date / Time text
         */
        date: (defaultClasses: string) => {
            if (!isUiV11Enabled()) return defaultClasses;
            return `font-medium ${v11.text.muted}`;
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
            return `relative w-full overflow-hidden ${v11.effects.radius} bg-slate-100 my-8 aspect-video`;
        }
    }
};


