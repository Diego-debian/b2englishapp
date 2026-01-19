# F7-T2: Content Spec v1 (Docs + Types)

> **Status:** ✅ Implementado
> **Spec Version:** 1.0

---

## Qué Se Creó

### 1. Fuente de Verdad (`docs/content-spec-v1.md`)
Modelo canónico para el contenido de B2English. Define:
- **Campos Requeridos:** `slug`, `title`, `excerpt`, `body`, `status`, `dates`.
- **Campos Opcionales:** `tags`, `coverImage`, `seo`, etc.
- **Estados:** `draft`, `published`, `archived`.
- **Reglas:** Unicidad de slug, visibilidad pública.

### 2. Tipado TypeScript (`frontend/lib/contentSpec.ts`)
Implementación en código del spec:
```typescript
export interface ContentItemV1 {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  // ... optional fields
}
```

### 3. Actualización de Mock Data (`frontend/lib/mockContent.ts`)
- Tipado estricto con `ContentItemV1[]`.
- Agregados campos faltantes (`status`, `createdAt`, `updatedAt`) a los items existentes.

---

## Validación

### Build ✅
```
npm run build → Exit code: 0
```
Se confirmó que los cambios de tipo no rompieron las páginas existentes (`/content/feed`, `/content/[slug]`) que consumen esta data.

---

## Archivos Tocados

- `docs/content-spec-v1.md` (NUEVO)
- `frontend/lib/contentSpec.ts` (NUEVO)
- `frontend/lib/mockContent.ts` (MODIFICADO)
- `docs/f7-t2-content-spec.md` (NUEVO)

## Qué NO Se Tocó

- Lógica de componentes React (solo consumen la data tipada).
- Backend / Database (aún no existe persistencia real).
- Header / Footer / Estilos.
