export type TenseSlug =
    | "present-simple"
    | "present-continuous"
    | "present-perfect"
    | "present-perfect-continuous"
    | "past-simple"
    | "past-continuous"
    | "past-perfect"
    | "past-perfect-continuous"
    | "will"
    | "going-to"
    | "future-continuous"
    | "future-perfect";

export interface TenseInfo {
    title: string;
    category: "present" | "past" | "future";
}

export const TENSES: Record<TenseSlug, TenseInfo> = {
    "present-simple": { title: "Present Simple", category: "present" },
    "present-continuous": { title: "Present Continuous", category: "present" },
    "present-perfect": { title: "Present Perfect", category: "present" },
    "present-perfect-continuous": { title: "Present Perfect Continuous", category: "present" },
    "past-simple": { title: "Past Simple", category: "past" },
    "past-continuous": { title: "Past Continuous", category: "past" },
    "past-perfect": { title: "Past Perfect", category: "past" },
    "past-perfect-continuous": { title: "Past Perfect Continuous", category: "past" },
    "will": { title: "Future (Will)", category: "future" },
    "going-to": { title: "Future (Going to)", category: "future" },
    "future-continuous": { title: "Future Continuous", category: "future" },
    "future-perfect": { title: "Future Perfect", category: "future" },
};
