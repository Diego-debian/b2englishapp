# F7-T4: Feed UX "Vendible"

> **Status:** ✅ Implementado
> **Ruta:** `/content/feed`

---

## Mejoras Implementadas

### 1. Sistema de Filtros (Frontend-Only)
Se implementaron filtros locales sobre `MOCK_CONTENT`:
- **Status Filter:** `published` (default) | `draft` | `archived` | `all`.
- **Tag Filter:** Dropdown dinámico generado a partir de los tags únicos disponibles en los items.

### 2. UI de Cards "Vendible"
Diseño profesional alineado con la estética B2English (Dark/Glass):
- **Visual:** Background `bg-slate-900`, borde sutil `white/10`, hover effects.
- **Header:** Placeholder de imagen con gradiente + Badge de estado.
- **Meta:** Lista de Tags (chips), Fecha (inteligente: `publishedAt` si publicado, sino `createdAt`).
- **Layout:** Grid responsive (1 -> 2 -> 3 columnas).

### 3. Mock Data Testing
Se enriqueció `MOCK_CONTENT` para validar filtros:
- Un item `draft` ("Future Tenses").
- Un item `archived` ("Old News").
- Tags variados (`tips`, `grammar`, `news`, `a1`, `b2`).

---

## Cómo Probar

1. **Activar Feature Flag**: `NEXT_PUBLIC_FEATURE_CONTENT=1` en `.env.local`.
2. **Navegar**: `/content/feed`.
3. **Validar Filtro Default**: Solo se deben ver cards con badge "Published".
4. **Validar Filtro Status**:
   - Cambiar a "Draft" → Aparece "Future Tenses".
   - Cambiar a "Archived" → Aparece "Old News".
   - Cambiar a "All" → Todo el contenido.
5. **Validar Filtro Tags**:
   - Seleccionar "grammar" → Muestra artículos de gramática.
   - Seleccionar "news" → Muestra solo el archivado (si filtro status permite).
6. **Navegación**: Clic en cualquier card lleva a `/content/[slug]`.

---

## Archivos Tocados

- `frontend/app/content/feed/page.tsx` (Reescritura completa)
- `frontend/lib/mockContent.ts` (Nuevos items y tags)
- `docs/f7-t4-content-feed-ux.md` (NUEVO)

## Qué NO Se Tocó

- Spec (`contentSpec.ts` se usó tipos, no se cambió).
- `/content/[slug]` detail page.
- Backend/DB.
