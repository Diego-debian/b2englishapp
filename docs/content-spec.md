# Content Spec — Feed/WordPress-Style Content

> **Propósito:** Definir el modelo de contenido tipo feed para B2English.
> **Status:** Especificación de diseño (NO implementado).
> **Prerrequisito:** Leer `docs/expansion-zones.md` y `docs/feature-flags.md`.

---

## 1. Tipos de Contenido

B2English soporta cuatro tipos de contenido para el feed editorial:

| Tipo | Propósito | Uso Típico |
|------|-----------|------------|
| `video` | Contenido audiovisual embebido (YouTube) | Explicaciones, tutoriales, demos |
| `text` | Artículos o publicaciones textuales | Guías, tips, explicaciones escritas |
| `story` | Contenido breve tipo micro-post | Tips rápidos, datos curiosos, frases destacadas |
| `cta` | Llamada a la acción independiente | Promociones, invitaciones a práctica |

---

## 2. Campos por Tipo

### 2.1 Tipo `video`

**Propósito:** Embeber videos de YouTube como contenido principal del feed.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `type` | string | MUST | Valor fijo: `"video"` |
| `slug` | string | MUST | Identificador único URL-safe |
| `title` | string | MUST | Título visible del contenido |
| `video_id` | string | MUST | ID de YouTube (11 caracteres) |
| `description` | string | SHOULD | Resumen breve del video |
| `level` | string | MAY | Nivel CEFR (B1, B2, C1) |
| `tense` | string | MAY | Tiempo verbal relacionado |
| `status` | string | MUST | Estado de publicación |
| `published_at` | datetime | MAY | Fecha de publicación |
| `author` | string | MAY | Autor o fuente |

---

### 2.2 Tipo `text`

**Propósito:** Publicaciones textuales tipo artículo o guía.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `type` | string | MUST | Valor fijo: `"text"` |
| `slug` | string | MUST | Identificador único URL-safe |
| `title` | string | MUST | Título visible del contenido |
| `body` | string | MUST | Contenido principal (markdown permitido) |
| `excerpt` | string | SHOULD | Extracto para preview en feed |
| `level` | string | MAY | Nivel CEFR (B1, B2, C1) |
| `tense` | string | MAY | Tiempo verbal relacionado |
| `status` | string | MUST | Estado de publicación |
| `published_at` | datetime | MAY | Fecha de publicación |
| `author` | string | MAY | Autor del contenido |
| `reading_time` | number | MAY | Tiempo estimado de lectura (minutos) |

---

### 2.3 Tipo `story`

**Propósito:** Contenido breve tipo micro-post para tips rápidos o destacados.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `type` | string | MUST | Valor fijo: `"story"` |
| `slug` | string | MUST | Identificador único URL-safe |
| `headline` | string | MUST | Frase principal o titular |
| `body` | string | MAY | Texto adicional breve |
| `highlight` | boolean | MAY | Indica si es contenido destacado |
| `level` | string | MAY | Nivel CEFR (B1, B2, C1) |
| `status` | string | MUST | Estado de publicación |
| `published_at` | datetime | MAY | Fecha de publicación |

**Restricciones:**
- `headline` MUST NOT exceder 140 caracteres.
- `body` SHOULD NOT exceder 280 caracteres.

---

### 2.4 Tipo `cta`

**Propósito:** Llamada a la acción independiente en el feed.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `type` | string | MUST | Valor fijo: `"cta"` |
| `slug` | string | MUST | Identificador único URL-safe |
| `label` | string | MUST | Texto del botón/enlace |
| `action` | string | MUST | Tipo: `"internal_link"`, `"external_link"`, `"practice"` |
| `target` | string | MUST | URL destino o referencia interna |
| `description` | string | MAY | Texto secundario explicativo |
| `style` | string | MAY | Estilo visual: `"primary"`, `"secondary"`, `"subtle"` |
| `status` | string | MUST | Estado de publicación |
| `published_at` | datetime | MAY | Fecha de publicación |

**Restricciones:**
- `label` MUST NOT exceder 50 caracteres.
- Si `action` es `"external_link"`, `target` MUST ser URL válida (https).
- Si `action` es `"internal_link"`, `target` MUST comenzar con `/`.
- Si `action` es `"practice"`, `target` SHOULD ser un tense_slug válido.

---

## 3. Reglas de Slug

### Formato

- El slug MUST ser único globalmente (no solo por tipo).
- El slug MUST contener solo caracteres alfanuméricos minúsculos y guiones.
- El slug MUST NOT comenzar ni terminar con guión.
- El slug MUST tener entre 3 y 100 caracteres.

### Patrón Regex

