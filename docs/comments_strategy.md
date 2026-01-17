# B2English Comments Strategy (Beta)

> Estrategia de comentarios y feedback para la beta pública controlada.

---

## 1. Alcance Beta

### Dónde aplican comentarios

- Comentarios MUST estar disponibles SOLO en páginas de contenido (Lessons).
- Comentarios MUST NOT aparecer en modos de práctica (Classic, Focus, Millionaire).
- Comentarios MUST NOT aparecer en páginas de autenticación, dashboard, o settings.

### Objetivo

- Capturar feedback de usuarios beta sobre el contenido.
- Crear comunidad ligera alrededor de las lecciones.
- MUST NOT convertirse en red social o foro general.
- MUST NOT requerir infraestructura propia de moderación.

---

## 2. Opciones Evaluadas

### 2.1 giscus (GitHub Discussions)

**Descripción:** Widget que embebe GitHub Discussions en la página.

| Aspecto | Evaluación |
|---------|------------|
| **Pros** | Comentarios encadenados, reacciones, markdown, búsqueda, persistencia gratuita |
| **Contras** | Requiere GitHub login (barrera para algunos usuarios) |
| **Moderación** | Via GitHub Discussions UI, roles de repo (maintainer puede borrar/ocultar) |
| **Privacidad** | GitHub privacy policy aplica; sin tracking propio |
| **Tracking** | Mínimo (solo GitHub analytics si están activos) |
| **Requisitos** | Repo público, Discussions habilitado, app giscus instalada |

### 2.2 utterances (GitHub Issues)

**Descripción:** Widget que crea Issues en GitHub por cada página.

| Aspecto | Evaluación |
|---------|------------|
| **Pros** | Simple, un issue = una página, markdown |
| **Contras** | Sin encadenado real, contamina Issues del repo, no diseñado para conversación |
| **Moderación** | Via GitHub Issues (cerrar, borrar) |
| **Privacidad** | GitHub privacy policy aplica |
| **Tracking** | Ninguno propio |
| **Requisitos** | Repo público, app utterances instalada |

### 2.3 Sin comentarios (Fallback externo)

**Descripción:** Sin embed; solo link a formulario externo (Google Form, Typeform, etc.)

| Aspecto | Evaluación |
|---------|------------|
| **Pros** | Cero dependencias, control total, sin moderación activa |
| **Contras** | No hay conversación, menos engagement, respuestas no visibles para otros |
| **Moderación** | Manual via spreadsheet/dashboard del form |
| **Privacidad** | Depende del proveedor del form |
| **Tracking** | Depende del proveedor |
| **Requisitos** | Link al formulario, diseño del form |

---

## 3. Decisión Recomendada

### Opción elegida: **giscus**

**Justificación:**
- Mejor balance entre funcionalidad y mantenimiento.
- GitHub login es aceptable para audiencia técnica/beta.
- Discussions permite hilos organizados sin contaminar Issues.
- Gratuito y sin infraestructura propia.

### Requisitos operativos

| Requisito | Estado | Responsable |
|-----------|--------|-------------|
| Repositorio público | MUST | Administrador |
| GitHub Discussions habilitado | MUST | Administrador |
| Categoría creada (ej: "Lesson Comments") | MUST | Administrador |
| App giscus instalada en repo | MUST | Administrador |
| Mapping: pathname o custom term | SHOULD usar `lesson.slug` | Frontend |

### Configuración recomendada

```
repo: [org/b2english]
repoId: [obtener via giscus.app]
category: "Lesson Comments"
categoryId: [obtener via giscus.app]
mapping: "specific"  # usar lesson.slug como term
reactionsEnabled: true
emitMetadata: false
inputPosition: "top"
theme: "preferred_color_scheme"
lang: "en"
```

### Riesgos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Usuarios sin GitHub no pueden comentar | Alta | Medio | Fallback a link de feedback |
| Spam/bots | Baja | Medio | GitHub ya filtra; moderación reactiva |
| Servicio giscus no disponible | Muy baja | Bajo | Fallback graceful a link |
| Contenido inapropiado | Baja | Alto | Moderación activa, code of conduct |

---

## 4. Reglas de Moderación y Seguridad

### Qué se permite

- Preguntas sobre el contenido de la lección.
- Sugerencias de mejora.
- Correcciones de errores.
- Discusión respetuosa entre usuarios.
- Compartir recursos adicionales relevantes.

### Qué se borra/oculta

- Spam o promoción no solicitada.
- Contenido ofensivo, discriminatorio o acosador.
- Información personal de terceros.
- Contenido ilegal o links sospechosos.
- Off-topic extremo (no relacionado con el contenido).

### Manejo de spam

1. Ocultar comentario inmediatamente via GitHub UI.
2. Si es recurrente: bloquear usuario del repo.
3. Si es ataque coordinado: deshabilitar comentarios temporalmente (feature flag).

### Mini Code of Conduct

> **Reglas de la comunidad B2English:**
> 
> 1. Sé respetuoso con otros usuarios y el equipo.
> 2. Mantén los comentarios relacionados con el contenido de la lección.
> 3. No compartas información personal de otros.
> 4. No hagas spam ni auto-promoción.
> 5. Reporta contenido inapropiado al equipo.
> 
> Incumplir estas reglas puede resultar en eliminación de comentarios o bloqueo.

### Ante abuso grave

- Bloquear usuario del repositorio GitHub.
- Cerrar thread específico si es necesario.
- Reportar a GitHub si viola ToS.
- Documentar incidente internamente.

---

## 5. Plan de Integración (NO implementación)

### Ubicación del widget

- El widget de comentarios SHOULD renderizarse al final de cada página de Lesson.
- MUST estar debajo del último bloque de contenido.
- MUST tener separación visual clara (divider, heading).

### Identificador por lesson

- Usar `lesson.slug` como identificador único para mapear Discussion → Lesson.
- Ejemplo: lesson con slug `present-perfect-intro` → Discussion term: `present-perfect-intro`.

### Feature flag

- MUST existir un flag global para habilitar/deshabilitar comentarios.
- Flag en configuración: `COMMENTS_ENABLED: true | false`.
- Si `false`: no renderizar widget ni fallback.

### Fallback ante error

- Si el widget giscus falla al cargar (timeout, error de red):
  - SHOULD mostrar mensaje: "Comments unavailable right now."
  - SHOULD mostrar link: "Leave feedback via form" → link externo.
- Fallback MUST NOT bloquear el render de la lesson.

### Consideraciones de UX

- Widget SHOULD respetar tema claro/oscuro del sitio.
- Widget MUST NOT cargar hasta que el usuario haga scroll cerca (lazy load).
- Estado de carga: mostrar skeleton o spinner discreto.

---

## 6. No Determinable en Esta Fase

Los siguientes elementos dependen de decisiones futuras y NO se definen aquí:

| Elemento | Razón |
|----------|-------|
| Diseño visual exacto del área de comentarios | Depende de UI/UX final de Lessons |
| Posición exacta (px, breakpoints) | Depende de layout responsive final |
| Implementación del feature flag | Depende de arquitectura de config (env vars, DB, etc.) |
| URL del formulario de fallback | Depende de herramienta elegida (Google Form, Typeform) |
| Notificaciones de nuevos comentarios | Fuera de scope beta |
| Moderación automática (ML/AI) | Fuera de scope beta |
| Analytics de engagement en comentarios | Fuera de scope beta |

---

## Changelog

| Versión | Fecha      | Cambios                          |
|---------|------------|----------------------------------|
| 0.1.0   | 2026-01-16 | Versión inicial beta             |
