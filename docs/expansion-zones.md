# Expansion Zones — B2English

> **Propósito:** Definir áreas donde se pueden construir nuevas features sin tocar el core protegido.
> **Prerrequisito:** Leer `docs/core-protected-zones.md` antes de usar este documento.

---

## 1. Concepto de Zona de Expansión

**Zona de Expansión** = área del código donde:
- Se pueden crear nuevos archivos libremente
- No hay dependencias hacia Core protegido
- Los cambios son aislados y revertibles
- Un agente puede trabajar sin aprobación especial

**Principio clave:** Una feature en zona de expansión NO debe importar ni modificar Core.

---

## 2. Zonas de Expansión — Frontend

### Rutas Permitidas (nuevas páginas)

| Prefijo de Ruta | Propósito | Requisitos |
|-----------------|-----------|------------|
| `/support/*` | Ayuda, FAQ, troubleshooting | No requiere auth |
| `/content/*` | Contenido editorial, guías, artículos | No requiere auth |
| `/admin/content/*` | Gestión de contenido (futuro) | Requiere auth |
| `/tools/*` | Utilidades standalone (conjugador, etc.) | No requiere auth |

### Directorios Permitidos (nuevos componentes)

| Directorio | Propósito | Puede importar |
|------------|-----------|----------------|
| `components/content/*` | Componentes de contenido editorial | Solo `Button`, `Card`, UI genéricos |
| `components/support/*` | Componentes de ayuda | Solo UI genéricos |
| `components/tools/*` | Componentes de utilidades | Solo UI genéricos |
| `lib/content/*` | Helpers para contenido | Nada de `lib/storage.ts` o stores |

### Reglas de Aislamiento Frontend

| ✅ PERMITIDO | ❌ PROHIBIDO |
|-------------|-------------|
| Importar componentes UI genéricos (`Button`, `Card`, `Spinner`) | Importar `authStore` |
| Importar utilidades de formato/texto | Importar `storage.ts` o `focusStorage.ts` |
| Crear nuevos componentes en `components/content/*` | Modificar `GamifiedHeader.tsx` |
| Usar `Link` de Next.js para navegación | Importar `api.ts` (excepto endpoints públicos) |
| Crear nuevas páginas en rutas permitidas | Modificar páginas existentes en `/practice/*` |

---

## 3. Zonas de Expansión — Backend (Intención Futura)

> **⚠️ NOTA:** Estas rutas NO existen actualmente. Este documento define la intención arquitectónica para cuando se implementen.

### Endpoints Futuros Sugeridos

| Prefijo | Propósito | Auth |
|---------|-----------|------|
| `GET /content/*` | Contenido editorial (artículos, guías) | ❌ Público |
| `GET /support/*` | FAQ, troubleshooting | ❌ Público |
| `GET /tools/*` | Utilidades (conjugador, etc.) | ❌ Público |
| `/admin/content/*` | CRUD de contenido | ✅ Admin role |

### Reglas de Aislamiento Backend

| ✅ PERMITIDO | ❌ PROHIBIDO |
|-------------|-------------|
| Crear nuevos routers en `app/routers/content.py` | Modificar `main.py` más allá de include_router |
| Crear nuevos schemas en `app/schemas/content.py` | Modificar schemas de auth (`UserCreate`, etc.) |
| Crear nuevas tablas `content_*` | Modificar tablas existentes (`users`, `*_attempts`) |
| Usar `Depends(get_current_user)` para auth | Modificar lógica de `get_current_user` |

---

## 4. Lo que NO es Zona de Expansión

Las siguientes áreas están **fuera de scope** para expansión libre:

| Área | Razón | Referencia |
|------|-------|------------|
| `/practice/*` | Core flow protegido | `core-protected-zones.md` |
| `/focus/*` | FROZEN | `core-protected-zones.md` |
| `lib/storage.ts` | Persistencia de auth | `core-protected-zones.md` |
| `lib/focusStorage.ts` | Persistencia de Focus stats | `core-protected-zones.md` |
| `store/authStore.ts` | Estado global de auth | `core-protected-zones.md` |
| `POST /focus/results` | Endpoint FROZEN | `t2.2-focus-result-endpoint.md` |

---

## 5. Checklist para PRs en Zonas de Expansión

Antes de crear código en una zona de expansión:

### Pre-desarrollo
- [ ] La ruta/componente está en zona permitida (sección 2 o 3)
- [ ] No importa nada de Core protegido
- [ ] No modifica archivos existentes fuera de la zona

### Durante desarrollo
- [ ] Nuevos archivos creados en directorios permitidos
- [ ] Solo se usan componentes UI genéricos
- [ ] No hay llamadas a `storage.ts`, `focusStorage.ts`, o `authStore` (excepto lectura de user si requiere auth)

### Pre-merge
- [ ] `npm run build` pasa
- [ ] No hay errores de TypeScript
- [ ] Archivos tocados listados
- [ ] Cambio es revertible (solo archivos nuevos)

### Preguntas de validación
1. ¿Mi feature funciona si elimino todos los archivos que creé? → Sí = Core intacto ✅
2. ¿Mi feature importa algo de `/practice/focus`? → No = Aislamiento OK ✅
3. ¿Mi feature requiere migración de DB? → No = Expansión válida ✅

---

## 6. Ejemplos de Expansión Válida

### Ejemplo 1: Página de FAQ
```
Ruta: /support/faq
Archivos nuevos:
  - app/support/faq/page.tsx
  - components/support/FaqAccordion.tsx
Importa: Button, Card (genéricos)
No importa: authStore, storage, api
```
✅ **Válido** — completamente aislado

### Ejemplo 2: Guía de Gramática
```
Ruta: /content/guides/conditionals
Archivos nuevos:
  - app/content/guides/conditionals/page.tsx
  - lib/content/grammarData.ts
Importa: Link (Next.js)
No importa: focusStorage, focusQuestions
```
✅ **Válido** — no toca Focus

### Ejemplo 3: Herramienta Conjugador (NO VÁLIDO)
```
Ruta: /tools/conjugator
Archivos nuevos:
  - app/tools/conjugator/page.tsx
Importa: focusQuestions.ts  ← ❌ PROHIBIDO
```
❌ **Inválido** — importa contenido de Core Focus

---

## 7. Cuándo Escalar

Si tu feature requiere algo de la siguiente lista, **no es zona de expansión**:

| Requisito | Acción |
|-----------|--------|
| Modificar navegación del header | Pedir aprobación para GamifiedHeader |
| Persistir datos de usuario | Proponer nuevo endpoint + schema |
| Acceder a Focus questions | Proponer cómo extraer sin acoplar |
| Nueva tabla en DB | Documentar migración y esperar aprobación |

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [core-protected-zones.md](core-protected-zones.md) | Zonas que NO se deben tocar |
| [t0.2-workflow-freeze-rules.md](t0.2-workflow-freeze-rules.md) | Reglas de colaboración |
| [t0.1-contract-api.md](t0.1-contract-api.md) | Endpoints existentes |

---

## Related Docs

| Documento | Contenido |
|-----------|-----------|
| [feature-flags.md](feature-flags.md) | Flags para activar zonas de expansión progresivamente |

---

*Creado: 2026-01-18*

