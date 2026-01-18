# UI/UX: Página /support — B2English

> **Estado:** Especificación de diseño (NO implementado)
> **Patrón base:** DDShortener Support.tsx

---

## 1. Estructura Visual de la Página

### Layout General

```
┌─────────────────────────────────────────────────────────────┐
│                    HEADER (existente)                       │
│                  (no se modifica)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              TÍTULO + SUBTÍTULO                      │   │
│  │         "💜 Apoya B2English"                         │   │
│  │    "Tu apoyo mantiene el proyecto online..."         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           MÉTODOS DE DONACIÓN                        │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ 💳 PayPal          [Recomendado]  [$5 USD] │────►ext│
│  │  └─────────────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │ ☕ Ko-fi                           [$3 USD] │────►ext│
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       INSTRUCCIONES DE ACTIVACIÓN                    │   │
│  │  1. Envía correo a [email]                           │   │
│  │  2. Incluye email de tu cuenta                       │   │
│  │  3. Adjunta comprobante                              │   │
│  │  4. Activación en 24-48h                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              DISCLAIMER                              │   │
│  │  ℹ️ "No procesamos pagos directamente..."            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│             [← Volver al Dashboard]                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    FOOTER (existente)                       │
│                  (no se modifica)                           │
└─────────────────────────────────────────────────────────────┘
```

### Secciones

| Sección | Propósito | Fuente |
|---------|-----------|--------|
| Header | Título + subtítulo | `donations.json.title`, `.subtitle` |
| Métodos | Lista de opciones de donación | `donations.json.methods[]` |
| Instrucciones | Cómo activar Premium | `donations.json.activation_instructions` |
| Disclaimer | Texto legal | `donations.json.disclaimer` |
| Back link | Navegación | Hardcoded `/dashboard` |

---

## 2. Contrato UI ↔ donations.json

### Mapeo de campos a UI

| Campo JSON | Elemento UI | Tipo |
|------------|-------------|------|
| `title` | H1 principal | Text |
| `subtitle` | Párrafo bajo título | Text |
| `methods[].name` | Título de card | Text |
| `methods[].description` | Subtítulo de card | Text |
| `methods[].url` | href del link | URL externa |
| `methods[].suggested_amount` | Badge de monto | Text |
| `methods[].primary` | Estilo destacado | Boolean |
| `methods[].icon` | Emoji/icono | String |
| `disclaimer` | Texto de nota | Text |
| `activation_instructions.title` | Título de sección | Text |
| `activation_instructions.subtitle` | Subtítulo opcional | Text |
| `activation_instructions.steps[]` | Lista ordenada | Array<string> |

### Render condicional

| Condición | Comportamiento |
|-----------|----------------|
| `methods[].primary === true` | Card con estilo destacado (bg-violet, text-white) |
| `methods[].icon` presente | Mostrar emoji antes del nombre |
| `methods[].suggested_amount` presente | Mostrar badge de monto |
| `activation_instructions.subtitle` presente | Mostrar subtítulo |

---

## 3. Estados UX Esperados

### Estado: Loading

```
┌─────────────────────────────────────┐
│                                     │
│           Cargando...               │
│         (spinner o texto)           │
│                                     │
└─────────────────────────────────────┘
```

- Mostrar mientras `fetch('/app-config/donations.json')` en progreso
- Duración típica: <500ms

### Estado: Success

```
[Render completo de la página con datos de JSON]
```

- Todos los campos poblados desde JSON
- Links externos funcionan

### Estado: Error

```
┌─────────────────────────────────────┐
│  ⚠️ Error al cargar configuración   │
│                                     │
│  [← Volver al Dashboard]            │
└─────────────────────────────────────┘
```

- Mostrar si `fetch` falla
- Ofrecer navegación de salida
- Log warning a console (no error)

### Estado: Feature OFF

```
[Redirect automático a /]
```

- Si `NEXT_PUBLIC_FEATURE_SUPPORT !== "1"`
- Usuario nunca ve la página

---

## 4. Aislamiento del Core

### Lo que la página NO hace

| Acción | Razón |
|--------|-------|
| Importar `authStore` | No requiere auth |
| Importar `focusStorage` | No relacionado con Focus |
| Importar `api.ts` | Zero backend |
| Modificar estado global | Página stateless |
| Persistir datos | Solo lectura de JSON |

### Componentes permitidos

| Componente | Uso |
|------------|-----|
| `Link` (Next.js) | Navegación interna |
| `Button` (genérico) | Si existe en proyecto |
| `Card` (genérico) | Para métodos de donación |
| `Spinner` (genérico) | Estado loading |

### Componentes NO permitidos

| Componente | Razón |
|------------|-------|
| `GamifiedHeader` | Ya existe en layout |
| `AuthLayout` | No aplica |
| `Protected` | No requiere auth |

---

## 5. Qué NO Se Implementa Aún

### No implementado (solo especificación)

| Item | Estado |
|------|--------|
| Archivo `app/support/page.tsx` | ❌ No creado |
| Archivo `app-config/donations.json` | ❌ No creado |
| Componentes `components/support/*` | ❌ No creados |
| Link en navegación | ❌ No agregado |
| Feature flag activado | ❌ OFF |

### No implementado (fuera de scope)

| Item | Razón |
|------|-------|
| Procesamiento de pagos | Siempre externo |
| Verificación de donaciones | Siempre manual |
| Activación automática Premium | Fuera de scope |
| Historial de donaciones | No hay modelo en DB |
| Webhook PayPal | Complejidad innecesaria |

---

## 6. Especificaciones Visuales

### Estilo esperado (descriptivo)

| Elemento | Estilo |
|----------|--------|
| Container | `max-w-2xl mx-auto` centrado |
| Cards primarias | Fondo violeta/azul, texto blanco |
| Cards secundarias | Fondo gris claro, borde |
| Badge recomendado | Pequeño, fondo semi-transparente |
| Badge monto | Verde para suggested_amount |
| Disclaimer | Fondo gris, texto pequeño |
| Instrucciones | Fondo gradiente suave |

### Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| Mobile | Cards full-width, stack vertical |
| Desktop | Cards con padding, layout preservado |

> **No determinable con evidencia del código actual:**
> El sistema de diseño exacto de B2English (colores, spacing) dependerá de `globals.css` y patrones existentes cuando se implemente.

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [b2english-support-infra.md](b2english-support-infra.md) | Infraestructura técnica |
| [ddshortener-donations-audit.md](ddshortener-donations-audit.md) | Patrón original DDShortener |
| [feature-flags.md](feature-flags.md) | Control de activación |

---

*Creado: 2026-01-18*
