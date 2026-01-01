// Tipos EXACTOS del contrato OpenAPI pegado por el usuario.

export type UserCreate = {
  username: string; // minLength 3, maxLength 50
  email: string; // email format
  password: string; // minLength 6
};

export type UserOut = {
  id: number;
  username: string;
  email: string;
  total_xp: number;
};

export type Token = {
  access_token: string;
  token_type: string;
  user: UserOut;
};

export type VerbOut = {
  id: number;
  infinitive: string;
  past: string;
  participle: string;
  translation: string;
  example_b2: string;
};

export type TenseOut = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
};

export type ExampleOut = {
  id: number;
  tense_id: number;
  verb_id?: number | null;
  sentence: string;
  translation?: string | null;
  note?: string | null;
};

export type ActivityOut = {
  id: number;
  tense_id: number;
  type: string;
  title: string;
  description?: string | null;
  difficulty: number;
  is_active: boolean;
};

export type QuestionOut = {
  id: number;
  activity_id: number;
  kind: string;
  prompt: string;
  options?: any | null; // contrato: anyOf [{}, null]
  explanation?: string | null;
  xp_reward: number;
  sort_order: number;
};

export type AttemptStartIn = { activity_id: number };
export type AttemptStartOut = { attempt_id: number; activity_id: number };

export type SubmitAnswerIn = {
  attempt_id: number;
  question_id: number;
  user_answer?: string | null;
  time_ms?: number | null;
};

export type SubmitAnswerOut = {
  is_correct: boolean;
  xp_awarded: number;
  correct_answer?: string | null;
};

// /users/{id}/stats retorna object sin schema
export type UserStats = Record<string, unknown>;

// Progress endpoints retornan schema vacío en OpenAPI: tratamos como unknown
export type ProgressPayload = unknown;

// /progress/update (NO usado en modo Run por falta de verb_id en QuestionOut)
export type UserProgressUpdate = {
  user_id: number;
  verb_id: number;
  correct: boolean;
  xp: number;
};

// --- Exercise Schema (Frontend Foundation) ---

export type ExerciseType = 'mcq' | 'fill_blank' | 'order_words';
export type ExerciseLevel = 'easy' | 'medium' | 'hard';

export interface Exercise {
  id: string;
  tenseSlug: string;
  type: ExerciseType;
  prompt: string;
  choices?: string[];
  answer: string | string[];
  explanation: string;
  level: ExerciseLevel;
}
