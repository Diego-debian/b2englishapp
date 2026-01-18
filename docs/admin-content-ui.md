# Admin Content UI — B2English

> **Propósito:** Especificar la UI de administración de contenido en `/admin/content`.
> **Status:** Especificación de diseño (desactivada por defecto, NO implementado).
> **Flag:** `FEATURE_ADMIN_CONTENT` = OFF por defecto.
> **Prerrequisitos:**
> - [content-spec.md](content-spec.md) — Modelo de datos
> - [content-mock-data.md](content-mock-data.md) — Fuente de datos
> - [feature-flags.md](feature-flags.md) — Sistema de flags
> - [expansion-zones.md](expansion-zones.md) — Zonas permitidas

---

## 1. Rutas Admin

### 1.1 Rutas Propuestas

| Ruta | Propósito | Auth |
|------|-----------|:----:|
| `/admin/content` | Lista de todos los items | ✅ |
| `/admin/content/new` | Crear nuevo item | ✅ |
| `/admin/content/[slug]/edit` | Editar item existente | ✅ |
| `/admin/content/[slug]/preview` | Preview de item | ✅ |

### 1.2 Estructura de Archivos (Intención)

```
frontend/app/admin/
└── content/
    ├── page.tsx              # Lista de items
    ├── new/
    │   └── page.tsx          # Formulario crear
    └── [slug]/
        ├── edit/
        │   └── page.tsx      # Formulario editar
        └── preview/
            └── page.tsx      # Vista previa
```

### 1.3 Autenticación

| Requisito | Descripción |
|-----------|-------------|
| Login requerido | MUST verificar usuario autenticado |
| Rol admin | SHOULD verificar rol (si existe sistema de roles) |
| Redirect si no auth | → `/login?redirect=/admin/content` |

> No determinable con evidencia del código actual: Sistema de roles o permisos existente.

---

## 2. Funciones Principales

### 2.1 List (Listar)

**Ruta:** `/admin/content`

| Feature | Descripción |
|---------|-------------|
| Mostrar todos los items | Incluye draft, published, archived |
| Ordenar por fecha | `published_at` o `created_at` DESC |
| Filtrar por status | Tabs o dropdown: All / Draft / Published / Archived |
| Filtrar por tipo | Dropdown: All / video / text / story / cta |
| Acciones por fila | Edit, Preview, Cambiar status |

**Campos visibles en tabla:**

| Campo | Visible |
|-------|:-------:|
| `title` o `headline` | ✅ |
| `type` | ✅ (badge) |
| `status` | ✅ (badge color) |
| `published_at` | ✅ |
| `slug` | ✅ (monospace) |

---

### 2.2 Create (Crear)

**Ruta:** `/admin/content/new`

| Step | Acción |
|------|--------|
| 1 | Seleccionar tipo (video/text/story/cta) |
| 2 | Completar formulario según tipo |
| 3 | Validar campos obligatorios |
| 4 | Guardar como `draft` por defecto |
| 5 | Redirect a lista con mensaje de éxito |

**Campos por tipo:**

| Tipo | Campos en formulario |
|------|----------------------|
| `video` | slug, title, video_id, description, level, tense |
| `text` | slug, title, body (textarea), excerpt, level, tense, reading_time |
| `story` | slug, headline, body, highlight (checkbox), level |
| `cta` | slug, label, action (dropdown), target, description, style |

---

### 2.3 Edit (Editar)

**Ruta:** `/admin/content/[slug]/edit`

| Feature | Descripción |
|---------|-------------|
| Cargar item por slug | Poblar formulario con datos existentes |
| Mismo formulario que Create | Según tipo del item |
| Slug read-only | NO permitir editar slug después de creación |
| Guardar cambios | Actualizar en JSON mock |
| Cambiar status | Botón separado para publish/archive |

---

### 2.4 Publish (Publicar)

**Flujo de publicación:**

```
draft → published
  │
  ├── Validar campos obligatorios
  ├── Confirmar acción (modal)
  ├── Actualizar status
  └── Mostrar mensaje éxito
```

**Transiciones permitidas:**

| Desde | Hacia | Acción |
|-------|-------|--------|
| `draft` | `published` | Botón "Publish" |
| `published` | `archived` | Botón "Archive" |
| `archived` | `published` | Botón "Republish" |
| `published` | `draft` | ⚠️ Requiere confirmación (rompe URL) |

