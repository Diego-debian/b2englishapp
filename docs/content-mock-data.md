# Content Mock Data — B2English

> **Propósito:** Definir la fuente de datos inicial (mock JSON) para el sistema de contenido.
> **Status:** Especificación de diseño (NO implementado).
> **Prerrequisitos:**
> - [content-spec.md](content-spec.md) — Modelo de datos
> - [b2english-content-infra.md](b2english-content-infra.md) — Infraestructura

---

## 1. Ubicación del JSON

### Ruta Propuesta

```
frontend/data/content.json
```

### Alternativas Consideradas

| Ubicación | Pros | Contras | Decisión |
|-----------|------|---------|----------|
| `frontend/data/content.json` | Import directo, type-safe | No accesible vía URL | ✅ Recomendada |
| `public/data/content.json` | Accesible vía fetch | Sin validación build-time | Alternativa |
| `frontend/lib/content/data.ts` | TypeScript nativo | Mezcla datos con código | ❌ No recomendada |

### Justificación

- **`frontend/data/`** es zona de expansión (no toca core).
- Import estático permite validación TypeScript en build.
- Cambios requieren rebuild (aceptable para beta con pocos items).

---

## 2. Estructura del JSON

### Schema Raíz

```json
{
  "version": "0.1.0",
  "generated_at": "2026-01-18T00:00:00Z",
  "items": [...]
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `version` | string | MUST | Versión semántica del schema |
| `generated_at` | datetime | SHOULD | Timestamp de última edición |
| `items` | array | MUST | Array de content items |

---

### 2.1 Item Tipo `video`

```json
{
  "type": "video",
  "slug": "present-simple-explained",
  "title": "Present Simple Explained in 5 Minutes",
  "video_id": "dQw4w9WgXcQ",
  "description": "A quick overview of when and how to use present simple.",
  "level": "B2",
  "tense": "present_simple",
  "status": "published",
  "published_at": "2026-01-18T10:00:00Z",
  "author": "B2English Team"
}
```

---

### 2.2 Item Tipo `text`

```json
{
  "type": "text",
  "slug": "10-common-mistakes-present-perfect",
  "title": "10 Common Mistakes with Present Perfect",
  "body": "# Introduction\n\nMany learners struggle with present perfect...\n\n## Mistake 1\n\n❌ I have seen him yesterday.\n✅ I saw him yesterday.",
  "excerpt": "Avoid these frequent errors when using present perfect tense.",
  "level": "B2",
  "tense": "present_perfect",
  "status": "published",
  "published_at": "2026-01-17T14:30:00Z",
  "author": "Grammar Team",
  "reading_time": 4
}
```

---

### 2.3 Item Tipo `story`

```json
{
  "type": "story",
  "slug": "tip-irregular-verbs-song",
  "headline": "🎵 Try singing irregular verbs to a tune you know!",
  "body": "Music helps memory. Pick your favorite song and fit the verbs to the melody.",
  "highlight": true,
  "level": "B1",
  "status": "published",
  "published_at": "2026-01-16T09:00:00Z"
}
```

---

### 2.4 Item Tipo `cta`

```json
{
  "type": "cta",
  "slug": "practice-present-perfect-now",
  "label": "Practice Present Perfect",
  "action": "internal_link",
  "target": "/practice/focus?tense=present_perfect",
  "description": "Test your knowledge with 10 quick questions.",
  "style": "primary",
  "status": "published",
  "published_at": "2026-01-15T12:00:00Z"
}
```

---

## 3. Ejemplo Completo Mínimo

```json
{
  "version": "0.1.0",
  "generated_at": "2026-01-18T00:00:00Z",
  "items": [
    {
      "type": "video",
      "slug": "present-simple-intro",
      "title": "Introduction to Present Simple",
      "video_id": "dQw4w9WgXcQ",
      "description": "Learn the basics of present simple tense.",
      "level": "B2",
      "status": "published",
      "published_at": "2026-01-18T10:00:00Z"
    },
    {
      "type": "text",
      "slug": "when-to-use-present-simple",
      "title": "When to Use Present Simple",
      "body": "# Overview\n\nUse present simple for:\n- Habits\n- Facts\n- Schedules",
      "excerpt": "Quick guide on present simple usage.",
      "status": "published",
      "published_at": "2026-01-17T15:00:00Z"
    },
    {
      "type": "story",
      "slug": "quick-tip-third-person-s",
      "headline": "📝 Don't forget the -s in third person!",
      "body": "He works, she plays, it runs.",
      "highlight": false,
      "status": "published",
      "published_at": "2026-01-16T08:00:00Z"
    },
    {
      "type": "cta",
      "slug": "try-present-simple-practice",
      "label": "Practice Now",
      "action": "internal_link",
      "target": "/practice",
      "description": "Ready to test your knowledge?",
      "style": "primary",
      "status": "published",
      "published_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

## 4. Reglas de Datos

### 4.1 Unicidad

| Campo | Regla |
|-------|-------|
| `slug` | MUST ser único globalmente (no solo por tipo) |
| Combinación `type + slug` | Redundante si slug es único |

### 4.2 Estados Válidos

| Status | Visible en Feed | Visible en Detalle |
|--------|:---------------:|:------------------:|
| `draft` | ❌ | ❌ |
| `published` | ✅ | ✅ |
| `archived` | ❌ | ✅ |

### 4.3 Orden en Feed

- Items SHOULD ordenarse por `published_at` descendente.
- Items con `highlight: true` MAY mostrarse primero.

### 4.4 Validación de Campos

| Campo | Validación |
|-------|------------|
| `slug` | Regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| `video_id` | Exactamente 11 caracteres alfanuméricos |
| `headline` (story) | Max 140 caracteres |
| `body` (story) | Max 280 caracteres |
| `label` (cta) | Max 50 caracteres |
| `action` (cta) | Enum: `internal_link`, `external_link`, `practice` |

---

## 5. Reglas de Edición

### 5.1 Workflow Manual

```
1. Editar frontend/data/content.json
2. Validar JSON syntax (linter o IDE)
3. Verificar slugs únicos
4. Rebuild frontend (npm run build)
5. Deploy
```

### 5.2 Qué NO se Soporta

| Feature | Razón |
|---------|-------|
| Edición via UI | Sin admin panel en beta |
| Validación automática | Sin backend |
| Versionado de items | Complejidad prematura |
| Scheduling | Sin jobs/cron |

---

## 6. Checklist de Validación

Antes de commit/deploy, verificar:

### Syntax
- [ ] JSON válido (sin trailing commas, comillas correctas)
- [ ] Campo `version` presente
- [ ] Array `items` no vacío (al menos 1 item)

### Por cada Item
- [ ] `type` es uno de: `video`, `text`, `story`, `cta`
- [ ] `slug` es único y cumple regex
- [ ] `status` es uno de: `draft`, `published`, `archived`
- [ ] Campos MUST del tipo están presentes

### Por Tipo
- [ ] `video`: `video_id` tiene 11 caracteres
- [ ] `text`: `body` no está vacío
- [ ] `story`: `headline` ≤ 140 chars
- [ ] `cta`: `action` es válido, `target` presente

### Integridad
- [ ] No hay slugs duplicados
- [ ] Fechas en formato ISO 8601
- [ ] URLs internas comienzan con `/`
- [ ] URLs externas comienzan con `https://`

---

## 7. Herramientas de Validación Sugeridas

> No determinable con evidencia del código actual: Qué herramientas existen en el proyecto.

### Opciones Futuras

| Herramienta | Uso |
|-------------|-----|
| JSON Schema | Validación automática de estructura |
| TypeScript types | Validación en build time |
| ESLint plugin | Validación en IDE |
| Script de validación | `npm run validate:content` |

---

## 8. Migración Futura

Cuando se implemente backend:

```
Mock JSON (ahora)
      ↓
API endpoint (futuro)
      ↓
Base de datos (futuro)
```

### Compatibilidad

- La estructura del JSON SHOULD ser compatible con futura API response.
- Los campos MUST NOT cambiar nombres al migrar.
- Nuevos campos MAY agregarse sin romper compatibilidad.

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [content-spec.md](content-spec.md) | Definición de tipos y campos |
| [b2english-content-infra.md](b2english-content-infra.md) | Arquitectura del sistema |
| [expansion-zones.md](expansion-zones.md) | Zonas permitidas |

---

*Creado: 2026-01-18*
