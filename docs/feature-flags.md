# Feature Flags — B2English

> **Propósito:** Activar features de expansión de forma progresiva.
> **Status:** Especificación de diseño (NO implementado aún).

---

## 1. Lista de Feature Flags

| Flag | Propósito | Default | Rutas Afectadas |
|------|-----------|---------|-----------------|
| `FEATURE_SUPPORT` | Habilitar páginas de ayuda/FAQ | `OFF` | `/support/*` |
| `FEATURE_CONTENT_FEED` | Habilitar feed de contenido editorial | `OFF` | `/content/*` |
| `FEATURE_ADMIN_CONTENT` | Habilitar panel de admin de contenido | `OFF` | `/admin/content/*` |

---

## 2. Fuente de Verdad

### Evidencia del Repo

```typescript
// frontend/app/practice/page.tsx:449
const useVarietyV2 = process.env.NEXT_PUBLIC_PRACTICE_VARIETY_V2 === "1";
```

**Patrón encontrado:** Variables de entorno `NEXT_PUBLIC_*` con comparación `=== "1"`.

### Convención Propuesta

| Variable | Valor ON | Valor OFF |
|----------|----------|-----------|
| `NEXT_PUBLIC_FEATURE_SUPPORT` | `"1"` | `""` o no definida |
| `NEXT_PUBLIC_FEATURE_CONTENT_FEED` | `"1"` | `""` o no definida |
| `NEXT_PUBLIC_FEATURE_ADMIN_CONTENT` | `"1"` | `""` o no definida |

---

## 3. Regla de Lectura

```typescript
// Patrón propuesto (NO implementado)
const isFeatureEnabled = (flag: string): boolean => {
  return process.env[`NEXT_PUBLIC_${flag}`] === "1";
};

// Uso
if (isFeatureEnabled("FEATURE_SUPPORT")) {
  // Mostrar rutas de support
}
```

**Regla absoluta:** Si la variable no está definida o está vacía → `false` (OFF).

---

## 4. Comportamiento con Flag OFF

| Flag | Comportamiento cuando OFF |
|------|---------------------------|
| `FEATURE_SUPPORT` | Rutas `/support/*` retornan 404 o redirect a home |
| `FEATURE_CONTENT_FEED` | Rutas `/content/*` retornan 404 o redirect a home |
| `FEATURE_ADMIN_CONTENT` | Rutas `/admin/content/*` retornan 404 o redirect a home |

### Implementación Sugerida (Frontend)

```typescript
// En cada página de la zona de expansión:
if (!isFeatureEnabled("FEATURE_SUPPORT")) {
  redirect("/");
}
```

**O alternativamente:** Middleware de Next.js que controla acceso.

---

## 5. Configuración en Entorno

### Desarrollo (`.env.local`)
```env
# Flags de desarrollo - habilitar para probar
NEXT_PUBLIC_FEATURE_SUPPORT=1
NEXT_PUBLIC_FEATURE_CONTENT_FEED=1
NEXT_PUBLIC_FEATURE_ADMIN_CONTENT=
```

### Producción (`.env.production`)
```env
# Flags de producción - todos OFF por defecto
NEXT_PUBLIC_FEATURE_SUPPORT=
NEXT_PUBLIC_FEATURE_CONTENT_FEED=
NEXT_PUBLIC_FEATURE_ADMIN_CONTENT=
```

---

## 6. Backend (Intención Futura)

> **No determinable con evidencia del código actual.**
> 
> No hay evidencia de feature flags en backend. Si se necesitan, proponer patrón similar con env vars en `docker-compose.yml`.

---

## 7. Checklist de Implementación

Cuando se implemente el sistema de feature flags:

- [ ] Crear helper `lib/featureFlags.ts` con función `isFeatureEnabled`
- [ ] Exportar constantes de flags para evitar typos
- [ ] Agregar variables a `.env.example`
- [ ] Agregar middleware o guards en rutas de expansión
- [ ] Documentar en README sección Configuration

---

## 8. Seguridad

> [!WARNING]
> **Flags `NEXT_PUBLIC_*` son visibles en el cliente**
> 
> No usar para features que requieran secretos. Para admin, combinar con verificación de auth.

---

## Referencias

| Documento | Contenido |
|-----------|-----------|
| [expansion-zones.md](expansion-zones.md) | Rutas que usan estos flags |
| [core-protected-zones.md](core-protected-zones.md) | Rutas que NO usan flags (siempre activas) |

---

*Creado: 2026-01-18*