---

### 2.5 Preview (Vista Previa)

**Ruta:** `/admin/content/[slug]/preview`

| Feature | Descripción |
|---------|-------------|
| Renderizar como público | Mostrar cómo se verá en `/content/[slug]` |
| Funciona con draft | Permite preview antes de publicar |
| Banner de preview | Mostrar "Modo Preview - No público" |
| Botón volver | Regresar a edición |

---

## 3. Flujos UX Paso a Paso

### 3.1 Flujo: Crear Video

```
1. Usuario navega a /admin/content
2. Click en botón "New Content"
3. Selecciona tipo "video"
4. Formulario muestra campos de video:
   - slug (auto-generado desde title, editable)
   - title (input)
   - video_id (input, 11 chars)
   - description (textarea)
   - level (dropdown: B1, B2, C1)
   - tense (dropdown opcional)
5. Click "Save as Draft"
6. Validación client-side
7. Si OK → Guardar en JSON, redirect a lista
8. Si error → Mostrar errores inline
```

---

### 3.2 Flujo: Editar y Publicar

```
1. Usuario navega a /admin/content
2. Encuentra item en lista
3. Click en "Edit" del item
4. Modifica campos necesarios
5. Click "Save Changes"
6. Si quiere publicar:
   a. Click "Preview" → verificar apariencia
   b. Volver a edit
   c. Click "Publish"
   d. Modal de confirmación
   e. Confirmar → status cambia a "published"
7. Redirect a lista con badge "Published"
```

---

### 3.3 Flujo: Archivar Contenido

```
1. Usuario navega a /admin/content
2. Filtra por "Published"
3. Encuentra item a archivar
4. Click "Edit" o acción directa "Archive"
5. Modal: "¿Archivar? El contenido no aparecerá en feed pero seguirá accesible por URL"
6. Confirmar
7. Status cambia a "archived"
8. Item aparece con badge "Archived" en lista
```

---

## 4. Validaciones Mínimas

### 4.1 Validaciones Comunes (Todos los tipos)

| Campo | Validación |
|-------|------------|
| `slug` | Obligatorio, único, regex `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| `status` | Enum: `draft`, `published`, `archived` |
| `type` | Enum: `video`, `text`, `story`, `cta` |

### 4.2 Validaciones por Tipo

| Tipo | Campo | Validación |
|------|-------|------------|
| `video` | `title` | Obligatorio, max 200 chars |
| `video` | `video_id` | Obligatorio, exactamente 11 chars |
| `text` | `title` | Obligatorio, max 200 chars |
| `text` | `body` | Obligatorio, max 50,000 chars |
| `story` | `headline` | Obligatorio, max 140 chars |
| `story` | `body` | Opcional, max 280 chars |
| `cta` | `label` | Obligatorio, max 50 chars |
| `cta` | `action` | Obligatorio, enum válido |
| `cta` | `target` | Obligatorio, URL válida o path interno |

### 4.3 Validación de Slug Único

```
Al crear/editar:
1. Obtener lista de todos los slugs
2. Si slug ya existe (y no es el item actual) → Error
3. Mostrar: "Este slug ya está en uso"
```

### 4.4 Mensajes de Error

| Caso | Mensaje |
|------|---------|
| Campo vacío obligatorio | "Este campo es obligatorio" |
| Slug inválido | "Usa solo letras minúsculas, números y guiones" |
| Slug duplicado | "Este slug ya está en uso" |
| video_id inválido | "El ID de YouTube debe tener 11 caracteres" |
| URL externa sin https | "Las URLs externas deben comenzar con https://" |

---

## 5. Comportamiento Flag OFF/ON

### 5.1 Flag Principal

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_FEATURE_ADMIN_CONTENT` | `"1"` = ON, `""` = OFF |

### 5.2 Comportamiento con Flag OFF (Default)

```
Estado por defecto: OFF

Cuando OFF:
├── /admin/content         → 404 o redirect a /
├── /admin/content/new     → 404 o redirect a /
├── /admin/content/[slug]  → 404 o redirect a /
└── Links en navegación    → Ocultos
```

### 5.3 Comportamiento con Flag ON

