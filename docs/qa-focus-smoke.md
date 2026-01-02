# QA Smoke Checklist: Focus Mode

**Role:** QA Engineer / Tech Lead
**Context:** Frontend-only, `/practice/focus`
**Goal:** Verify critical user flows and UI states before any release.

## 🟢 1. Navigation Loop

| Check | Action | Expected Result |
|-------|--------|-----------------|
| [ ] | Go to `/practice` | "Focused Practice" card is visible at bottom. |
| [ ] | Click "Start Focus" | Navigates to `/practice/focus`. |
| [ ] | URL Check | URL is exactly `/practice/focus` (no params yet). |
| [ ] | Back Links | "← Back to Practice" goes to `/practice`. "Back to Tenses" goes to `/tenses`. |

## 🟣 2. Session Flow (Generic)

| Check | Action | Expected Result |
|-------|--------|-----------------|
| [ ] | Select Tense | Clicking a tense (e.g., Present Simple) highlights it (border/glow). |
| [ ] | Start | "Start Focused Practice" button appears and starts session. |
| [ ] | Progress Bar | Shows "Question 1 of 5". Updates on validation. |
| [ ] | Submit (Empty) | "Submit Answer" is **disabled** if input is empty. |

## 🟡 3. Input Types & Validation

| Type | Action | Expected Result |
|------|--------|-----------------|
| **MCQ** | Select option | Selection highlights. Submit enables. |
| **Fill Blank** | Input "play" vs "Play " | Case/whitespace insensitive. Corrects to standard answer. |
| **Order Words** | Tap all words | Chips move to answer line. Submit enables when all used (or logic allows partial?). *Note: Current logic requires valid sentence.* |

## 🔴 4. Summary Screen (Critical Rules)

### Common Elements
*   [ ] **Header**: Must show "Score X/5" (e.g., "3 / 5").
*   [ ] **Design**: Dark theme, glassmorphism cards.

### Scenario A: With Mistakes (Score < 5)
*   [ ] **Section Header**: "⚠️ Mistakes to Fix" is visible.
*   [ ] **Card Style**: Dark glass (`backdrop-blur-md bg-black/20`).
*   [ ] **Card Content**:
    *   [ ] Prompt visible.
    *   [ ] "Your Answer" (Red text).
    *   [ ] "Correct Answer" (Green/Emerald text).
    *   [ ] "Explanation" (Italic/Secondary text).
*   [ ] **Buttons**:
    *   [ ] "Repeat Mistakes" (Amber) -> Starts new session with failed questions.
    *   [ ] "New Session" -> Starts new session (same tense).
    *   [ ] "Change Tense" -> Returns to selection.

### Scenario B: Perfect Run (Score 5/5)
*   [ ] **Mistakes Section**: **NOT** visible.
*   [ ] **Success Text**: Exact match: **"Perfect run"**.
*   [ ] **CTA Button**: Exact match: **"New Session"**.
*   [ ] **CTA Action**: Click "New Session" -> Starts new session (same tense, fresh shuffle).

## ⚙️ 5. Technical & Build

| Check | Action | Expected Result |
|-------|--------|-----------------|
| [ ] | `npm run build` | Process completes with **Success**. No type errors. |
| [ ] | Console | No React hydration errors or "unique key" warnings in DevTools. |
