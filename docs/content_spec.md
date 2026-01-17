# B2English Content Specification (Beta)

> Modelo de contenido tipo WordPress para lecciones estructuradas por bloques.

---

## 1. Concepto de Lesson

### Qué es y para qué sirve

Una **Lesson** es la unidad fundamental de contenido en B2English. Representa una lección completa que el usuario puede consumir, compuesta por uno o más bloques ordenados.

- Una Lesson MUST tener un identificador único.
- Una Lesson MUST tener un título descriptivo.
- Una Lesson MUST contener al menos un bloque.

### Estado

Cada Lesson tiene un estado que determina su visibilidad:

| Estado        | Descripción                                      |
|---------------|--------------------------------------------------|
| `draft`       | En edición. NO visible para usuarios finales.   |
| `published`   | Visible y accesible para usuarios autorizados.  |

- Una Lesson en `draft` MUST NOT aparecer en listados públicos.
- Una Lesson MUST NOT cambiar de `published` a `draft` sin intervención manual del administrador.

### Audiencia

Una Lesson SHOULD especificar su audiencia objetivo:

| Campo     | Descripción                                         | Obligatorio |
|-----------|-----------------------------------------------------|-------------|
| `level`   | Nivel CEFR (B1, B2, C1, etc.)                      | SHOULD      |
| `tense`   | Tiempo verbal principal (present_simple, past_perfect, etc.) | SHOULD      |
| `mode`    | Modo de práctica (classic, focus, millionaire)     | MAY         |

### Qué NO incluye

Una Lesson en esta versión beta:

- MUST NOT contener lógica de evaluación (quizzes, scores).
- MUST NOT incluir dependencias entre lecciones.
- MUST NOT tener contenido interactivo dinámico (ejercicios autocorregidos).
- MUST NOT almacenar progreso del usuario.

---

## 2. Concepto de Block

### Qué es un bloque

Un **Block** es la unidad mínima de contenido dentro de una Lesson. Cada bloque tiene un tipo específico y propiedades asociadas.

- Un Block MUST tener un `type` válido.
- Un Block MUST tener un `order` numérico que define su posición.
- Un Block SHOULD ser autocontenido (no depender de otros bloques).

### Orden

- El campo `order` MUST ser un número entero positivo.
- Los bloques MUST renderizarse en orden ascendente por `order`.
- El `order` MUST NOT repetirse dentro de la misma Lesson.
- Si hay gaps en el orden (1, 3, 5), el sistema MUST renderizar en secuencia lógica sin errores.

### Serialización simple

- Los bloques MUST serializarse como objetos JSON planos.
- Cada bloque MUST contener únicamente campos primitivos (string, number, boolean) o arrays de primitivos.
- Los bloques MUST NOT contener referencias a otros bloques o entidades externas.

### Render determinista

- Dado el mismo bloque, el frontend MUST producir el mismo output visual.
- El render MUST NOT depender de estado externo, hora, ubicación, o preferencias del usuario.
- Si un bloque tiene datos inválidos, el frontend SHOULD mostrar un placeholder de error, no fallar silenciosamente.

---

## 3. Tipos de Bloques Permitidos (MVP)

### 3.1 `youtube`

**Propósito:** Embeber un video de YouTube como contenido principal o complementario.

**Campos mínimos:**

| Campo       | Tipo     | Obligatorio | Descripción                          |
|-------------|----------|-------------|--------------------------------------|
| `type`      | string   | MUST        | Valor fijo: `"youtube"`              |
| `order`     | number   | MUST        | Posición en la secuencia             |
| `video_id`  | string   | MUST        | ID del video de YouTube (11 chars)   |
| `title`     | string   | SHOULD      | Título descriptivo del video         |

**Restricciones:**

- `video_id` MUST ser exactamente 11 caracteres alfanuméricos.
- `video_id` MUST NOT ser una URL completa.
- El frontend MUST usar el embed oficial de YouTube (`youtube-nocookie.com` preferido).
- El bloque MUST NOT incluir parámetros de autoplay.

---

### 3.2 `text`

**Propósito:** Mostrar texto explicativo, instrucciones, o contenido narrativo.

**Campos mínimos:**

| Campo     | Tipo     | Obligatorio | Descripción                              |
|-----------|----------|-------------|------------------------------------------|
| `type`    | string   | MUST        | Valor fijo: `"text"`                     |
| `order`   | number   | MUST        | Posición en la secuencia                 |
| `content` | string   | MUST        | Contenido textual (puede incluir markdown básico) |

**Restricciones:**

- `content` MUST NOT estar vacío.
- `content` SHOULD soportar markdown básico: **bold**, *italic*, `code`, y enlaces.
- `content` MUST NOT incluir HTML crudo.
- `content` MUST NOT exceder 5000 caracteres.
- El frontend MUST sanitizar el contenido antes de renderizar.

---

### 3.3 `cta`

**Propósito:** Llamada a la acción (Call to Action) para navegación o engagement.

**Campos mínimos:**

