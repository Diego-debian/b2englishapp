# Content Infrastructure — B2English

> **Propósito:** Documentar la infraestructura pasiva del sistema de contenido `/content`.
> **Status:** Especificación de diseño (desactivada por defecto, NO implementado).
> **Prerrequisitos:** 
> - [content-spec.md](content-spec.md) — Modelo de datos
> - [feature-flags.md](feature-flags.md) — Sistema de flags
> - [expansion-zones.md](expansion-zones.md) — Zonas permitidas

---

## 1. Rutas de Contenido

### 1.1 Rutas Frontend Propuestas

| Ruta | Propósito | Auth | Estado |
|------|-----------|:----:|--------|
| `/content` | Feed principal de contenido | ❌ Público | Propuesto |
| `/content/[slug]` | Detalle de item individual | ❌ Público | Propuesto |
| `/content/type/[type]` | Feed filtrado por tipo | ❌ Público | Propuesto (opcional) |

### 1.2 Estructura de Archivos (Intención)

```
frontend/app/content/
├── page.tsx              # Feed principal
├── [slug]/
│   └── page.tsx          # Detalle de item
└── type/
    └── [type]/
        └── page.tsx      # Feed filtrado (opcional)
```

> **Nota:** Estas rutas viven en zona de expansión según `expansion-zones.md` sección 2.

### 1.3 Comportamiento de Rutas

| Ruta | Con Flag ON | Con Flag OFF |
|------|-------------|--------------|
| `/content` | Muestra feed de items `published` | 404 o redirect a `/` |
| `/content/[slug]` | Muestra detalle si `published` o `archived` | 404 o redirect a `/` |
| `/content/type/video` | Filtra solo tipo `video` | 404 o redirect a `/` |

---

## 2. Fuente de Datos Inicial (Mock JSON)

### 2.1 Estrategia de Datos

Para la fase inicial, el contenido se sirve desde un archivo JSON estático, sin backend ni base de datos.

| Aspecto | Decisión |
|---------|----------|
| Fuente | Archivo JSON local |
| Ubicación sugerida | `frontend/data/content.json` o `public/data/content.json` |
| Persistencia | Solo lectura, sin escritura |
| Actualización | Manual (editar JSON y redeploy) |

### 2.2 Estructura del Mock JSON

```json
{
  "items": [
    {
      "type": "video",
      "slug": "present-simple-explained",
      "title": "Present Simple Explained",
      "video_id": "dQw4w9WgXcQ",
      "description": "Quick overview of present simple.",
      "status": "published",
      "published_at": "2026-01-18T10:00:00Z"
    },
    {
      "type": "text",
      "slug": "10-tips-grammar",
      "title": "10 Tips for Better Grammar",
      "body": "# Introduction\n\nHere are 10 tips...",
      "excerpt": "Improve your grammar with these tips.",
      "status": "published",
      "published_at": "2026-01-17T14:00:00Z"
    }
  ],
  "meta": {
    "version": "0.1.0",
    "generated_at": "2026-01-18T00:00:00Z"
  }
}
```

### 2.3 Reglas de Lectura

- El frontend MUST cargar el JSON al build time (SSG) o client-side.
- Solo items con `status: "published"` MUST aparecer en el feed.
- Items con `status: "archived"` MAY mostrarse en detalle pero NO en feed.
- Items con `status: "draft"` MUST NOT renderizarse nunca.

### 2.4 Futuras Fuentes (NO implementar ahora)

| Fuente | Cuando migrar |
|--------|---------------|
| Backend API (`GET /content/*`) | Cuando exista CRUD de contenido |
| CMS externo | Cuando haya necesidad editorial profesional |
| Base de datos | Cuando se implemente admin panel |

> No determinable con evidencia del código actual: El método exacto de carga (import estático, fetch, getStaticProps).

---

## 3. Reglas de Feature Flag

### 3.1 Flag Principal

Según `docs/feature-flags.md`:

| Variable | Valor ON | Valor OFF |
|----------|----------|-----------|
| `NEXT_PUBLIC_FEATURE_CONTENT_FEED` | `"1"` | `""` o no definida |

### 3.2 Comportamiento con Flag OFF (Default)

```
Estado por defecto: OFF

Cuando OFF:
├── /content         → 404 o redirect a /
├── /content/[slug]  → 404 o redirect a /
└── Navegación       → Links a /content/* ocultos o deshabilitados
```

### 3.3 Implementación de Guard (Intención)

```
// Pseudocódigo — NO implementar
if (!isFeatureEnabled("FEATURE_CONTENT_FEED")) {
  redirect("/");
  // o return notFound();
}
```

**Opciones de implementación:**
1. Guard en cada page.tsx de `/content/*`
2. Middleware de Next.js para prefijo `/content`
3. Layout wrapper con verificación

> No determinable con evidencia del código actual: Cuál opción se usará. Depende de la implementación futura.

### 3.4 Configuración por Entorno

| Entorno | Valor Sugerido | Razón |
|---------|----------------|-------|
| Desarrollo (`.env.local`) | `"1"` | Probar mientras se desarrolla |
| Staging | `"1"` | QA antes de producción |
| Producción | `""` (OFF) | Desactivado hasta estar listo |

---

## 4. Aislamiento del Core

### 4.1 Principio de Aislamiento

El sistema de contenido `/content` MUST estar completamente aislado del core protegido.

