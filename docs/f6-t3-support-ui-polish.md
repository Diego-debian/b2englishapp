# F6-T3: Support Page UI Polish

> **Status:** ✅ Implementado
> **Ruta:** `/support`
> **Flag:** `NEXT_PUBLIC_FEATURE_SUPPORT` (protección mantenida)

---

## Qué Cambió

### Nueva Estructura de Página

| Sección | Contenido |
|---------|-----------|
| **Hero** | Título, subtítulo, icono animado |
| **3 Cards Info** | Por qué apoyar / En qué se usa / Transparencia |
| **3 Formas de Apoyar** | Donación (próximamente) / Difusión / Feedback |
| **CTA Final** | Botón "Compartir B2 English" con Web Share API |

### Mejoras de UI
- Gradientes y efectos glass
- Hover animations en cards
- Iconos contextuales
- Colores diferenciados por tipo de acción
- Diseño responsive (mobile-first)

### Copy Final
- Texto en español
- Tono cercano y profesional
- Donaciones marcadas como "Próximamente"
- Contacto: "por el canal donde me encontraste" (no hay email oficial en el código)

---

## Archivos Tocados (1 + doc)

| Archivo | Cambio |
|---------|--------|
| `frontend/app/support/page.tsx` | Reescrito completo con nueva UI |
| `docs/f6-t3-support-ui-polish.md` | **NUEVO** |

---

## Pruebas Manuales

### Test A: Flag ON
1. En `.env.local`: `NEXT_PUBLIC_FEATURE_SUPPORT=1`
2. Reiniciar: `npm run dev`
3. Navegar a `/support`
4. Verificar:
   - Hero con título animado
   - 3 cards de información
   - 3 opciones de apoyo
   - Botón "Compartir" funciona (Web Share o copia enlace)

### Test B: Flag OFF
1. Eliminar `NEXT_PUBLIC_FEATURE_SUPPORT` de `.env.local`
2. Reiniciar: `npm run dev`
3. Navegar a `/support`
4. Verificar: Redirige a `/`

---

## Qué NO Se Tocó

- ❌ `/practice/*`
- ❌ `/dashboard`
- ❌ XP/gamificación
- ❌ Stores Zustand existentes
- ❌ Header/Footer (ya implementados en T1/T2)
- ❌ Backend/endpoints
- ❌ `isSupportEnabled()` (sigue funcionando igual)

---

## Riesgos

- **Ninguno:** Solo cambios de UI/copy en un archivo aislado

---

*Creado: 2026-01-18*
