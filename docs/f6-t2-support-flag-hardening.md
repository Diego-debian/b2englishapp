# F6-T2: Support Flag Hardening

> **Status:** ✅ Implementado
> **Flag:** `NEXT_PUBLIC_FEATURE_SUPPORT`
> **Default:** OFF (seguro)

---

## Valores Aceptados

| Valor | Resultado |
|-------|-----------|
| `1` | ✅ ON |
| `true` | ✅ ON |
| `on` | ✅ ON |
| `yes` | ✅ ON |
| `TRUE` | ✅ ON (case-insensitive) |
| `0` | ❌ OFF |
| `false` | ❌ OFF |
| `""` | ❌ OFF |
| (ausente) | ❌ OFF |
| cualquier otro | ❌ OFF |

---

## Implementación

### Helper Central: `frontend/lib/featureFlags.ts`

```typescript
// Strict boolean parse
export const isFeatureOn = (value?: string): boolean => {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return ["1", "true", "on", "yes"].includes(normalized);
};

// Convenience helper
export const isSupportEnabled = (): boolean => {
  return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_SUPPORT);
};
```

---

## Archivos Tocados (4)

| Archivo | Cambio |
|---------|--------|
| `frontend/lib/featureFlags.ts` | Agregó `isFeatureOn()`, `isSupportEnabled()` |
| `frontend/app/support/page.tsx` | Usa `isSupportEnabled()` |
| `frontend/components/GamifiedHeader.tsx` | Usa `isSupportEnabled()` |
| `frontend/components/Footer.tsx` | Usa `isSupportEnabled()` |

---

## Pruebas Manuales

### Test A: Flag OFF (default)
1. En `.env.local`, eliminar o comentar `NEXT_PUBLIC_FEATURE_SUPPORT`
2. Reiniciar dev server
3. Verificar:
   - Header NO tiene "💜 Support"
   - Footer NO tiene "💜 Support Us"
   - `/support` → redirige a `/`

### Test B: Flag ON
1. En `.env.local`, agregar cualquiera:
   ```env
   NEXT_PUBLIC_FEATURE_SUPPORT=1
   # o
   NEXT_PUBLIC_FEATURE_SUPPORT=true
   # o
   NEXT_PUBLIC_FEATURE_SUPPORT=yes
   ```
2. Reiniciar dev server
3. Verificar:
   - Header tiene "💜 Support"
   - Footer tiene "💜 Support Us"
   - `/support` → muestra página de donaciones

---

## Qué NO se Tocó

- ❌ `/practice/*`
- ❌ `/dashboard`
- ❌ XP/gamificación
- ❌ Stores Zustand existentes
- ❌ Backend/endpoints

---

*Creado: 2026-01-18*
