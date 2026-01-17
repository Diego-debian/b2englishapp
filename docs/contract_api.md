# API Contract: Frontend ↔ Backend (As-Is)

> **Documento diagnóstico (solo lectura)** — Generado: 2026-01-16  
> Este contrato refleja el estado REAL del código, no aspiraciones.

---

## A) Alcance y Reglas

1. **Fuente de verdad Backend**: `backend/app/main.py` (líneas 1-475)
2. **Fuente de verdad Frontend**: `frontend/lib/api.ts` (líneas 1-227)
3. **Auth**: JWT Bearer token vía `Authorization: Bearer {token}`
4. **Content-Type**: `application/json` (excepto `/token` que usa `application/x-www-form-urlencoded`)
5. **Errores**: `{"detail": "mensaje"}` con HTTP status codes

---

## B) Base URLs y Entornos

| Entorno | Variable | Valor Default |
|---------|----------|---------------|
| Frontend → Backend | `NEXT_PUBLIC_API_URL` | `http://localhost:8001` |
| Backend Port | `BACKEND_PORT` | `8001` |
| CORS Origins | `CORS_ORIGINS` | `["http://localhost:3000"]` |

**Evidencia:** `.env.example` líneas 35-36, `docker-compose.yml` líneas 36-37.

---

## C) Convenciones

### Headers Requeridos (endpoints autenticados)

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Endpoints Públicos (sin auth)

| Endpoint | Método |
|----------|--------|
| `GET /` | Root |
| `GET /health` | Health check |
| `GET /ready` | DB readiness |
| `GET /metrics` | Uptime |
| `POST /token` | Login |
| `POST /register` | Registro |

### Patrón de Error

```json
{
  "detail": "Error message string"
}
```

---

## D) Catálogo de Endpoints Backend

### Health (4 endpoints)

| Método | Path | Auth | Response | Evidencia |
|--------|------|------|----------|-----------|
| `GET` | `/` | ❌ | `{"message": "B2 English Verb Trainer API is running"}` | main.py:151-153 |
| `GET` | `/health` | ❌ | `{"status": "alive"}` | main.py:156-158 |
| `GET` | `/ready` | ❌ | `{"status": "ready"}` o 503 | main.py:161-167 |
| `GET` | `/metrics` | ❌ | `{"uptime_seconds": int}` | main.py:170-173 |

### Authentication (3 endpoints)

| Método | Path | Auth | Request | Response | Evidencia |
|--------|------|------|---------|----------|-----------|
| `POST` | `/token` | ❌ | `username`, `password` (form-urlencoded) | `Token` | main.py:179-189 |
| `POST` | `/register` | ❌ | `UserCreate` (JSON) | `UserOut` | main.py:192-194 |
| `GET` | `/me` | ✅ | - | `UserOut` | main.py:197-199 |

**Schemas:**
```
Token = {access_token: str, token_type: str, user: UserOut}
UserCreate = {username: str (3-50 chars), email: str, password: str (6+ chars)}
UserOut = {id: int, username: str, email: str, total_xp: int}
```

### Users (3 endpoints)

| Método | Path | Auth | Request | Response | Evidencia |
|--------|------|------|---------|----------|-----------|
| `GET` | `/users/{user_id}` | ✅ | - | `UserOut` | main.py:205-214 |
| `POST` | `/users/{user_id}/xp` | ✅ | `?xp_gain=int` (query) | `UserOut` | main.py:217-227 |
| `GET` | `/users/{user_id}/stats` | ✅ | - | `dict` | main.py:230-236 |

**Nota `/users/{user_id}/stats`:** Response model es `dict` genérico. Estructura real no determinable sin ejecutar `get_user_stats()`.

### Verbs (5 endpoints)

| Método | Path | Auth | Request | Response | Evidencia |
|--------|------|------|---------|----------|-----------|
| `GET` | `/verbs` | ✅ | `?skip=0&limit=100` | `List[VerbOut]` | main.py:242-249 |
| `GET` | `/verbs/search` | ✅ | `?q=str&limit=20` | `List[VerbOut]` | main.py:252-259 |
| `GET` | `/verbs/{verb_id}` | ✅ | - | `VerbOut` | main.py:262-271 |
| `POST` | `/verbs` | ✅ | `VerbCreate` | `VerbOut` | main.py:274-280 |
| `PATCH` | `/verbs/{verb_id}` | ✅ | `VerbUpdate` | `VerbOut` | main.py:283-293 |
| `DELETE` | `/verbs/{verb_id}` | ✅ | - | `{"message": "Verb deleted"}` | main.py:296-305 |

**Schemas:**
```
VerbOut = {id: int, infinitive: str, past: str, participle: str, translation: str, example_b2: str}
```

