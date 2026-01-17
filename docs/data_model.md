# B2English Data Model Documentation

> Documentación del modelo de datos actual (as-is) y propuesta mínima para Lessons+Blocks.

---

## 1. Alcance y Reglas

### Propósito

Este documento describe:
1. **Modelo ACTUAL (as-is):** Tablas existentes según evidencia en `backend/app/models/`.
2. **Modelo PROPUESTO:** Extensión mínima para soportar Lessons+Blocks (T0.3 Content Spec).

### Reglas del documento

- Todo lo documentado como "actual" MUST estar respaldado por código en el repositorio.
- Lo "propuesto" es conceptual — NO implica migraciones ni implementación.
- Si algo no se puede confirmar: se marca explícitamente como "No determinable".

### Fuente de evidencia

- `backend/app/models/base.py`
- `backend/app/models/user.py`
- `backend/app/models/verb.py`
- `backend/app/models/tense.py`
- `backend/app/models/progress.py`
- `backend/app/models/activity.py`

---

## 2. Modelo Actual (Tablas)

### 2.1 BaseModel (Abstracto)

Todos los modelos heredan de `BaseModel` que define:

| Columna      | Tipo      | Nullable | Default              | Notas           |
|--------------|-----------|----------|----------------------|-----------------|
| `id`         | Integer   | NO       | autoincrement        | PK, indexed     |
| `created_at` | DateTime  | NO       | `datetime.utcnow`    | —               |

---

### 2.2 `users`

**Archivo:** `models/user.py`

| Columna           | Tipo    | Nullable | Default | Constraints        |
|-------------------|---------|----------|---------|--------------------|
| `id`              | Integer | NO       | auto    | PK                 |
| `created_at`      | DateTime| NO       | utcnow  | —                  |
| `username`        | String  | NO       | —       | UNIQUE, indexed    |
| `email`           | String  | NO       | —       | UNIQUE, indexed    |
| `hashed_password` | String  | YES      | —       | —                  |
| `total_xp`        | Integer | NO       | 0       | —                  |

**Relaciones declaradas:**
- `progress` → `UserProgress` (one-to-many, cascade delete)
- `activity_attempts` → `ActivityAttempt` (one-to-many, cascade delete)
- `question_attempts` → `QuestionAttempt` (one-to-many, cascade delete)

---

### 2.3 `verbs`

**Archivo:** `models/verb.py`

| Columna       | Tipo   | Nullable | Default | Constraints     |
|---------------|--------|----------|---------|-----------------|
| `id`          | Integer| NO       | auto    | PK              |
| `created_at`  | DateTime| NO      | utcnow  | —               |
| `infinitive`  | String | NO       | —       | UNIQUE          |
| `past`        | String | NO       | —       | —               |
| `participle`  | String | NO       | —       | —               |
| `translation` | String | NO       | —       | —               |
| `example_b2`  | String | NO       | —       | —               |

**Relaciones declaradas:**
- `progress` → `UserProgress` (one-to-many, cascade delete)
- `tense_examples` → `TenseExample` (one-to-many, cascade delete)

---

### 2.4 `tenses`

**Archivo:** `models/tense.py`

| Columna       | Tipo   | Nullable | Default | Constraints     |
|---------------|--------|----------|---------|-----------------|
| `id`          | Integer| NO       | auto    | PK              |
| `created_at`  | DateTime| NO      | utcnow  | —               |
| `code`        | String | NO       | —       | UNIQUE, indexed |
| `name`        | String | NO       | —       | —               |
| `description` | Text   | YES      | —       | —               |

**Relaciones declaradas:**
- `examples` → `TenseExample` (one-to-many, cascade delete)
- `activities` → `Activity` (one-to-many, cascade delete)

---

### 2.5 `tense_examples`

**Archivo:** `models/tense.py`

| Columna       | Tipo    | Nullable | Default | Constraints              |
|---------------|---------|----------|---------|--------------------------|
| `id`          | Integer | NO       | auto    | PK                       |
| `created_at`  | DateTime| NO       | utcnow  | —                        |
| `tense_id`    | Integer | NO       | —       | FK → tenses.id (CASCADE) |
| `verb_id`     | Integer | YES      | —       | FK → verbs.id (SET NULL) |
| `sentence`    | Text    | NO       | —       | —                        |
| `translation` | Text    | YES      | —       | —                        |
| `note`        | Text    | YES      | —       | —                        |

**Relaciones declaradas:**
- `tense` → `Tense`
- `verb` → `Verb`

