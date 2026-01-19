# F6-T5: SEO + Social Share para /support

> **Status:** ✅ Implementado

---

## Qué Se Cambió

### Nuevo archivo: `frontend/app/support/layout.tsx`

Metadata estática con:
- **Title:** "Donaciones — B2 English"
- **Description:** Apoya B2 English...
- **OpenGraph:** type=website, locale=es_ES
- **Twitter Card:** summary
- **Robots:** index, follow

---

## OG Image

> **No determinable con evidencia del código actual.**
>
> No existe carpeta `/public` ni assets de imagen en el frontend.
> Cuando se agregue un asset, actualizar `openGraph.images` en layout.tsx.

---

## Feature Flag Behavior

| Estado | Comportamiento |
|--------|----------------|
| `FEATURE_SUPPORT=1` | Metadata visible, página accesible |
| `FEATURE_SUPPORT=0` | page.tsx redirige a `/` (layout se ignora) |

**Nota:** La metadata se declara estáticamente en layout.tsx. 
El redirect ocurre en page.tsx via `isSupportEnabled()`.

---

## Archivos Tocados (1 + doc)

| Archivo | Cambio |
|---------|--------|
| `frontend/app/support/layout.tsx` | **NUEVO** - SEO metadata |
| `docs/f6-t5-support-seo-social.md` | **NUEVO** |

---

## Pruebas Manuales

### Flag ON
1. `NEXT_PUBLIC_FEATURE_SUPPORT=1`
2. `npm run dev`
3. Navegar a `/support`
4. View Source o DevTools → Verificar:
   ```html
   <title>Donaciones — B2 English</title>
   <meta property="og:title" content="Donaciones — B2 English">
   <meta name="twitter:card" content="summary">
   ```

### Flag OFF
1. Eliminar flag
2. Reiniciar
3. `/support` → Redirige a `/` (metadata no se renderiza en cliente)

---

## Qué NO Se Tocó

- ❌ `frontend/app/support/page.tsx`
- ❌ Header/Footer
- ❌ `/practice/*`, `/dashboard`
- ❌ XP, Stores, Backend

---

*Creado: 2026-01-18*
