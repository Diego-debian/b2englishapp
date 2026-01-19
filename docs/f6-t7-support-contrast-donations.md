# F6-T7: Fix de Contraste + Donaciones Reales

> **Status:** ✅ Implementado
> **Ruta:** `/support`

---

## Mejoras Visuales (Hardening)

Se eliminaron problemas de legibilidad siguiendo reglas de alto contraste:

| Elemento | Antes (T3) | Ahora (T7) |
|----------|------------|------------|
| **Fondo Cards** | `glass-strong` (variable) | `bg-slate-900/80` (sólido oscuro) |
| **Bordes** | `border-white/10` | Mantenido `border-white/10` |
| **Títulos** | Gradients / White | `text-white` (sin gradients) |
| **Texto Base** | `text-slate-400` | `text-slate-300` (más brillante) |
| **Iconos** | Gradients complejos | Fondos sólidos con transparencia (e.g. `bg-violet-900/20`) |

---

## Donaciones Reales Implementadas

Se eliminó el placeholder "PRÓXIMAMENTE" y se agregaron links funcionales:

### 1. PayPal
- **Link:** `https://www.paypal.com/donate/?business=profediegoparra01@gmail.com`
- **Estilo:** Botón azul sólido (`bg-blue-600`)

### 2. Ko-fi
- **Link:** `https://ko-fi.com/diegodebian`
- **Estilo:** Botón rojo sólido (`bg-red-600`)


### 3. Contacto Oficial
- **Email:** `b2english.app@gmail.com` (link mailto)
- **Estilo:** `text-amber-200/90` con hover `text-white` para máximo contraste.

---

## Pruebas Manuales

### Visual Check
1. Activar flag: `NEXT_PUBLIC_FEATURE_SUPPORT=1`
2. Navegar a `/support`
3. Verificar que todo el texto sea perfectamente legible sobre el fondo oscuro.
4. Verificar que no haya texto con gradientes (difíciles de leer).
5. Verificar el email en la tarjeta de Feedback.

### Functional Check
1. Clic en botón **PayPal** -> Abre página de donación a `profediegoparra01@gmail.com`.
2. Clic en botón **Ko-fi** -> Abre perfil de `diegodebian`.
3. Clic en email `b2english.app@gmail.com` -> Abre cliente de correo.

---

## Archivos Tocados

- `frontend/app/support/page.tsx`
- `docs/f6-t7-support-contrast-donations.md`

## Qué NO Se Tocó

- Header / Footer
- Routing / Layout
- Feature Flags (`isSupportEnabled` intacto)
- Otros directorios (`/practice`, `/dashboard`)