| Campo       | Tipo     | Obligatorio | Descripción                              |
|-------------|----------|-------------|------------------------------------------|
| `type`      | string   | MUST        | Valor fijo: `"cta"`                      |
| `order`     | number   | MUST        | Posición en la secuencia                 |
| `label`     | string   | MUST        | Texto del botón                          |
| `action`    | string   | MUST        | Tipo de acción: `"link"` o `"next_lesson"` |
| `target`    | string   | SHOULD      | URL o lesson_id según el action          |

**Restricciones:**

- `label` MUST NOT exceder 50 caracteres.
- Si `action` es `"link"`, `target` MUST ser una URL válida (http/https).
- Si `action` es `"next_lesson"`, `target` SHOULD ser un lesson_id válido.
- El frontend MUST abrir links externos en nueva pestaña.
- MUST NOT haber más de 2 bloques `cta` por Lesson.

---

## 4. Principios de Diseño

### Simplicidad

- El modelo de contenido MUST ser comprensible por un desarrollador en menos de 10 minutos.
- Cada bloque MUST tener un propósito único y claro.
- SHOULD evitarse anidación de estructuras más allá de un nivel.

### Compatibilidad FE/BE

- El formato de serialización MUST ser JSON estándar.
- Los nombres de campos MUST usar snake_case.
- Los tipos de bloques MUST ser strings en lowercase con underscores.
- El backend MUST validar la estructura antes de persistir.
- El frontend MUST manejar gracefully bloques de tipo desconocido.

### Sin dependencias externas

- El contenido de una Lesson MUST ser renderizable sin llamadas a APIs externas (excepto YouTube embed).
- Los bloques MUST NOT referenciar assets que requieran autenticación.
- El modelo MUST NOT depender de bibliotecas específicas de rendering.

---

## 5. Ejemplo Completo de una Lesson

> ⚠️ **NOTA:** Este ejemplo es ILUSTRATIVO. NO representa un contrato técnico ni schema de validación.

```yaml
# Ejemplo conceptual - NO usar como especificación de implementación

lesson:
  id: "lesson-present-perfect-intro"
  title: "Introduction to Present Perfect"
  status: "published"
  
  audience:
    level: "B2"
    tense: "present_perfect"
    mode: "focus"
  
  blocks:
    - type: "text"
      order: 1
      content: |
        # Welcome to Present Perfect!
        
        In this lesson, you'll learn when and how to use 
        the **present perfect tense** in everyday English.

    - type: "youtube"
      order: 2
      video_id: "dQw4w9WgXcQ"
      title: "Present Perfect Explained (5 min)"

    - type: "text"
      order: 3
      content: |
        ## Key Points
        
        - Use present perfect for **experiences** (I have visited Paris)
        - Use it for **unfinished time periods** (I have worked here since 2020)
        - Common keywords: *ever, never, already, yet, just*

    - type: "cta"
      order: 4
      label: "Practice Now"
      action: "link"
      target: "/practice/present_perfect"
```

---

## 6. Límites Explícitos de la Beta

### Qué NO se va a soportar

| Característica                     | Estado      | Razón                                      |
|------------------------------------|-------------|--------------------------------------------|
| Bloques de quiz/ejercicio          | NO soportado| Requiere engine de evaluación              |
| Bloques de audio                   | NO soportado| Complejidad de hosting y streaming         |
| Bloques de imagen                  | NO soportado| Requiere gestión de assets                 |
| Versionado de lecciones            | NO soportado| Complejidad de diff/merge                  |
| Herencia entre lecciones           | NO soportado| Aumenta acoplamiento                       |
| Traducciones/i18n de contenido     | NO soportado| Scope de beta es solo inglés               |
| Scheduling (publicación programada)| NO soportado| Requiere jobs/cron                         |
| Colaboración multi-autor           | NO soportado| Requiere sistema de permisos               |

### Qué queda fuera por ahora

- **Progreso del usuario:** No se trackea qué lecciones ha completado.
- **Recomendaciones:** No hay sistema de sugerencias personalizadas.
- **Búsqueda:** No hay búsqueda de contenido por texto.
- **Comentarios/feedback:** No hay sistema de comentarios en lecciones.
- **Analytics de contenido:** No se mide engagement por bloque.

---

## 7. Relación con Futuras Fases

### T0.4 — DATA_MODEL

Este documento (`content_spec.md`) define el **modelo conceptual** del contenido. La siguiente fase (T0.4) traducirá estos conceptos a:

- Schemas de base de datos
- Estructuras de tablas/colecciones
- Relaciones y constraints
- Índices necesarios

### Qué NO define este documento

- Nombres exactos de tablas o columnas
- Tipos de datos específicos de PostgreSQL/MongoDB
- Estrategias de indexación
- Migrations o scripts DDL
- Endpoints de API

### Secuencia esperada

```
T0.3 (content_spec.md)  →  Define QUÉ es el contenido
         ↓
T0.4 (data_model.md)    →  Define CÓMO se almacena
         ↓
T0.5+ (implementation)  →  Define CÓMO se expone y consume
```

---

## Changelog

| Versión | Fecha      | Cambios                          |
|---------|------------|----------------------------------|
| 0.1.0   | 2026-01-16 | Versión inicial beta             |