---

### 2.6 `activities`

**Archivo:** `models/activity.py`

| Columna       | Tipo    | Nullable | Default | Constraints              |
|---------------|---------|----------|---------|--------------------------|
| `id`          | Integer | NO       | auto    | PK                       |
| `created_at`  | DateTime| NO       | utcnow  | —                        |
| `tense_id`    | Integer | NO       | —       | FK → tenses.id (CASCADE) |
| `type`        | String  | NO       | —       | —                        |
| `title`       | String  | NO       | —       | —                        |
| `description` | Text    | YES      | —       | —                        |
| `difficulty`  | Integer | NO       | 1       | —                        |
| `is_active`   | Boolean | NO       | True    | —                        |

**Relaciones declaradas:**
- `tense` → `Tense`
- `questions` → `ActivityQuestion` (one-to-many, cascade delete)
- `attempts` → `ActivityAttempt` (one-to-many, cascade delete)

---

### 2.7 `activity_questions`

**Archivo:** `models/activity.py`

| Columna          | Tipo    | Nullable | Default | Constraints                 |
|------------------|---------|----------|---------|-----------------------------|
| `id`             | Integer | NO       | auto    | PK                          |
| `created_at`     | DateTime| NO       | utcnow  | —                           |
| `activity_id`    | Integer | NO       | —       | FK → activities.id (CASCADE)|
| `kind`           | String  | NO       | —       | —                           |
| `prompt`         | Text    | NO       | —       | —                           |
| `options`        | JSON    | YES      | —       | —                           |
| `correct_answer` | Text    | NO       | —       | —                           |
| `explanation`    | Text    | YES      | —       | —                           |
| `xp_reward`      | Integer | NO       | 10      | —                           |
| `sort_order`     | Integer | NO       | 0       | —                           |

**Relaciones declaradas:**
- `activity` → `Activity`
- `attempts` → `QuestionAttempt` (one-to-many, cascade delete)

---

### 2.8 `activity_attempts`

**Archivo:** `models/activity.py`

| Columna        | Tipo    | Nullable | Default | Constraints                 |
|----------------|---------|----------|---------|-----------------------------|
| `id`           | Integer | NO       | auto    | PK                          |
| `created_at`   | DateTime| NO       | utcnow  | —                           |
| `user_id`      | Integer | NO       | —       | FK → users.id (CASCADE)     |
| `activity_id`  | Integer | NO       | —       | FK → activities.id (CASCADE)|
| `started_at`   | DateTime| NO       | utcnow  | —                           |
| `completed_at` | DateTime| YES      | —       | —                           |
| `score`        | Integer | NO       | 0       | —                           |
| `xp_gained`    | Integer | NO       | 0       | —                           |
| `meta`         | JSON    | YES      | —       | —                           |

**Relaciones declaradas:**
- `user` → `User`
- `activity` → `Activity`
- `question_attempts` → `QuestionAttempt` (one-to-many, cascade delete)

---

### 2.9 `question_attempts`

**Archivo:** `models/activity.py`

| Columna       | Tipo    | Nullable | Default | Constraints                        |
|---------------|---------|----------|---------|------------------------------------|
| `id`          | Integer | NO       | auto    | PK                                 |
| `created_at`  | DateTime| NO       | utcnow  | —                                  |
| `user_id`     | Integer | NO       | —       | FK → users.id (CASCADE)            |
| `question_id` | Integer | NO       | —       | FK → activity_questions.id (CASCADE)|
| `attempt_id`  | Integer | NO       | —       | FK → activity_attempts.id (CASCADE)|
| `user_answer` | Text    | YES      | —       | —                                  |
| `is_correct`  | Boolean | NO       | False   | —                                  |
| `time_ms`     | Integer | YES      | —       | —                                  |

**Relaciones declaradas:**
- `question` → `ActivityQuestion`
- `attempt` → `ActivityAttempt`
- `user` → `User`

---

### 2.10 `user_progress`

**Archivo:** `models/progress.py`

| Columna      | Tipo    | Nullable | Default | Constraints             |
|--------------|---------|----------|---------|-------------------------|
| `id`         | Integer | NO       | auto    | PK                      |
| `created_at` | DateTime| NO       | utcnow  | —                       |
| `user_id`    | Integer | NO       | —       | FK → users.id (CASCADE) |
| `verb_id`    | Integer | NO       | —       | FK → verbs.id (CASCADE) |
| `srs_date`   | DateTime| NO       | utcnow  | —                       |
| `mistakes`   | Integer | NO       | 0       | —                       |
| `streak`     | Integer | NO       | 0       | —                       |

