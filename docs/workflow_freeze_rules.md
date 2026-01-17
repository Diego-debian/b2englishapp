# Workflow & Freeze Rules — B2English Beta

> **Versión:** 1.0 | **Fecha:** 2026-01-16  
> **Estado:** ACTIVO para fase Beta

---

## 1. Roles y Responsabilidades

| Rol | Persona | Responsabilidades | Permisos |
|-----|---------|-------------------|----------|
| **Owner** | Diego | Decisiones finales, Git (commits, merges, push), deploy, aprobaciones | WRITE a repo |
| **Agente** | Gemini/Claude | Implementación puntual, edición de archivos, validación local | NINGÚN acceso Git |
| **Arquitecto** | ChatGPT | Diseño, validación de prompts, decisiones de arquitectura | Advisory only |

### Reglas de Interacción

- El **Agente** MUST NOT ejecutar comandos `git`.
- El **Agente** MUST limitar cambios al scope definido en cada tarea.
- El **Owner** MUST revisar todo cambio antes de commit.
- El **Owner** MUST ser la única persona que ejecuta `git commit`, `git merge`, `git push`.

---

## 2. Flujo de Trabajo por Tarea

```
┌─────────────────────────────────────────────────────────────────┐
│  1. SELECCIÓN     2. PREPARACIÓN    3. EJECUCIÓN    4. VALIDACIÓN    5. MERGE  │
│  ───────────────────────────────────────────────────────────────────────────── │
│  Diego            Diego+ChatGPT     Agente         Diego              Diego    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Selección de Tarea

1. Owner selecciona fase y tarea (ej: `T0.1`, `T1.2`).
2. Owner verifica que la tarea NO viola Freeze Rules (ver sección 4).
3. Owner define scope explícito: archivos permitidos, restricciones.

### 2.2 Preparación del Prompt

1. Owner (con ChatGPT si aplica) prepara prompt estructurado.
2. Prompt MUST incluir:
   - Objetivo claro
   - Archivos permitidos (whitelist)
   - Restricciones explícitas
   - Criterios de aceptación (checklist)
3. Prompt MUST incluir frase: `"❌ No tocar: [lista de archivos/áreas]"` si aplica.

### 2.3 Ejecución por Agente

1. Agente recibe prompt y ejecuta.
2. Agente MUST:
   - Respetar scope definido
   - NO ejecutar git
   - NO modificar archivos fuera de whitelist
   - Reportar cualquier bloqueo
3. Agente SHOULD:
   - Citar evidencia (líneas de código, rutas)
   - Confirmar checklist de criterios

### 2.4 Validación

1. Owner revisa cambios con:
   ```bash
   git status
   git diff
   ```
2. Owner verifica:
   - [ ] Solo archivos permitidos fueron tocados
   - [ ] Cambios son mínimos y focalizados
   - [ ] Build pasa (si aplica): `npm run build` o `docker compose up`
3. Si falla → Owner revierte o solicita corrección.

### 2.5 Merge

1. Owner hace commit con mensaje descriptivo:
   ```bash
   git add <archivos-específicos>
   git commit -m "tipo(scope): descripción breve (Tx.y)"
   ```
2. Push a remote:
   ```bash
   git push origin main
   ```

---

## 3. Convenciones Git

### 3.1 Rama Base

- **Rama principal:** `main`
- **Workflow:** Trunk-based (commits directos a main para beta)

### 3.2 Naming de Ramas (si se usan)

```
phaseX/Tx.y-descripcion-corta
```

**Ejemplos:**
- `phase0/T0.1-contract-api-docs`
- `phase1/T1.2-focus-backend-integration`

### 3.3 Formato de Commits

```
tipo(scope): descripción breve (Tx.y)
```

**Tipos permitidos:**
| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Solo documentación |
| `refactor` | Cambio de código sin cambiar comportamiento |
| `chore` | Tareas de mantenimiento |
| `ui` | Cambios de UI/UX |

**Ejemplos:**
```
docs: add real FE-BE API contract (T0.1)
feat(focus): add backend integration (T1.2)
fix(practice): resolve timer race condition (T1.5)
```

### 3.4 Merge Strategy

- Para ramas: `git merge --no-ff branch-name`
- Para beta directa: commits directos a `main`

---

## 4. Freeze Rules (CRÍTICO)

### 4.1 Estado: BETA FREEZE

Durante fase Beta, aplican las siguientes restricciones:

### 🔴 CONGELADO — NO TOCAR SIN APROBACIÓN EXPLÍCITA

| Área | Archivos | Justificación |
|------|----------|---------------|
| **Arquitectura Backend** | `backend/app/main.py` (estructura de routers) | Contrato API estable |
| **Modelos de Datos** | `backend/app/models/*.py` | Schema DB sin migraciones |
| **Schemas API** | `backend/app/schemas/*.py` | Contrato FE↔BE definido |
| **Database** | Cualquier migración o `create_all` | Sin Alembic configurado |
| **Auth Flow** | JWT handling, `get_current_user` | Seguridad crítica |
| **Docker Compose** | `docker-compose.yml` | Infra estable |
| **Env Variables** | `.env.example` keys | Configuración documentada |

### 🟡 PERMITIDO CON CUIDADO

| Área | Condiciones |
|------|-------------|
| Documentación (`docs/*.md`) | Siempre permitido |
| Frontend UI/UX | Cambios visuales que no afecten lógica core |
| Bug fixes críticos | Solo con rollback plan |
| Contenido estático | `focusQuestions.ts`, copy changes |

### 🟢 LIBRE

| Área | Notas |
|------|-------|
| `docs/` | Todo |
| `.agent/workflows/` | Workflows del agente |
| README, LICENSE | Mejoras menores |
| Comentarios en código | Sin cambiar lógica |

### 4.2 Proceso de Excepción

Para descongelar un área:

1. Owner documenta justificación
2. Owner crea backup/branch antes del cambio
3. Owner aprueba explícitamente en prompt: `"🔓 DESCONGELADO para esta tarea: [área]"`
4. Post-cambio: validación completa + smoke test

---

## 5. Checklist Obligatorio por Tarea

### ✅ ANTES de Ejecutar

```markdown
- [ ] Tarea definida con ID (ej: T0.1)
- [ ] Scope claro: archivos permitidos listados
- [ ] Restricciones explícitas en prompt
- [ ] Freeze Rules verificadas (no viola ❌ CONGELADO)
- [ ] Criterios de aceptación definidos
```

### ✅ ANTES de Merge

```markdown
- [ ] `git status` muestra SOLO archivos esperados
- [ ] `git diff` revisado línea por línea
- [ ] Build pasa (si aplica)
- [ ] Cambios son mínimos y focalizados
- [ ] No hay código comentado basura
- [ ] Commit message sigue convención
```

---

## 6. Anti-Desastre

### 6.1 Si el Agente Toca Más de lo Permitido

**Detección:**
```bash
git status
# Si aparecen archivos NO autorizados → PROBLEMA
```

**Acción inmediata:**
```bash
# Descartar cambios no autorizados
git checkout -- <archivo-no-autorizado>

# O descartar TODO y empezar de nuevo
git checkout -- .
```

**Post-mortem:**
1. Identificar qué instrucción causó el desvío
2. Ajustar prompt para próxima tarea
3. Documentar en notas de tarea

### 6.2 Cuándo Abortar Completamente

| Señal | Acción |
|-------|--------|
| Agente modifica modelos/schemas sin autorización | `git checkout -- .` inmediato |
| Build falla después de cambios | Revertir antes de investigar |
| Más de 5 archivos modificados sin justificación | Revisar antes de cualquier commit |
| Agente ejecuta comandos destructivos | Terminar sesión, verificar estado |

### 6.3 Rollback Completo

```bash
# Ver últimos commits
git log --oneline -5

# Revertir último commit (si ya se hizo)
git revert HEAD

# O reset duro al commit anterior (PELIGROSO - pérdida de cambios)
git reset --hard HEAD~1
```

### 6.4 Backup Preventivo

Antes de tareas de alto riesgo:

```bash
# Crear rama de backup
git checkout -b backup/pre-Tx.y
git checkout main
```

---

## Resumen Rápido

| Pregunta | Respuesta |
|----------|-----------|
| ¿Quién hace git? | Solo Diego |
| ¿Qué está congelado? | Modelos, schemas, auth, docker-compose |
| ¿Qué siempre se puede tocar? | `docs/` |
| ¿Cómo revertir? | `git checkout -- .` |
| ¿Commit format? | `tipo(scope): descripción (Tx.y)` |