```
Core Protegido (NO TOCAR)     Zona de Expansión (Content)
━━━━━━━━━━━━━━━━━━━━━━━━━     ━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── /practice/*               ├── /content/*
├── /focus/*                  ├── components/content/*
├── lib/storage.ts            ├── lib/content/*
├── lib/focusStorage.ts       └── data/content.json
├── store/authStore.ts
└── GamifiedHeader.tsx
```

### 4.2 Importaciones Permitidas

| ✅ PERMITIDO | ❌ PROHIBIDO |
|-------------|-------------|
| `Button`, `Card` (UI genéricos) | `authStore` |
| `Link` de Next.js | `storage.ts` |
| Componentes en `components/content/*` | `focusStorage.ts` |
| Helpers en `lib/content/*` | `api.ts` (endpoints de practice/focus) |
| JSON mock local | `focusQuestions.ts` |

### 4.3 Verificación de Aislamiento

Preguntas de validación antes de implementar:

1. ¿El sistema de content funciona si no existe `/practice`? → MUST ser **Sí**
2. ¿El sistema de content importa algo de Focus? → MUST ser **No**
3. ¿Eliminar `/content` rompe el core? → MUST ser **No**
4. ¿El sistema de content requiere usuario autenticado? → SHOULD ser **No**

### 4.4 Sin Dependencias Bidireccionales

```
Core → Content: ❌ Core NO debe saber que Content existe
Content → Core: ❌ Content NO debe depender de Core
Content → UI genéricos: ✅ Permitido (Button, Card, etc.)
```

---

## 5. Qué NO se Implementa Aún

### 5.1 Backend / API

| Feature | Status | Razón |
|---------|--------|-------|
| `GET /content` endpoint | ❌ NO | Mock JSON suficiente para beta |
| `POST /content` endpoint | ❌ NO | No hay CRUD |
| Base de datos `content_*` | ❌ NO | Sin persistencia backend |
| Validación server-side | ❌ NO | JSON estático |

### 5.2 Admin Panel

| Feature | Status | Razón |
|---------|--------|-------|
| `/admin/content/*` | ❌ NO | Edición manual de JSON |
| Editor WYSIWYG | ❌ NO | Complejidad prematura |
| Preview de draft | ❌ NO | MVP solo published |
| Gestión de assets | ❌ NO | Solo YouTube embeds |

### 5.3 Funcionalidades Avanzadas

| Feature | Status | Razón |
|---------|--------|-------|
| Búsqueda de contenido | ❌ NO | Requiere indexación |
| Filtros por nivel/tense | ❌ NO | Scope reducido |
| Paginación | ❌ NO | Pocos items inicialmente |
| RSS/Atom feed | ❌ NO | Sin demanda |
| Comentarios | ❌ NO | Moderación compleja |
| Likes/bookmarks | ❌ NO | Requiere auth + persistencia |
| Analytics por item | ❌ NO | Tracking global suficiente |
| SEO dinámico | ❌ NO | Meta tags estáticos |

### 5.4 Integraciones

| Feature | Status | Razón |
|---------|--------|-------|
| CMS externo (Strapi, Contentful) | ❌ NO | Overhead innecesario |
| Sincronización con YouTube API | ❌ NO | Manual es suficiente |
| Notificaciones de nuevo contenido | ❌ NO | Sin sistema de notificaciones |

---

## 6. Diagrama de Arquitectura (Intención)

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  Feature Flag   │───▶│  Guard: FEATURE_CONTENT_FEED    │ │
│  │  (env var)      │    └─────────────────────────────────┘ │
│  └─────────────────┘                    │                    │
│                                         ▼                    │
│                              ┌─────────────────┐             │
│                              │  /content/*     │             │
│                              │  (rutas)        │             │
│                              └────────┬────────┘             │
│                                       │                      │
│                                       ▼                      │
│                         ┌─────────────────────────┐          │
│                         │  content.json (mock)    │          │
│                         │  Fuente de datos        │          │
│                         └─────────────────────────┘          │
│                                                              │
│  ════════════════════════════════════════════════════════   │
│  AISLADO DE:  /practice/*  |  /focus/*  |  authStore        │
│  ════════════════════════════════════════════════════════   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│           (Sin endpoints de content en beta)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Checklist de Implementación Futura

Cuando se implemente el sistema de contenido:

### Fase 1: Infraestructura Mínima
- [ ] Crear `frontend/data/content.json` con 3-5 items de ejemplo
- [ ] Crear `frontend/app/content/page.tsx` (feed)
- [ ] Crear `frontend/app/content/[slug]/page.tsx` (detalle)
- [ ] Implementar guard de feature flag
- [ ] Crear componentes en `components/content/*`

### Fase 2: Componentes
- [ ] `ContentFeed.tsx` — Lista de items
- [ ] `ContentCard.tsx` — Card para feed
- [ ] `VideoBlock.tsx` — Embed de YouTube
- [ ] `TextBlock.tsx` — Render de markdown
- [ ] `StoryCard.tsx` — Card compacta
- [ ] `CtaBlock.tsx` — Botón de acción

### Fase 3: Verificación
- [ ] Build pasa sin errores
- [ ] Flag OFF → 404 en /content
- [ ] Flag ON → Feed visible
- [ ] Links no aparecen en navegación con flag OFF
- [ ] Aislamiento verificado (sin imports de core)

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [content-spec.md](content-spec.md) | Modelo de datos (tipos, campos, estados) |
| [feature-flags.md](feature-flags.md) | Sistema de feature flags |
| [expansion-zones.md](expansion-zones.md) | Zonas permitidas para expansión |
| [core-protected-zones.md](core-protected-zones.md) | Zonas que NO tocar |

---

*Creado: 2026-01-18*