```
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

### Ejemplos Válidos

| ✅ Válido | ❌ Inválido | Razón |
|-----------|-------------|-------|
| `present-simple-intro` | `Present-Simple` | Mayúsculas |
| `tip-of-the-day-1` | `tip_of_the_day` | Underscores |
| `b2-grammar-basics` | `-grammar-basics` | Comienza con guión |
| `video-2026-01` | `video--double` | Guiones consecutivos |

---

## 4. Estados de Publicación

| Estado | Visible en Feed | Accesible por URL | Descripción |
|--------|:---------------:|:-----------------:|-------------|
| `draft` | ❌ | ❌ | En edición, solo visible para admin |
| `published` | ✅ | ✅ | Visible para todos los usuarios |
| `archived` | ❌ | ✅ | No aparece en feed pero accesible directamente |

### Reglas de Transición

```
draft → published    ✅ Permitido
published → archived ✅ Permitido
archived → published ✅ Permitido
published → draft    ⚠️ Requiere confirmación (rompe URLs)
draft → archived     ❌ No permitido (debe publicarse primero)
```

### Comportamiento en Frontend

| Estado | Comportamiento cuando se accede |
|--------|----------------------------------|
| `draft` | 404 o redirect según feature flag |
| `published` | Render normal |
| `archived` | Render con banner "Este contenido está archivado" |

---

## 5. Reglas de Render

### Orden en Feed

- Los items SHOULD ordenarse por `published_at` descendente (más reciente primero).
- Solo items con `status: published` MUST aparecer en el feed público.
- Items con `highlight: true` MAY mostrarse en posición privilegiada.

### Render por Tipo

| Tipo | Componente Sugerido | Campos Visibles en Card |
|------|---------------------|-------------------------|
| `video` | Thumbnail + iframe | `title`, `description`, thumbnail |
| `text` | Card con excerpt | `title`, `excerpt`, `reading_time` |
| `story` | Card compacta | `headline`, `body` |
| `cta` | Botón/banner | `label`, `description` |

### Render Determinista

- Dado el mismo item, el frontend MUST producir el mismo output visual.
- El render MUST NOT depender de hora, ubicación, o preferencias del usuario.
- Si un item tiene datos inválidos, el frontend SHOULD mostrar placeholder de error.

---

## 6. Feature Flag Asociada

Según `docs/feature-flags.md`, el feed de contenido se controla con:

| Variable | Efecto cuando ON | Efecto cuando OFF |
|----------|------------------|-------------------|
| `NEXT_PUBLIC_FEATURE_CONTENT_FEED` | Rutas `/content/*` activas | 404 o redirect a home |

> No determinable con evidencia del código actual: La implementación específica de guards/middleware para esta flag.

---

## 7. Ejemplos JSON por Tipo

### Ejemplo: Video

```json
{
  "type": "video",
  "slug": "present-simple-explained",
  "title": "Present Simple Explained in 5 Minutes",
  "video_id": "dQw4w9WgXcQ",
  "description": "A quick overview of when and how to use the present simple tense.",
  "level": "B2",
  "tense": "present_simple",
  "status": "published",
  "published_at": "2026-01-18T10:00:00Z",
  "author": "B2English Team"
}
```

---

### Ejemplo: Text

```json
{
  "type": "text",
  "slug": "10-common-mistakes-present-perfect",
  "title": "10 Common Mistakes with Present Perfect",
  "body": "# Introduction\n\nMany learners struggle with present perfect...\n\n## Mistake 1: Using 'ago'\n\n❌ I have seen him two days ago.\n✅ I saw him two days ago.\n\n...",
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

### Ejemplo: Story

```json
{
  "type": "story",
  "slug": "tip-irregular-verbs-song",
  "headline": "🎵 Try singing irregular verbs to a tune you know!",
  "body": "Music helps memory. Pick your favorite song and fit the irregular verbs to the melody.",
  "highlight": true,
  "level": "B1",
  "status": "published",
  "published_at": "2026-01-16T09:00:00Z"
}
```

---

### Ejemplo: CTA

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

## 8. Límites Explícitos de Beta

### No Soportado

| Característica | Razón |
|----------------|-------|
| Contenido interactivo (quizzes embebidos) | Separación content vs practice |
| Comentarios en items | Complejidad de moderación |
| Versionado de contenido | Complejidad prematura |
| Programación de publicación (scheduling) | Requiere jobs/cron |
| Múltiples autores por item | Complejidad de permisos |
| Tags/categorías | Scope reducido para beta |
| Búsqueda full-text | Requiere infraestructura adicional |
| Analytics por item | Tracking global suficiente |

### Fuera de Scope

- Sincronización con CMS externo
- Importación/exportación bulk
- API pública de contenido
- RSS/Atom feeds

---

## 9. Relación con Otras Especificaciones

| Documento | Relación |
|-----------|----------|
| [expansion-zones.md](expansion-zones.md) | Define rutas permitidas: `/content/*` |
| [feature-flags.md](feature-flags.md) | Define flag `FEATURE_CONTENT_FEED` |
| [content_spec.md](content_spec.md) | Modelo de Lesson/Block (complementario, no reemplaza) |

### Diferencia con content_spec.md (Lesson/Block)

| Aspecto | Este spec (Feed) | content_spec.md (Lessons) |
|---------|------------------|---------------------------|
| Unidad | Item individual en feed | Lesson compuesta de blocks |
| Estructura | Plana, un nivel | Jerárquica (Lesson → Blocks) |
| Uso | Consumo rápido, scroll infinito | Consumo lineal, profundo |
| Navegación | Feed cronológico | Por lesson individual |

---

## Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 0.1.0 | 2026-01-18 | Versión inicial — Feed content types |

---

*Creado: 2026-01-18*
