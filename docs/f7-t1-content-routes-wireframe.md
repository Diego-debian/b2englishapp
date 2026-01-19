# F7-T1: Infraestructura de Contenido (Frontend-Only)

> **Status:** ✅ Implementado
> **Flag:** `NEXT_PUBLIC_FEATURE_CONTENT` (OFF por defecto)

---

## Qué Se Creó

### 1. Mock Data (`frontend/lib/mockContent.ts`)
Shape de los artículos:
```typescript
interface ContentItem {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
}
```
Se incluyeron 3 artículos de prueba.

### 2. Feature Flag Helper
En `frontend/lib/featureFlags.ts`:
```typescript
export const isContentEnabled = () => isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_CONTENT);
```

### 3. Rutas
- `/content/feed` (Lista de artículos)
- `/content/[slug]` (Detalle de artículo)

Ambas rutas están protegidas por `isContentEnabled()`. Si el flag está OFF, redirigen a `/`.

---

## Cómo Activar

1. Agregar a `frontend/.env.local`:
```env
NEXT_PUBLIC_FEATURE_CONTENT=1
```
2. Reiniciar dev server.

---

## Pruebas Manuales

### Flag OFF (Default)
1. Asegurar `NEXT_PUBLIC_FEATURE_CONTENT` ausente o 0.
2. Navegar a `/content/feed` → Redirige a `/`.
3. Navegar a `/content/present-simple-guide` → Redirige a `/`.

### Flag ON
1. Setear `NEXT_PUBLIC_FEATURE_CONTENT=1`.
2. Navegar a `/content/feed`.
   - ✅ Muestra título "Latest Content".
   - ✅ Lista 3 cards desde mock data.
3. Clic en una card (e.g., "Guide to Present Simple").
   - ✅ Navega a `/content/present-simple-guide`.
   - ✅ Muestra título, fecha, excerpt y body.
   - ✅ Botón "Back to Feed" funciona.

---

## Archivos Tocados

- `frontend/lib/featureFlags.ts`
- `frontend/lib/mockContent.ts` (NUEVO)
- `frontend/app/content/feed/page.tsx` (NUEVO)
- `frontend/app/content/[slug]/page.tsx` (NUEVO)
- `docs/f7-t1-content-routes-wireframe.md` (NUEVO)

## Qué NO Se Tocó

- `/practice/*`
- `/dashboard`
- Stores
- Backend