**Relaciones declaradas:**
- `user` → `User`
- `verb` → `Verb`

---

## 3. Relaciones Actuales (ERD Textual)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           B2English Data Model (as-is)                       │
└─────────────────────────────────────────────────────────────────────────────┘

  users ─────────────┬──────────────────┬─────────────────────────────────────┐
    │                │                  │                                     │
    │ 1:N            │ 1:N              │ 1:N                                 │
    ▼                ▼                  ▼                                     │
  user_progress   activity_attempts  question_attempts ◄──────────────────────┤
    │                │                  │                                     │
    │                │                  │                                     │
    ▼                ▼                  ▼                                     │
  verbs           activities ◄──── activity_questions                         │
    │                │                                                        │
    │ 1:N            │ N:1                                                    │
    ▼                ▼                                                        │
  tense_examples   tenses                                                     │
                     │                                                        │
                     │ 1:N                                                    │
                     ▼                                                        │
                   tense_examples                                             │
                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Relaciones clave:
• users (1) ──► (N) user_progress ◄── (N) verbs (1)
• users (1) ──► (N) activity_attempts ◄── (N) activities (1)
• users (1) ──► (N) question_attempts
• tenses (1) ──► (N) activities
• tenses (1) ──► (N) tense_examples ◄── (N) verbs (1)
• activities (1) ──► (N) activity_questions
• activity_attempts (1) ──► (N) question_attempts
• activity_questions (1) ──► (N) question_attempts
```

---

## 4. GAPS vs Content Spec (T0.3)

| Concepto T0.3           | Estado Actual                          | Gap                                      |
|-------------------------|----------------------------------------|------------------------------------------|
| Lesson                  | NO existe                              | Tabla requerida                          |
| Lesson.status           | NO existe                              | Campo draft/published requerido          |
| Lesson.audience         | NO existe                              | Campos level/tense/mode requeridos       |
| Block                   | NO existe                              | Tabla requerida                          |
| Block.type              | NO existe                              | Campo type requerido (youtube/text/cta)  |
| Block.order             | NO existe                              | Campo para ordenamiento                  |
| Block.content (JSON)    | NO existe                              | Campos variables según type              |

**Conclusión:** El modelo actual NO soporta Lessons ni Blocks. Se requiere extensión.

---

## 5. Modelo Propuesto Mínimo

### 5.1 Tabla: `lessons`

| Columna         | Tipo    | Nullable | Default | Constraints        | Nota                          |
|-----------------|---------|----------|---------|--------------------|-------------------------------|
| `id`            | Integer | NO       | auto    | PK                 | —                             |
| `created_at`    | DateTime| NO       | utcnow  | —                  | Hereda de BaseModel           |
| `slug`          | String  | NO       | —       | UNIQUE, indexed    | Identificador legible         |
| `title`         | String  | NO       | —       | —                  | Título mostrable              |
| `status`        | String  | NO       | 'draft' | CHECK in (draft, published) | T0.3 requirement |
| `level`         | String  | YES      | —       | —                  | CEFR level (B1, B2, C1)       |
| `tense`         | String  | YES      | —       | —                  | Tiempo verbal principal       |
| `mode`          | String  | YES      | —       | —                  | Modo de práctica              |

**Decisión de diseño:** Campos de audience (`level`, `tense`, `mode`) embebidos directamente en `lessons` en lugar de tabla separada. Razón: simplicidad MVP, sin joins adicionales.

---

### 5.2 Tabla: `lesson_blocks`

| Columna         | Tipo    | Nullable | Default | Constraints                  | Nota                        |
|-----------------|---------|----------|---------|------------------------------|-----------------------------|
| `id`            | Integer | NO       | auto    | PK                           | —                           |
| `created_at`    | DateTime| NO       | utcnow  | —                            | Hereda de BaseModel         |
| `lesson_id`     | Integer | NO       | —       | FK → lessons.id (CASCADE)    | —                           |
| `type`          | String  | NO       | —       | CHECK in (youtube, text, cta)| T0.3 block types            |
| `order`         | Integer | NO       | —       | —                            | Posición en secuencia       |
| `content`       | JSON    | NO       | —       | —                            | Campos variables por type   |

**Estructura de `content` por type:**

```json
// type: "youtube"
{
  "video_id": "dQw4w9WgXcQ",
  "title": "Optional video title"
}

// type: "text"
{
  "content": "Markdown text content here..."
}

