# Content Spec v1

> **Version:** 1.0 (Draft)
> **Date:** 2026-01-18
> **Status:** Active Spec

Este documento define la estructura de datos canónica para el sistema de contenido de B2English (Fase 7+).

---

## 1. Modelo de Datos (`ContentItemV1`)

### Campos Requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `slug` | `string` | Identificador único en URL. Ej: `present-simple-guide`. Debe ser URL-friendly. |
| `title` | `string` | Título principal del artículo. |
| `excerpt` | `string` | Resumen corto para cards y SEO description. |
| `body` | `string` | Contenido principal (Markdown o HTML). |
| `status` | `enum` | Estado del contenido: `draft`, `published`, `archived`. |
| `createdAt` | `string` | Fecha de creación (ISO 8601). |
| `updatedAt` | `string` | Fecha de última actualización (ISO 8601). |

### Campos Opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | Identificador interno (UUID). Opcional en esta fase (frontend-only). |
| `publishedAt` | `string` | Fecha de publicación (ISO 8601). **Requerido si status='published'**. |
| `tags` | `string[]` | Etiquetas para categorización. |
| `coverImageUrl` | `string` | URL de la imagen destacada. |
| `readingTimeMinutes` | `number` | Tiempo estimado de lectura. |
| `seoTitle` | `string` | Título específico para SEO (si difiere del title). |
| `seoDescription` | `string` | Descripción específica para SEO. |

---

## 2. Estados (`ContentStatus`)

- **`draft`**: Borrador. No visible en el feed público. Solo visible en Admin (Fase 8).
- **`published`**: Publicado. Visible en el feed público y sitemap. Requiere `publishedAt`.
- **`archived`**: Archivado. No visible en el feed por defecto, pero accesible por URL directa (o hidden).

---

## 3. Reglas de Negocio

1. **Unicidad de Slug**: No pueden existir dos items con el mismo `slug`.
2. **Visibilidad Pública**: Un item solo es visible públicamente si:
   - `status === 'published'`
   - `publishedAt` es anterior o igual a `now()` (si se implementa scheduling).
3. **Inmutabilidad de ID**: Si se asigna un `id`, este no debe cambiar.

---

## 4. Consideraciones Futuras

- **Persistencia (Fase 10)**: Este modelo se mapeará a una tabla/colección `content_items` en Supabase/Postgres.
- **Admin Content**: La UI de admin deberá validar estos campos antes de guardar.
