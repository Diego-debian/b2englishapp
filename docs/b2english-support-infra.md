# Infraestructura /support — B2English

> **Estado:** Especificación de diseño (NO implementado)
> **Patrón base:** DDShortener donations subsystem

---

## 1. Rol de /support

### Propósito

El subsistema `/support` servirá como:
- Página de donaciones y apoyo al proyecto
- Información sobre activación Premium (si aplica en futuro)
- Contacto con el equipo

### Funcionalidad esperada

| Feature | Descripción |
|---------|-------------|
| Mostrar métodos de donación | Lista dinámica desde JSON |
| Links externos | PayPal, Ko-fi, otros |
| Instrucciones de activación | Workflow manual por email |
| FAQ básico | Preguntas frecuentes |

---

## 2. Aislamiento del Core

### Zona de Expansión

Según `docs/expansion-zones.md`, la ruta `/support/*` es una **zona de expansión válida**:

| Aspecto | Valor |
|---------|-------|
| Prefijo de ruta | `/support/*` |
| Requiere auth | ❌ No |
| Zona Core | ❌ No |
| Puede importar | Solo componentes UI genéricos |

### Reglas de aislamiento

| ✅ PERMITIDO | ❌ PROHIBIDO |
|-------------|-------------|
| Importar `Button`, `Card`, `Spinner` | Importar `authStore` |
| Crear `components/support/*` | Importar `focusStorage.ts` |
| Usar `Link` de Next.js | Modificar `GamifiedHeader.tsx` |
| Fetch desde `/app-config/` | Importar `api.ts` |

### Independencia del Core

```
/support/* NO afecta:
├── Focus Mode (/practice/focus)
├── Auth system (/login, /register)
├── Dashboard stats
├── Verb/Tense pages
└── Backend endpoints existentes
```

> Si se elimina todo `/support/*`, el core funciona igual.

---

## 3. Feature Flag: FEATURE_SUPPORT

### Configuración

Según `docs/feature-flags.md`:

| Variable | Default | Valor ON |
|----------|---------|----------|
| `NEXT_PUBLIC_FEATURE_SUPPORT` | `""` (OFF) | `"1"` |

### Comportamiento actual (OFF)

| Estado | Comportamiento |
|--------|----------------|
| OFF | Ruta `/support/*` retorna 404 o redirect a home |
| ON | Ruta `/support/*` renderiza página de soporte |

### Lógica esperada (futura implementación)

```typescript
// Patrón esperado en página /support
if (process.env.NEXT_PUBLIC_FEATURE_SUPPORT !== "1") {
  redirect("/");
}
```

---

## 4. Fuente de Datos Esperada

### Archivo: `app-config/donations.json`

Replicando patrón DDShortener:

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `title` | string | `"💜 Apoya B2English"` |
| `subtitle` | string | Descripción del propósito |
| `methods[]` | array | Lista de métodos de donación |
| `methods[].name` | string | `"PayPal"` |
| `methods[].url` | string | URL externa |
| `methods[].primary` | boolean | Si es el método recomendado |
| `disclaimer` | string | Nota legal |
| `activation_instructions` | object | Pasos para activar Premium |

### Ubicación esperada

```
b2english/
├── app-config/
│   └── donations.json    ← NEW (cuando se implemente)
└── frontend/
    └── app/
        └── support/
            └── page.tsx  ← NEW (cuando se implemente)
```

### Servido por

- **Nginx** como static file (en producción)
- **Next.js public** o API route (en desarrollo)

> **No determinable con evidencia del código actual:** 
> B2English actualmente no tiene directorio `app-config/`. La estructura exacta de servir static JSON dependerá de la configuración de Nginx/Next.js cuando se implemente.

---

## 5. Qué NO Se Implementa Aún

### No implementado (este documento es solo especificación)

| Item | Razón |
|------|-------|
| `app/support/page.tsx` | Solo documentación, no código |
| `app-config/donations.json` | Solo schema, no archivo real |
| Links en navegación | No se toca GamifiedHeader |
| Componentes UI | No se crean componentes |
| Backend endpoints | Zero backend (patrón DDShortener) |
| Procesamiento de pagos | Siempre externo (PayPal, Ko-fi) |
| Activación automática | Siempre manual por email |

### Feature Flag OFF

Mientras `FEATURE_SUPPORT` esté OFF:
- La ruta no existe para usuarios
- No hay CTAs en la app
- No hay impacto en bundle size

---

## 6. Dependencias Futuras

### T6.3 — Implementar /support UI

| Tarea | Descripción |
|-------|-------------|
| Crear `app/support/page.tsx` | Página que consume JSON |
| Crear `app-config/donations.json` | Config de métodos |
| Agregar guard de feature flag | Redirect si OFF |
| Crear componentes `support/*` | Aislados del core |

**Prerequisitos:**
- ✅ Feature flag definido (docs/feature-flags.md)
- ✅ Zona de expansión definida (docs/expansion-zones.md)
- ✅ Patrón DDShortener auditado (docs/ddshortener-donations-audit.md)

### T6.4 — Agregar links de navegación

| Tarea | Descripción |
|-------|-------------|
| Agregar link en footer | Solo cuando FEATURE_SUPPORT=ON |
| Condicional en GamifiedHeader | Opcional, requiere aprobación |

**Nota:** Modificar GamifiedHeader requiere aprobación según `docs/core-protected-zones.md`.

### Orden de implementación sugerido

```
T6.3 Implementar /support UI
  ↓
Activar FEATURE_SUPPORT=1 en dev
  ↓
Smoke test manual
  ↓
T6.4 Agregar links (opcional)
  ↓
Activar en producción
```

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [ddshortener-donations-audit.md](ddshortener-donations-audit.md) | Patrón original |
| [feature-flags.md](feature-flags.md) | Sistema de flags |
| [expansion-zones.md](expansion-zones.md) | Zonas permitidas |
| [core-protected-zones.md](core-protected-zones.md) | Zonas protegidas |

---

*Creado: 2026-01-18*