```
Cuando ON:
├── /admin/content         → Lista de items (requiere auth)
├── /admin/content/new     → Formulario crear (requiere auth)
├── /admin/content/[slug]  → Edit/Preview (requiere auth)
└── Links en navegación    → Visibles para usuarios auth
```

### 5.4 Configuración por Entorno

| Entorno | Valor | Razón |
|---------|-------|-------|
| Desarrollo | `"1"` | Desarrollo activo |
| Staging | `"1"` | Testing antes de prod |
| Producción | `""` | OFF hasta estar listo |

### 5.5 Doble Guard

```
// Pseudocódigo — NO implementar
if (!isFeatureEnabled("FEATURE_ADMIN_CONTENT")) {
  redirect("/");
}

if (!isAuthenticated()) {
  redirect("/login?redirect=/admin/content");
}
```

---

## 6. Qué NO Incluye

### 6.1 Sistema de Roles

| Feature | Status | Razón |
|---------|--------|-------|
| Roles (admin/editor/viewer) | ❌ NO | Complejidad prematura |
| Permisos granulares | ❌ NO | Solo un tipo de admin |
| Auditoría de accesos | ❌ NO | Sin requisitos compliance |

> No determinable con evidencia del código actual: Si existe sistema de roles en el proyecto.

### 6.2 Analytics de Contenido

| Feature | Status | Razón |
|---------|--------|-------|
| Views por item | ❌ NO | Requiere tracking backend |
| Engagement metrics | ❌ NO | Sin infraestructura |
| A/B testing | ❌ NO | Complejidad excesiva |
| Heatmaps | ❌ NO | Sin integración externa |

### 6.3 Colaboración

| Feature | Status | Razón |
|---------|--------|-------|
| Múltiples editores | ❌ NO | Conflictos de edición |
| Comentarios internos | ❌ NO | Sin sistema de comentarios |
| Historial de cambios | ❌ NO | Sin versionado |
| Revisión/aprobación | ❌ NO | Workflow simple |
| Notificaciones | ❌ NO | Sin sistema de notificaciones |

### 6.4 Funcionalidades Avanzadas

| Feature | Status | Razón |
|---------|--------|-------|
| Scheduling (publicación programada) | ❌ NO | Requiere jobs/cron |
| Duplicar item | ❌ NO | Copy-paste manual |
| Bulk actions | ❌ NO | Pocos items en beta |
| Import/Export | ❌ NO | Edición directa de JSON |
| Media library | ❌ NO | Solo YouTube IDs |
| WYSIWYG editor | ❌ NO | Markdown plain text |
| SEO preview | ❌ NO | Meta tags estáticos |
| Undo/Redo | ❌ NO | Complejidad UI |

### 6.5 Backend

| Feature | Status | Razón |
|---------|--------|-------|
| API endpoints | ❌ NO | Mock JSON local |
| Base de datos | ❌ NO | Sin persistencia backend |
| Validación server-side | ❌ NO | Solo client-side |
| CDN/assets | ❌ NO | YouTube embeds only |

---

## 7. Persistencia (Beta)

### Estrategia Temporal

En beta, los cambios se guardan editando `content.json`:

```
Opción A: Manual
- Admin hace cambios
- Copia JSON desde UI
- Pega en content.json
- Commit + redeploy

Opción B: Download/Upload
- Admin edita en UI
- Click "Download JSON"
- Reemplaza content.json
- Commit + redeploy
```

> No determinable con evidencia del código actual: Qué estrategia se implementará.

### Futuro (Post-Beta)

```
Mock JSON (beta)
      ↓
API + DB (futuro)
```

---

## 8. Componentes UI Sugeridos

| Componente | Uso |
|------------|-----|
| `ContentList` | Tabla con items, filtros, acciones |
| `ContentForm` | Formulario dinámico según tipo |
| `ContentPreview` | Render de preview |
| `StatusBadge` | Badge de draft/published/archived |
| `TypeBadge` | Badge de video/text/story/cta |
| `SlugInput` | Input con validación y auto-generate |
| `ConfirmModal` | Modal para publish/archive |

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [content-spec.md](content-spec.md) | Tipos y campos de contenido |
| [content-mock-data.md](content-mock-data.md) | Estructura del JSON mock |
| [feature-flags.md](feature-flags.md) | Sistema de feature flags |
| [expansion-zones.md](expansion-zones.md) | Zonas permitidas |

---

*Creado: 2026-01-18*
