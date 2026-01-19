# F7-T7: Share & Copy Link

> **Status:** ✅ Implementado
> **Helper:** `frontend/lib/share.ts`

---

## Qué Cambió

### 1. Helper de Utilidad (`lib/share.ts`)
Se centralizó la lógica compartida:
- `copyToClipboard(text)`: Wrapper seguro (try/catch) para `navigator.clipboard`.
- `shareContent(data)`: Wrapper para Web Share API (`navigator.share`).
  - **Fallback:** Si Web Share no está soportado o falla, usa `copyToClipboard`.
  - **Returns:** "shared" | "copied" | "failed".

### 2. Integración en `/content/feed`
- **Botón:** Icono 🔗 pequeño en cada tarjeta.
- **Lógica:**
  - `stopPropagation()` para evitar navegar al detalle al hacer clic.
  - Copia `window.location.origin + /content/slug`.
  - Feedback: Alert nativo simple ("Link copiado...").

### 3. Integración en `/content/[slug]`
- **Header Actions:**
  - **📤 Compartir:** Usa Web Share API (móvil/modern browsers).
  - **🔗 Copiar Link:** Copia la URL actual.
- **Estilo:** Botones discretos (`bg-slate-800`) alineados con la UI.

---

## Pruebas Manuales

### Deskstop (Chrome/Edge)
1. `NEXT_PUBLIC_FEATURE_CONTENT=1`
2. **Feed:** Clic en 🔗 de una card → Alert "Link copiado". Pegar en notepad valida URL.
3. **Detalle:** Clic en "Compartir" → Si no soporta share, fallback a copy. Clic en "Copiar Link" → Alert "Link copiado".

### Móvil (Simulado o Real)
1. **Detalle:** Clic en "Compartir" → Debería abrir la hoja de compartir nativa (iOS/Android).

---

## Archivos Tocados

- `frontend/lib/share.ts` (NUEVO)
- `frontend/app/content/feed/page.tsx`
- `frontend/app/content/[slug]/page.tsx`
- `docs/f7-t7-content-share-links.md` (NUEVO)

## Qué NO Se Tocó

- Layout principal.
- Modificaciones a rutas existentes.
- Dependencias externas (se usó API nativa).
