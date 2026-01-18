# Core Protected Zones — B2English

> **Propósito:** Definir qué partes del sistema son "read-only" para agentes externos.
> **Status:** Documento de referencia obligatorio antes de modificar código.

---

## 1. Definición de "Core"

**Core** son los componentes del sistema cuya modificación:
- Rompería flujos de usuario validados
- Afectaría persistencia de datos
- Requeriría aprobación explícita de Diego

**Regla general:** Si un componente está marcado como Core, el agente NO puede modificarlo sin aprobación previa documentada.

---

## 2. Zonas Protegidas — Backend

### 🔴 FROZEN (No tocar bajo ninguna circunstancia)

| Endpoint/Área | Razón | Referencia |
|---------------|-------|------------|
| `POST /focus/results` | Endpoint validado en producción. Cualquier cambio rompe Focus Mode. | `t0.2-workflow-freeze-rules.md` línea 47 |
| `POST /token` | Autenticación crítica. Cambio = usuarios sin acceso. | `t0.1-contract-api.md` |
| `POST /register` | Registro de usuarios. Cambio = nuevos usuarios no pueden crear cuentas. | `t0.1-contract-api.md` |
| `GET /me` | Verificación de sesión. Cambio = header y rutas protegidas rotas. | `t0.1-contract-api.md` |

### 🟠 REQUIERE APROBACIÓN

| Área | Razón | Qué aprobar |
|------|-------|-------------|
| XP / Gamificación | Afecta métricas visibles de usuario | Diego debe aprobar cualquier cambio en cálculo o display de XP |
| Migraciones DB | Cambio irreversible | Crear nuevas tablas/campos requiere aprobación |
| Schemas Pydantic (auth) | Cambio de contrato | Modificar `UserCreate`, `Token`, `UserOut` requiere aprobación |

### 🟢 MODIFICABLE (con cuidado)

| Área | Condiciones |
|------|-------------|
| Health endpoints (`/health`, `/ready`, `/metrics`) | Solo agregar campos, no cambiar existentes |
| Endpoints admin (POST/PATCH/DELETE verbs, tenses) | Frontend no los usa, pero backend sí los sirve |
| Nuevos endpoints | Siempre agregar, nunca modificar existentes |

---

## 3. Zonas Protegidas — Frontend

### 🔴 FROZEN

| Ruta/Componente | Razón |
|-----------------|-------|
| `/practice/focus/*` | Core flow validado. Cambio = Focus Mode roto |
| `lib/focusStorage.ts` | Persiste stats locales. Cambio = usuarios pierden progreso Focus |
| `lib/storage.ts` | Persiste auth. Cambio = usuarios deslogueados |
| `store/authStore.ts` | Estado global de auth. Cambio = rutas protegidas rotas |

### 🟠 REQUIERE APROBACIÓN

| Área | Razón |
|------|-------|
| `GamifiedHeader.tsx` | Afecta navegación global y display de XP/Level |
| Login/Register pages | Flujo crítico de onboarding |
| Dashboard stats display | Métricas visibles al usuario |

### 🟢 MODIFICABLE (con cuidado)

| Área | Condiciones |
|------|-------------|
| `/tenses/*` pages | Contenido estático, no afecta flujos críticos |
| `/verbs/*` pages | Contenido estático, no afecta flujos críticos |
| Componentes UI genéricos (`Button`, `Card`, etc.) | Cambios de estilo OK, no de comportamiento |
| Nuevas páginas | Agregar sin modificar las existentes |

---

## 4. Zonas Protegidas — Database

### 🔴 NO TOCAR

| Tabla | Razón |
|-------|-------|
| `users` | Datos de autenticación |
| `activity_attempts` | Focus results ya persistidos |
| `question_attempts` | Focus results ya persistidos |

### 🟠 REQUIERE APROBACIÓN

| Acción | Razón |
|--------|-------|
| Crear nueva tabla | Requiere migración Alembic |
| Agregar campo a tabla existente | Puede romper queries existentes |
| Cambiar tipos de campo | Datos existentes pueden ser incompatibles |

---

## 5. Reglas de Modificación

### Antes de tocar cualquier archivo:

1. **Verificar si está en zona protegida** (este documento)
2. **Si FROZEN** → NO TOCAR, documentar y preguntar
3. **Si REQUIERE APROBACIÓN** → Proponer cambio, esperar OK de Diego
4. **Si MODIFICABLE** → Seguir Minimal Safe Change (≤3 archivos, revertible)

### Señales de que vas a romper algo:

- Cambias firma de función/endpoint existente
- Tocas archivo con "auth", "token", "storage" en el nombre
- Modificas schema Pydantic que ya está en uso
- Tu cambio afecta más de 5 archivos

---

## 6. Advertencias para Agentes Futuros

> [!CAUTION]
> **NO TOQUES `/focus/results`**  
> Este endpoint está FROZEN desde T2.2. Está validado en producción y cualquier cambio rompe Focus Mode.

> [!CAUTION]
> **NO INVENTES ENDPOINTS**  
> Solo usar endpoints documentados en `t0.1-contract-api.md`. Si necesitas uno nuevo, proponer diseño primero.

> [!CAUTION]
> **NO TOQUES XP/GAMIFICACIÓN**  
> Cualquier cambio en cálculo o display de XP requiere aprobación explícita de Diego.

> [!WARNING]
> **MIGRACIONES = BLOQUEO**  
> No crear tablas ni modificar schema de DB sin aprobación. Usa `t0.4-data-model.md` como referencia.

> [!IMPORTANT]
> **FRASE OBLIGATORIA**  
> Si algo no se puede determinar con evidencia del código:  
> "No determinable con evidencia del código actual."

---

## 7. Checklist Pre-Modificación

Antes de modificar cualquier archivo:

- [ ] ¿El archivo está en zona FROZEN? → **NO TOCAR**
- [ ] ¿El archivo requiere aprobación? → **PROPONER PRIMERO**
- [ ] ¿Mi cambio afecta >3 archivos? → **DIVIDIR EN TAREAS**
- [ ] ¿Mi cambio modifica contrato de API? → **DOCUMENTAR EN T0.1**
- [ ] ¿Mi cambio requiere migración? → **BLOQUEAR HASTA APROBAR**

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| `t0.1-contract-api.md` | Endpoints y schemas |
| `t0.2-workflow-freeze-rules.md` | Reglas de colaboración |
| `t0.4-data-model.md` | Schema de base de datos |
| `t2.2-focus-result-endpoint.md` | Detalle de endpoint frozen |

---

## Related Docs

| Documento | Contenido |
|-----------|-----------|
| [expansion-zones.md](expansion-zones.md) | Zonas donde SÍ se puede construir nuevas features |

---

*Creado: 2026-01-18*