### Tenses (4 endpoints)

| Método | Path | Auth | Request | Response | Evidencia |
|--------|------|------|---------|----------|-----------|
| `GET` | `/tenses` | ✅ | - | `List[TenseOut]` | main.py:311-316 |
| `POST` | `/tenses` | ✅ | `TenseCreate` | `TenseOut` | main.py:319-325 |
| `GET` | `/tenses/{tense_id}/examples` | ✅ | - | `List[ExampleOut]` | main.py:328-334 |
| `POST` | `/tenses/{tense_id}/examples` | ✅ | `ExampleCreate` | `ExampleOut` | main.py:337-346 |

**Schemas:**
```
TenseOut = {id: int, code: str, name: str, description: str|null}
ExampleOut = {id: int, tense_id: int, verb_id: int|null, sentence: str, translation: str|null, note: str|null}
```

### Activities (5 endpoints)

| Método | Path | Auth | Request | Response | Evidencia |
|--------|------|------|---------|----------|-----------|
| `GET` | `/activities` | ✅ | `?tense_id=int` (opcional) | `List[ActivityOut]` | main.py:352-360 |
| `POST` | `/activities` | ✅ | `ActivityCreate` | `ActivityOut` | main.py:363-369 |
| `GET` | `/activities/{activity_id}` | ✅ | - | `ActivityOut` | main.py:372-381 |
| `GET` | `/activities/{activity_id}/questions` | ✅ | - | `List[QuestionOut]` | main.py:384-390 |
| `POST` | `/activities/{activity_id}/questions` | ✅ | `QuestionCreate` | `QuestionOut` | main.py:393-402 |

**Schemas:**
```
ActivityOut = {id: int, tense_id: int, type: str, title: str, description: str|null, difficulty: int, is_active: bool}
QuestionOut = {id: int, activity_id: int, kind: str, prompt: str, options: any|null, explanation: str|null, xp_reward: int, sort_order: int}
```

### Attempts (2 endpoints)

| Método | Path | Auth | Request | Response | Evidencia |
|--------|------|------|---------|----------|-----------|
| `POST` | `/attempts/start` | ✅ | `AttemptStartIn` | `AttemptStartOut` | main.py:405-412 |
| `POST` | `/attempts/submit` | ✅ | `SubmitAnswerIn` | `SubmitAnswerOut` | main.py:415-428 |

**Schemas:**
```
AttemptStartIn = {activity_id: int}
AttemptStartOut = {attempt_id: int, activity_id: int}
SubmitAnswerIn = {attempt_id: int, question_id: int, user_answer: str|null, time_ms: int|null}
SubmitAnswerOut = {is_correct: bool, xp_awarded: int, correct_answer: str|null}
```

### Practice / Progress (4 endpoints)

| Método | Path | Auth | Request | Response | Evidencia |
|--------|------|------|---------|----------|-----------|
| `GET` | `/practice/select` | ✅ | `?limit=10` | `List[VerbOut]` | main.py:434-440 |
| `POST` | `/progress/update` | ✅ | `UserProgressUpdate` | No determinable | main.py:443-457 |
| `GET` | `/progress` | ✅ | - | No determinable | main.py:460-465 |
| `POST` | `/progress/init` | ✅ | - | `{"initialized": int}` | main.py:468-474 |

**Schemas:**
```
UserProgressUpdate = {user_id: int, verb_id: int, correct: bool, xp: int}
```

**⚠️ Nota:** Response de `/progress` y `/progress/update` no tiene `response_model` definido. Estructura real: **No determinable con evidencia del código actual.**

---

## E) Mapa Frontend ↔ Backend

### Llamadas desde Frontend (`lib/api.ts`)

