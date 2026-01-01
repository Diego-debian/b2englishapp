# Exercise Schema Definition

This document defines the data structure for the B2English exercise system. This schema serves as the foundational data model for the frontend practice mode, ensuring consistent structure across different exercise types.

## Core Schema

All exercises must share this base structure.

```typescript
type ExerciseType = 'mcq' | 'fill_blank' | 'order_words';
type ExerciseLevel = 'easy' | 'medium' | 'hard';

interface Exercise {
  id: string;           // Unique identifier
  tenseSlug: string;    // e.g., 'present-perfect', 'past-simple'
  type: ExerciseType;   // The mechanics of the question
  prompt: string;       // The question text or sentence context
  choices?: string[];   // For MCQ: distractors. For Order Words: scrambled words.
  answer: string | string[]; // The correct answer(s)
  explanation: string;  // Feedback displayed after answering
  level: ExerciseLevel; // Difficulty tier
}
```

---

## Exercise Types

### 1. Multiple Choice (MCQ)
Standard text-based question with one correct answer from a list of distractors.

*   **Pedagogical Note:** Best for recognizing correct forms and distinguishing between easily confused similar structures (distractors).

```json
{
  "id": "ex_mcq_001",
  "tenseSlug": "present-perfect",
  "type": "mcq",
  "level": "easy",
  "prompt": "I ______ (to see) that movie three times already.",
  "choices": [
    "have seen",
    "has seen",
    "saw",
    "seeing"
  ],
  "answer": "have seen",
  "explanation": "We use the Present Perfect 'have seen' because the time period (life up to now) is unfinished."
}
```

### 2. Fill in the Blank
User types the answer directly. Requires precise spelling and conjugation.

*   **Pedagogical Note:** Promotes active recall and spelling accuracy. More challenging than MCQ as it offers no visual cues.

```json
{
  "id": "ex_fib_001",
  "tenseSlug": "past-continuous",
  "type": "fill_blank",
  "level": "medium",
  "prompt": "While I was studying, my brother ______ (to play) guitar loudly.",
  "answer": "was playing",
  "explanation": "We use the Past Continuous 'was playing' for a long action in progress in the past."
}
```

### 3. Order Words
User reassembles a scrambled sentence into the correct grammatical order.

*   **Pedagogical Note:** Excellent for reinforcing sentence structure, word order (syntax), and the position of auxiliaries/adverbs.

```json
{
  "id": "ex_ord_001",
  "tenseSlug": "future-simple",
  "type": "order_words",
  "level": "medium",
  "prompt": "Construct a correct sentence.",
  "choices": [
    "will",
    "not",
    "she",
    "come",
    "tomorrow"
  ],
  "answer": "She will not come tomorrow",
  "explanation": "Standard Future Simple negation order: Subject + will + not + verb (base) + time marker."
}
```
