# Integración /support — B2English

> **Estado:** Especificación de diseño (NO implementado)
> **Flag:** `NEXT_PUBLIC_FEATURE_SUPPORT` — OFF por defecto

---

## 1. Punto Único de Integración

### Ubicación: Footer

El único punto de integración visible será en el **footer** global:

```
┌─────────────────────────────────────────────────────────────┐
│                        FOOTER                               │
├─────────────────────────────────────────────────────────────┤
│  © 2026 B2English    |    [Support]    |    [About]        │
│                           ↑                                 │
│                    (solo si flag ON)                        │
└─────────────────────────────────────────────────────────────┘
```

### Regla de integración

| Ubicación | Tipo | Condición |
|-----------|------|-----------|
| Footer | Link texto | `FEATURE_SUPPORT === "1"` |

### Por qué footer (no header)

| Razón | Detalle |
|-------|---------|
| Menor impacto visual | No compite con navegación principal |
| Patrón común | Muchos sitios ponen support en footer |
| No modifica GamifiedHeader | Header es zona protegida |
| Fácil de revertir | Un solo punto de cambio |

---

## 2. Reglas de Feature Flag

### Variable de control

```env
NEXT_PUBLIC_FEATURE_SUPPORT=1   # ON
NEXT_PUBLIC_FEATURE_SUPPORT=    # OFF (default)
```

### Lógica de evaluación

```typescript
// Patrón esperado (descriptivo, no implementado)
const isSupportEnabled = process.env.NEXT_PUBLIC_FEATURE_SUPPORT === "1";
```

### Puntos de evaluación

| Punto | Acción si OFF |
|-------|---------------|
| Footer link | No renderizar |
| `/support` página | Redirect a `/` |
| CTAs en otras páginas | No agregar |

---

## 3. Comportamiento con Flag OFF

### Estado actual (default)

| Elemento | Comportamiento |
|----------|----------------|
| Footer | No muestra link "Support" |
| Ruta `/support` | 404 o redirect a home |
| Header | Sin cambios |
| Dashboard | Sin CTAs de donación |
| Home | Sin CTAs de donación |

### Usuario experimenta

- **Ninguna referencia** a /support en la UI
- **Navegación directa** a `/support` → redirect
- **Sin impacto** en bundle size (page no cargada)

### Desarrollador experimenta

- Puede activar con `FEATURE_SUPPORT=1` en `.env.local`
- Página accesible solo en entorno de desarrollo
- Sin exposición a usuarios de producción

---

## 4. Comportamiento con Flag ON

### Cuando se active (futuro)

| Elemento | Comportamiento |
|----------|----------------|
| Footer | Muestra link "Support" |
| Ruta `/support` | Renderiza página completa |
| donations.json | Debe existir y ser accesible |

### Checklist pre-activación

- [ ] `app/support/page.tsx` existe
- [ ] `app-config/donations.json` existe y es válido
- [ ] Footer component tiene lógica condicional
- [ ] Smoke test en `/support` pasa
- [ ] URLs de donación verificadas

---

## 5. Qué NO Se Integra Aún

### No implementado (solo especificación)

| Item | Razón |
|------|-------|
| Link en footer | Solo documentado |
| Link en header | Fuera de scope (zona protegida) |
| Link en Dashboard | No agregar CTAs |
| Link en Home | No agregar CTAs |
| Lógica de feature flag | Solo pattern documentado |

### Integración futura opcional (T6.4+)

| Ubicación | Condición | Prioridad |
|-----------|-----------|-----------|
| Footer | Flag ON | Alta |
| Dashboard sidebar | Flag ON + Diego aprueba | Media |
| Home CTA | Flag ON + Diego aprueba | Baja |

---

## 6. Rollback Plan

### Si hay problemas post-activación

1. Setear `NEXT_PUBLIC_FEATURE_SUPPORT=` (vacío)
2. Rebuild/redeploy
3. Usuarios ya no ven link ni página

### Tiempo de rollback

- **Cambio de env var:** Inmediato
- **Redeploy necesario:** Sí (Next.js build-time var)

---

## 7. Dependencias

### Prerequisitos para activar

| Dependencia | Estado |
|-------------|--------|
| docs/feature-flags.md | ✅ Creado |
| docs/b2english-support-infra.md | ✅ Creado |
| docs/b2english-support-ui.md | ✅ Creado |
| `app/support/page.tsx` | ❌ Pendiente T6.3 |
| `app-config/donations.json` | ❌ Pendiente T6.3 |
| Footer condicionado | ❌ Pendiente T6.4 |

### Orden de implementación

```
T6.3 → Crear página + JSON
     ↓
T6.4 → Integrar en footer (flag ON)
     ↓
Activar en producción
```

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [b2english-support-ui.md](b2english-support-ui.md) | Especificación UI |
| [b2english-support-infra.md](b2english-support-infra.md) | Infraestructura |
| [feature-flags.md](feature-flags.md) | Sistema de flags |
| [core-protected-zones.md](core-protected-zones.md) | Zonas protegidas |

---

*Creado: 2026-01-18*