| Función FE | Endpoint FE | Método | Endpoint BE Existente | Match | Riesgo |
|------------|-------------|--------|----------------------|-------|--------|
| `api.health()` | `/health` | GET | `GET /health` | ✅ Sí | Ninguno |
| `api.ready()` | `/ready` | GET | `GET /ready` | ✅ Sí | Ninguno |
| `api.metrics()` | `/metrics` | GET | `GET /metrics` | ✅ Sí | Ninguno |
| `api.login()` | `/token` | POST | `POST /token` | ✅ Sí | Ninguno |
| `api.register()` | `/register` | POST | `POST /register` | ✅ Sí | Ninguno |
| `api.me()` | `/me` | GET | `GET /me` | ✅ Sí | Ninguno |
| `api.userStats()` | `/users/{id}/stats` | GET | `GET /users/{id}/stats` | ✅ Sí | Response es `dict` genérico |
| `api.verbsList()` | `/verbs` | GET | `GET /verbs` | ✅ Sí | Ninguno |
| `api.verbsSearch()` | `/verbs/search` | GET | `GET /verbs/search` | ✅ Sí | Ninguno |
| `api.verbGet()` | `/verbs/{id}` | GET | `GET /verbs/{id}` | ✅ Sí | Ninguno |
| `api.tensesList()` | `/tenses` | GET | `GET /tenses` | ✅ Sí | Ninguno |
| `api.tenseExamples()` | `/tenses/{id}/examples` | GET | `GET /tenses/{id}/examples` | ✅ Sí | Ninguno |
| `api.activitiesList()` | `/activities` | GET | `GET /activities` | ✅ Sí | Ninguno |
| `api.activityQuestions()` | `/activities/{id}/questions` | GET | `GET /activities/{id}/questions` | ✅ Sí | Ninguno |
| `api.attemptStart()` | `/attempts/start` | POST | `POST /attempts/start` | ✅ Sí | Ninguno |
| `api.attemptSubmit()` | `/attempts/submit` | POST | `POST /attempts/submit` | ✅ Sí | Ninguno |
| `api.progressGet()` | `/progress` | GET | `GET /progress` | ✅ Sí | Response no tipado |
| `api.progressInit()` | `/progress/init` | POST | `POST /progress/init` | ✅ Sí | Ninguno |

### Endpoints Backend NO Usados por Frontend

| Endpoint BE | Evidencia FE | Estado |
|-------------|--------------|--------|
| `GET /` | No usado | ⚠️ No llamado |
| `GET /users/{user_id}` | No en api.ts | ⚠️ No llamado |
| `POST /users/{user_id}/xp` | No en api.ts | ⚠️ No llamado |
| `POST /verbs` | No en api.ts | ⚠️ No llamado |
| `PATCH /verbs/{verb_id}` | No en api.ts | ⚠️ No llamado |
| `DELETE /verbs/{verb_id}` | No en api.ts | ⚠️ No llamado |
| `POST /tenses` | No en api.ts | ⚠️ No llamado |
| `POST /tenses/{id}/examples` | No en api.ts | ⚠️ No llamado |
| `POST /activities` | No en api.ts | ⚠️ No llamado |
| `GET /activities/{activity_id}` | No en api.ts | ⚠️ No llamado |
| `POST /activities/{id}/questions` | No en api.ts | ⚠️ No llamado |
| `GET /practice/select` | No en api.ts | ⚠️ No llamado |
| `POST /progress/update` | No en api.ts | ⚠️ No llamado |

### Llamadas Frontend SIN Endpoint Backend

| Feature FE | Ubicación | Llama a Backend | Notas |
|------------|-----------|-----------------|-------|
| Focus Mode Questions | `lib/focusQuestions.ts` | ❌ NO | 65KB hardcoded |
| Focus Mode Stats | `lib/focusStorage.ts` | ❌ NO | localStorage only |
| Streak Tracking | `store/practiceStore.ts` | ❌ NO | localStorage only |
| Level Calculation | `dashboard/page.tsx:68` | ❌ NO | `Math.floor(xp/100)+1` |

---

## F) No Determinable con Evidencia del Código Actual

1. **`GET /progress` response structure**: No tiene `response_model` en el handler. Depende de `get_user_progress()` en `crud/progress.py`.

2. **`POST /progress/update` response structure**: No tiene `response_model`. Depende de `update_user_progress()`.

3. **`GET /users/{id}/stats` campos exactos**: Response model es `dict`. Campos dependen de `get_user_stats()` en `crud/user.py`.

4. **Validación de `correct_answer` en `submit_answer()`**: La lógica de comparación está en `crud/activity.py`, no visible sin inspeccionar ese archivo.

5. **Comportamiento de 404 en attempts inexistentes**: Depende de implementación en `crud/activity.py:submit_answer()`.

---

## Resumen de Hallazgos

### Mismatches
- ❌ **Ningún mismatch crítico encontrado** — Todos los endpoints usados por FE existen en BE

### Riesgos Identificados

| Nivel | Descripción |
|-------|-------------|
| 🟡 Medio | Response de `/progress` y `/progress/update` sin typing estricto |
| 🟡 Medio | `/users/{id}/stats` retorna `dict` genérico |
| 🟢 Bajo | 13 endpoints BE existentes no usados por FE (funcionalidad futura) |
| 🔴 Alto | Focus Mode (65KB questions) no integrado con backend |
| 🔴 Alto | Streak tracking no persistido en backend |

### Cómo Validar Rápido

```bash
# 1. Levantar servicios
docker compose up --build

# 2. Verificar health (sin auth)
curl http://localhost:8001/health

# 3. Verificar OpenAPI docs generados
# Abrir: http://localhost:8001/docs

# 4. Verificar frontend build
cd frontend && npm run build
```
