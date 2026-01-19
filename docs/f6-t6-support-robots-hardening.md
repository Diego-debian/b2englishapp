# F6-T6: Robots Hardening para /support

> **Status:** ✅ Implementado

---

## Qué Cambió

Convertido `frontend/app/support/layout.tsx` de `export const metadata` a `generateMetadata()` para condicionar robots dinámicamente.

### Comportamiento

| Flag | robots |
|------|--------|
| `FEATURE_SUPPORT=1` (ON) | `index, follow` |
| `FEATURE_SUPPORT=0` (OFF) | `noindex, nofollow, noarchive, nocache` |

---

## Código Clave

```typescript
export function generateMetadata(): Metadata {
  const isEnabled = isSupportEnabled();

  if (isEnabled) {
    return {
      ...baseMetadata,
      robots: { index: true, follow: true },
    };
  }

  // Feature OFF
  return {
    ...baseMetadata,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nocache: true,
    },
  };
}
```

---

## Archivos Tocados (1 + doc)

| Archivo | Cambio |
|---------|--------|
| `frontend/app/support/layout.tsx` | `metadata` → `generateMetadata()` |
| `docs/f6-t6-support-robots-hardening.md` | **NUEVO** |

---

## Pruebas Manuales

### Flag ON
1. `NEXT_PUBLIC_FEATURE_SUPPORT=1`
2. `npm run dev`
3. `/support` → View Source
4. Verificar: `<meta name="robots" content="index, follow">`

### Flag OFF
1. Eliminar flag o `=0`
2. `npm run build` (para ver metadata en .next/server)
3. `/support` redirige a `/` (page.tsx guard)
4. **Limitación:** No observable en navegador por el redirect.
5. **Evidencia:** El código en layout.tsx garantiza `noindex, nofollow, noarchive`

---

## Limitación Conocida

Cuando `FEATURE_SUPPORT=OFF`, la página redirige a `/` vía `page.tsx`.
El meta robots se genera pero el usuario nunca verá la página.
Sin embargo, si un crawler accede directamente a `/support`:
- El HTML del servidor incluirá `noindex, nofollow`
- Esto es una medida de defensa en profundidad

---

## Qué NO Se Tocó

- ❌ `frontend/app/support/page.tsx`
- ❌ Header/Footer
- ❌ `/practice/*`, `/dashboard`
- ❌ XP, Stores, Backend

---

*Creado: 2026-01-18*
