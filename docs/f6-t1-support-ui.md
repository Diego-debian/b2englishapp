# F6-T1: Support Page + Entry Points

> **Status:** ✅ Implementado
> **Flag:** `NEXT_PUBLIC_FEATURE_SUPPORT` (OFF por defecto)
> **Rutas:** `/support`

---

## Descripción

Página pública de soporte/donaciones para B2 English. Incluye:
- UI profesional con opciones de donación
- Links condicionales en Header y Footer
- Feature flag guard para activar/desactivar

---

## Cómo Activar

1. Agregar a `frontend/.env.local`:
```env
NEXT_PUBLIC_FEATURE_SUPPORT=1
```

2. Reiniciar dev server:
```bash
cd frontend
npm run dev
```

---

## Archivos Tocados

| Archivo | Cambio |
|---------|--------|
| `frontend/app/support/page.tsx` | **NUEVO** - Página de soporte |
| `frontend/components/GamifiedHeader.tsx` | Link "💜 Support" condicional en nav |
| `frontend/components/Footer.tsx` | Link "💜 Support Us" condicional |
| `frontend/lib/featureFlags.ts` | Ya tenía `FEATURE_SUPPORT` definido |

---

## Comportamiento

### Con `FEATURE_SUPPORT=1` (ON)
- ✅ Header muestra "💜 Support" en nav
- ✅ Footer muestra "💜 Support Us"
- ✅ `/support` renderiza página de donaciones

### Con `FEATURE_SUPPORT` ausente o diferente de `1` (OFF)
- ❌ Header NO muestra link de Support
- ❌ Footer NO muestra link de Support
- ❌ `/support` redirige a `/`

---

## Verificación Manual

### Test A: Flag OFF
1. En `.env.local`, eliminar o comentar `NEXT_PUBLIC_FEATURE_SUPPORT`
2. Reiniciar dev server
3. Verificar:
   - Header NO tiene "Support"
   - Footer NO tiene "Support Us"
   - Navegar a `/support` → redirige a `/`

### Test B: Flag ON
1. En `.env.local`, agregar `NEXT_PUBLIC_FEATURE_SUPPORT=1`
2. Reiniciar dev server
3. Verificar:
   - Header tiene "💜 Support" (color rosa)
   - Footer tiene "💜 Support Us"
   - Navegar a `/support` → muestra página de donaciones

---

## Límites / No Implementado

| Feature | Status | Razón |
|---------|--------|-------|
| Pagos reales | ❌ | Fuera de scope |
| PayPal integration | ❌ | Placeholder UI |
| Subscripciones | ❌ | Coming soon |
| Backend | ❌ | Frontend-only |

---

## Riesgos

- **Bajo:** Links condicionales agregados a Header/Footer global, pero cambio mínimo y aislado
- **Ninguno:** No se tocó `/practice/*`, `/dashboard`, XP, ni stores existentes

---

*Creado: 2026-01-18*
