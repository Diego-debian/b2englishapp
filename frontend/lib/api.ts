import type {
  ActivityOut,
  AttemptStartIn,
  AttemptStartOut,
  ExampleOut,
  ProgressPayload,
  QuestionOut,
  SubmitAnswerIn,
  SubmitAnswerOut,
  TenseOut,
  Token,
  UserCreate,
  UserOut,
  UserStats,
  VerbOut
} from "./types";
import { storage } from "./storage";

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

function getBaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();
  return raw;
}

function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const rawText = await res.text();
  const payload = isJson ? safeJsonParse(rawText) : rawText;

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && (payload.detail || payload.message)) ||
      (typeof payload === "string" && payload) ||
      res.statusText ||
      "Request failed";

    const err: ApiError = {
      status: res.status,
      message: String(message),
      details: payload
    };
    throw err;
  }

  // Si schema es {} en OpenAPI, FastAPI puede devolver {}
  return (payload as T) ?? ({} as T);
}

function authHeader(): Record<string, string> {
  const st = storage.read();
  if (!st?.token) return {};
  return { Authorization: `Bearer ${st.token}` };
}

function buildUrl(path: string, query?: Record<string, any>): string {
  const base = getBaseUrl();
  if (!base) throw { status: 0, message: "NEXT_PUBLIC_API_URL no está configurado" } satisfies ApiError;

  const url = new URL(path, base.endsWith("/") ? base : base + "/");
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

/**
 * Fetch wrapper con:
 * - AbortController (via signal externo)
 * - auth header automático
 * - 401: logout storage (store se encargará en UI via guard/redir)
 */
async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  opts?: {
    query?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
    signal?: AbortSignal;
    contentType?: string;
  }
): Promise<T> {
  const url = buildUrl(path, opts?.query);

  const headers: Record<string, string> = {
    ...authHeader(),
    ...(opts?.headers ?? {})
  };

  let body: BodyInit | undefined = undefined;

  if (opts?.body !== undefined) {
    const ct = opts.contentType ?? "application/json";
    headers["Content-Type"] = ct;

    if (ct.includes("application/json")) {
      body = JSON.stringify(opts.body);
    } else {
      body = opts.body as BodyInit;
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
    signal: opts?.signal
  });

  // Interceptor 401: limpiar storage (sin loguear token)
  if (res.status === 401) {
    storage.clear();
  }

  return parseResponse<T>(res);
}

export const api = {
  // Health (opcional)
  health: (opts?: { signal?: AbortSignal }) => request<any>("GET", "/health", { signal: opts?.signal }),
  ready: (opts?: { signal?: AbortSignal }) => request<any>("GET", "/ready", { signal: opts?.signal }),
  metrics: (opts?: { signal?: AbortSignal }) => request<any>("GET", "/metrics", { signal: opts?.signal }),

  // Auth
  async login(username: string, password: string, opts?: { signal?: AbortSignal }): Promise<Token> {
    // x-www-form-urlencoded según contrato
    const body = new URLSearchParams();
    body.set("username", username);
    body.set("password", password);

    return request<Token>("POST", "/token", {
      body,
      contentType: "application/x-www-form-urlencoded",
      signal: opts?.signal
    });
  },

  register(data: UserCreate, opts?: { signal?: AbortSignal }): Promise<UserOut> {
    return request<UserOut>("POST", "/register", { body: data, signal: opts?.signal });
  },

  me(opts?: { signal?: AbortSignal }): Promise<UserOut> {
    return request<UserOut>("GET", "/me", { signal: opts?.signal });
  },

  // Users
  userStats(userId: number, opts?: { signal?: AbortSignal }): Promise<UserStats> {
    return request<UserStats>("GET", `/users/${userId}/stats`, { signal: opts?.signal });
  },

  // Verbs
  verbsList(
    params: { skip?: number; limit?: number },
    opts?: { signal?: AbortSignal }
  ): Promise<VerbOut[]> {
    return request<VerbOut[]>("GET", "/verbs", { query: params, signal: opts?.signal });
  },

  verbsSearch(
    params: { q: string; limit?: number },
    opts?: { signal?: AbortSignal }
  ): Promise<VerbOut[]> {
    return request<VerbOut[]>("GET", "/verbs/search", { query: params, signal: opts?.signal });
  },

  verbGet(verbId: number, opts?: { signal?: AbortSignal }): Promise<VerbOut> {
    return request<VerbOut>("GET", `/verbs/${verbId}`, { signal: opts?.signal });
  },

  // Tenses
  tensesList(opts?: { signal?: AbortSignal }): Promise<TenseOut[]> {
    return request<TenseOut[]>("GET", "/tenses", { signal: opts?.signal });
  },

  tenseExamples(tenseId: number, opts?: { signal?: AbortSignal }): Promise<ExampleOut[]> {
    return request<ExampleOut[]>("GET", `/tenses/${tenseId}/examples`, { signal: opts?.signal });
  },

  // Activities / Questions
  activitiesList(
    params: { tense_id?: number | null } = {},
    opts?: { signal?: AbortSignal }
  ): Promise<ActivityOut[]> {
    return request<ActivityOut[]>("GET", "/activities", { query: params, signal: opts?.signal });
  },

  activityQuestions(activityId: number, opts?: { signal?: AbortSignal }): Promise<QuestionOut[]> {
    return request<QuestionOut[]>("GET", `/activities/${activityId}/questions`, { signal: opts?.signal });
  },

  // Attempts
  attemptStart(body: AttemptStartIn, opts?: { signal?: AbortSignal }): Promise<AttemptStartOut> {
    return request<AttemptStartOut>("POST", "/attempts/start", { body, signal: opts?.signal });
  },

  attemptSubmit(body: SubmitAnswerIn, opts?: { signal?: AbortSignal }): Promise<SubmitAnswerOut> {
    return request<SubmitAnswerOut>("POST", "/attempts/submit", { body, signal: opts?.signal });
  },

  // Progress
  progressGet(opts?: { signal?: AbortSignal }): Promise<ProgressPayload> {
    return request<ProgressPayload>("GET", "/progress", { signal: opts?.signal });
  },

  progressInit(opts?: { signal?: AbortSignal }): Promise<any> {
    return request<any>("POST", "/progress/init", { signal: opts?.signal });
  }
};