// type: "cta"
{
  "label": "Button text",
  "action": "link",
  "target": "https://example.com"
}
```

---

### 5.3 Constraints Sugeridos (Lógicos)

> ⚠️ **NOTA:** Estos son constraints RECOMENDADOS para implementación futura. NO son constraints reales en DB actualmente.

| Constraint                          | Tipo              | Tabla/Campo                  | Descripción                          |
|-------------------------------------|-------------------|------------------------------|--------------------------------------|
| Unique lesson identifier            | UNIQUE            | `lessons.slug`               | Sin duplicados de slug               |
| Unique block order per lesson       | UNIQUE (RECOMENDADO) | `(lesson_id, order)`      | Sin orden duplicado en misma lesson  |
| Max 2 CTA per lesson                | BUSINESS LOGIC    | —                            | Validar en backend (Pydantic), NO en DB |
| Valid block types                   | CHECK (RECOMENDADO) | `lesson_blocks.type`       | Solo youtube/text/cta                |
| Valid lesson status                 | CHECK (RECOMENDADO) | `lessons.status`           | Solo draft/published                 |

**Regla de negocio T0.3:** "MUST NOT haber más de 2 bloques `cta` por Lesson" (content_spec.md §3.3) — implementar como validación de aplicación, no como constraint de base de datos.

---

## 6. Mapping T0.3 → Campos/Tablas

| Concepto T0.3                | Tabla Propuesta    | Campo(s)                      |
|------------------------------|--------------------|-------------------------------|
| Lesson.id                    | `lessons`          | `id` (PK) + `slug` (human)    |
| Lesson.title                 | `lessons`          | `title`                       |
| Lesson.status                | `lessons`          | `status`                      |
| Lesson.audience.level        | `lessons`          | `level`                       |
| Lesson.audience.tense        | `lessons`          | `tense`                       |
| Lesson.audience.mode         | `lessons`          | `mode`                        |
| Block.type                   | `lesson_blocks`    | `type`                        |
| Block.order                  | `lesson_blocks`    | `order`                       |
| Block.video_id (youtube)     | `lesson_blocks`    | `content->video_id`           |
| Block.content (text)         | `lesson_blocks`    | `content->content`            |
| Block.label (cta)            | `lesson_blocks`    | `content->label`              |
| Block.action (cta)           | `lesson_blocks`    | `content->action`             |
| Block.target (cta)           | `lesson_blocks`    | `content->target`             |

---

## 7. Riesgos y Decisiones

### Decisiones tomadas

| Decisión                                    | Razón                                          |
|---------------------------------------------|------------------------------------------------|
| Audience embebida (no tabla separada)       | Simplicidad MVP, evita joins innecesarios      |
| JSON para content de blocks                 | Flexibilidad por tipo sin tablas adicionales   |
| `slug` como identificador humano            | Permite URLs amigables sin exponer IDs         |
| Max 2 CTA como validación de app            | Constraints lógicos no siempre van en DB       |

### Riesgos identificados

| Riesgo                                      | Impacto                                        | Mitigación                                      |
|---------------------------------------------|------------------------------------------------|-------------------------------------------------|
| JSON sin schema en DB                       | Datos inconsistentes posibles                  | Validación estricta en backend (Pydantic)       |
| Sin FK a tenses para lesson.tense           | No hay integridad referencial                  | Aceptable para MVP; refactorizar post-beta      |
| Sin versionado de lessons                   | No hay historial de cambios                    | Fuera de scope beta (documentado en T0.3)       |

### NO se propone

- Migraciones SQL/DDL
- Cambios a tablas existentes
- Refactor de modelos actuales
- Endpoints de API

---

## 8. No Determinable

Los siguientes elementos NO se pueden confirmar con evidencia del código actual:

| Elemento                          | Razón                                                |
|-----------------------------------|------------------------------------------------------|
| Índices reales en PostgreSQL      | Solo vemos declaraciones SQLAlchemy, no DDL real     |
| Cascade behavior real             | Depende de versión y config de PostgreSQL            |
| Collation de strings              | No declarado en modelos                              |
| JSON column type in PostgreSQL    | Asumimos `JSON` nativo, pero podría ser `JSONB`      |
| Existencia de tablas en DB actual | Solo vemos modelos, no confirmamos schema real       |

---

## Changelog

| Versión | Fecha      | Cambios                          |
|---------|------------|----------------------------------|
| 0.1.0   | 2026-01-16 | Versión inicial beta             |
