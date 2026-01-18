# Auditoría: Subsistema de Donaciones DDShortener

> **Proyecto fuente:** DDShortener (url_shortener_project)
> **Propósito:** Documentar patrón para replicar en B2English
> **Tipo:** Auditoría pasiva (read-only)

---

## 1. Arquitectura Observada

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
├─────────────────────────────────────────────────────────────┤
│  /support (página)                                          │
│       │                                                     │
│       ├──► fetch('/app-config/donations.json')              │
│       │                                                     │
│       └──► Render dinámico de métodos de donación           │
│                                                             │
│  CTAs hardcodeados:                                         │
│       • Home.tsx (línea 88)                                 │
│       • About.tsx (línea 75)                                │
│       • Dashboard.tsx (línea 261)                           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATIC CONFIG                            │
├─────────────────────────────────────────────────────────────┤
│  /app-config/donations.json                                 │
│       • Servido por Nginx como static file                  │
│       • No requiere backend                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────┤
│  • PayPal Donate (primary)                                  │
│  • Ko-fi (alternative)                                      │
│  • Email manual para activación Premium                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Flujo Funcional Real

### Flujo de donación (usuario)

1. Usuario navega a `/support` (o hace click en CTA desde Home/Dashboard)
2. Frontend hace `fetch('/app-config/donations.json')`
3. UI renderiza métodos de donación desde JSON
4. Usuario hace click en enlace externo (PayPal/Ko-fi)
5. Donación ocurre **fuera del sistema**
6. Usuario envía email manual con comprobante
7. Operador (Diego) activa Premium manualmente

### Flujo técnico

```
User click → Support.tsx loads
           → fetch /app-config/donations.json
           → JSON parsed → state updated
           → methods.map() → render donation cards
           → User clicks → window.open(external URL)
```

---

## 3. Fuente de Datos

### Archivo: `/app-config/donations.json`

| Campo | Tipo | Propósito |
|-------|------|-----------|
| `title` | string | Título de la página |
| `subtitle` | string | Subtítulo/descripción |
| `methods[]` | array | Lista de métodos de donación |
| `methods[].name` | string | Nombre del método (PayPal, Ko-fi) |
| `methods[].url` | string | URL externa de donación |
| `methods[].suggested_amount` | string | Monto sugerido |
| `methods[].primary` | boolean | Si es el método recomendado |
| `methods[].icon` | string | Emoji/icono del método |
| `disclaimer` | string | Texto de disclaimer |
| `activation_instructions` | object | Instrucciones para activar Premium |

### Ubicación
- **Path:** `app-config/donations.json`
- **Servido por:** Nginx (static file)
- **Cacheable:** Sí (immutable content)

---

## 4. Integraciones Externas

| Servicio | Tipo | URL |
|----------|------|-----|
| PayPal Donate | Payment gateway | `https://www.paypal.com/donate/?business=profediegoparra01@gmail.com` |
| Ko-fi | Payment gateway | `https://ko-fi.com/diegodebian` |
| Email (manual) | Activation | `profediegoparra01@gmail.com` / `b2english.app@gmail.com` |

### Características

- **Sin webhook:** No hay callback automático de pago
- **Sin verificación programática:** La activación es 100% manual
- **Sin almacenamiento local:** No hay registro de donaciones en DB

---

## 5. UX Boundaries

### Lo que el sistema HACE

| Feature | Estado |
|---------|--------|
| Mostrar métodos de donación | ✅ Implementado |
| Links a servicios externos | ✅ Implementado |
| Instrucciones de activación | ✅ Implementado |
| Mostrar beneficios Premium | ✅ Hardcodeado en Support.tsx |

### Lo que el sistema NO HACE

| Feature | Razón |
|---------|-------|
| Procesar pagos | Usa servicios externos |
| Verificar donaciones | Manual por email |
| Activar Premium automáticamente | Requiere intervención humana |
| Registrar historial de donaciones | No hay modelo en DB |

---

## 6. Dependencias Implícitas

### Runtime

| Dependencia | Archivo | Línea |
|-------------|---------|-------|
| React useState/useEffect | Support.tsx | 1 |
| react-router-dom Link | Support.tsx | 2 |
| fetch API | Support.tsx | 35 |

### Infraestructura

| Dependencia | Propósito |
|-------------|-----------|
| Nginx | Servir `/app-config/donations.json` |
| PayPal account | Recibir donaciones |
| Email server | Comunicación manual |

### Archivos con CTAs hardcodeados

| Archivo | Línea | Contenido |
|---------|-------|-----------|
| `Home.tsx` | 88 | PayPal donate link |
| `About.tsx` | 75 | PayPal donate link |
| `Dashboard.tsx` | 261 | Navigate to /support |
| `Layout.tsx` | 92 | Footer link to /support |

---

## 7. Riesgos Heredados

| Riesgo | Severidad | Descripción |
|--------|-----------|-------------|
| **CTAs duplicados** | Media | URL de PayPal hardcodeada en 3+ archivos |
| **Activación manual** | Baja | No escala, pero está documentado |
| **Sin fallback** | Baja | Si donations.json falla, muestra error |
| **Inconsistencia email** | Media | Docs usa b2english.app@gmail.com, JSON usa profediegoparra01@gmail.com |
| **Sin rate limiting** | Baja | Fetch sin throttle, pero es static file |

---

## 8. Patrón Mínimo Replicable

### Para B2English

```
Componentes necesarios:
├── /app-config/donations.json      # Config declarativa
├── /support/page.tsx               # Página que consume JSON
└── Nginx config                    # Servir static JSON
```

### Principios del patrón

1. **Config-driven:** UI generada desde JSON, no hardcodeada
2. **Zero backend:** No requiere endpoints, solo static file
3. **External payments:** PayPal/Ko-fi manejan pagos
4. **Manual activation:** Email workflow, no automático
5. **Graceful degradation:** Error state si JSON no carga

### Schema mínimo replicable

```json
{
  "title": "string",
  "subtitle": "string",
  "methods": [
    {
      "name": "string",
      "url": "string",
      "primary": "boolean"
    }
  ],
  "disclaimer": "string",
  "activation_instructions": {
    "steps": ["string"]
  }
}
```

### Advertencias para implementación

> [!WARNING]
> **No duplicar URLs de pago**
> Centralizar en donations.json, no hardcodear en múltiples páginas.

> [!WARNING]
> **Email consistente**
> Usar un solo email para activación en toda la app.

> [!NOTE]
> **Activación manual es intencional**
> El patrón asume bajo volumen. Si escala, considerar webhook de PayPal.

---

## Referencias

| Archivo DDShortener | Propósito |
|---------------------|-----------|
| `frontend/src/pages/Support.tsx` | Página principal de donaciones |
| `app-config/donations.json` | Configuración de métodos |
| `docs/support.md` | Documentación pública |
| `verify.ps1:398` | Test de donations.json |
| `docs/release_checklist.md:58` | Verificación en release |

---

*Auditoría realizada: 2026-01-18*
*Proyecto auditado: DDShortener (url_shortener_project)*
