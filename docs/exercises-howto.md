# How to Add Exercises to Focus Question Bank

This guide explains how to add new questions to the Focus Practice mode.

## 📂 File Locations

| Component | Path | Description |
|-----------|------|-------------|
| **Bank Source** | `frontend/lib/focusQuestions.ts` | Main file containing all questions and type definitions. |
| **Logic** | `frontend/app/practice/focus/page.tsx` | Handles session logic (you don't need to touch this usually). |

## 📝 Schema & Types

Every question must adhere to the `FocusQuestion` interface.

```typescript
interface FocusQuestion {
    id: string;          // Unique ID
    tenseSlug: string;   // Must match TenseSlug type (e.g., "present-simple")
    type: "mcq" | "fill_blank" | "order_words";
    prompt: string;      // The question text
    choices?: string[];  // Required for 'mcq'
    tokens?: string[];   // Required for 'order_words'
    answer: string;      // The correct answer (exact string)
    explanation: string; // Helpful feedback for the user
}
```

### ID Naming Convention
Use `[tense_initials]_[000]` format.
- Present Simple: `ps_001`, `ps_002`...
- Past Continuous: `pc_001`...
- Future Perfect: `fp_001`...

## 📋 Examples by Type

### 1. Multiple Choice (MCQ)
User selects 1 correct option from 4.

```typescript
{
    id: "ps_101",
    tenseSlug: "present-simple",
    type: "mcq",
    prompt: "She ______ to work every day.",
    choices: ["go", "goes", "going", "gone"],
    answer: "goes",
    explanation: "Use 'goes' for third person singular (he/she/it) in Present Simple."
}
```

### 2. Fill in the Blank
User types the answer. Input is case-insensitive normalized, but `answer` field should be the clean correct version.

```typescript
{
    id: "ps_102",
    tenseSlug: "present-simple",
    type: "fill_blank",
    prompt: "My brother ______ (play) soccer every weekend.",
    answer: "plays",
    explanation: "Add '-s' to the verb for third person singular: play → plays."
}
```

### 3. Order Words
User taps words to build a sentence.

```typescript
{
    id: "ps_103",
    tenseSlug: "present-simple",
    type: "order_words",
    prompt: "Order the words to form a correct sentence:",
    tokens: ["studies", "English", "She", "every", "day"],
    answer: "She studies English every day",
    explanation: "Subject (She) + verb (studies) + object (English) + time expression."
}
```

## ✅ Quality Checklist (Manual QA)

Before committing new questions, verify:

1.  [ ] **Unique IDs**: Ensure no duplicate IDs exist for the tense.
2.  [ ] **Valid Tense Slug**: Check `TenseSlug` type alias if unsure.
3.  [ ] **Explanation**: meaningful feedback is **mandatory**.
4.  [ ] **Correct Answer**:
    -   For MCQ: Must literally match one of the choices.
    -   For Order Words: Must be formable using *exactly* the provided tokens.
    -   For Fill Blank: Should be the standard correct form.
5.  [ ] **Array Registration**: Don't forget to add your new array to `FOCUS_QUESTION_BANKS` at the bottom of the file if starting a new tense.

```typescript
export const FOCUS_QUESTION_BANKS: Record<string, FocusQuestion[]> = {
    "present-simple": PRESENT_SIMPLE_QUESTIONS,
    "past-continuous": PAST_CONTINUOUS_QUESTIONS, // <--- Register new banks here
};
```
