# Análisis Post-MVP (PMV) — B2English & DDShortener

**Fecha**: 17 de Enero, 2026
**Tipo**: Documento de Análisis y Estrategia
**Estado**: Borrador para revisión

---

## 1. Auditoría Visual de Vistas

El estado actual del frontend muestra una inconsistencia visual entre las funcionalidades "Legacy" y las "Nuevas".

| Vista | Estado Visual | Observaciones |
|-------|---------------|---------------|
| **Focus Mode** | 🟢 **Premium** | Diseño moderno, glassmorphism, responsive pulido. Es el estándar a seguir. |
| **Landing (Home)** | 🟡 **Básico** | Funcional pero sencilla. Falta "impacto" y proposición de valor clara visualmente. |
| **Dashboard** | 🟡 **Legacy** | Estética funcional (Tailwind stock). No tiene la misma riqueza visual que Focus. |
| **Classic Practice** | 🟠 **Desactualizado** | Funciona, pero se siente de una generación anterior comparado con Focus. |
| **Tense/Verb Details**| 🟠 **Texto Plano** | Mucho texto, poca jerarquía visual o elementos interactivos. |

**Recomendación**: Unificar el Design System basándose en los componentes de Focus Mode (Cards con gradientes, tipografía moderna, feedback visual rico).

## 2. Aprendizaje Acumulado (El "Gap" de Datos)

Actualmente, el **Dashboard** solo refleja progreso de **Vocabulario** (UserProgress), ignorando totalmente las sesiones de Gramática (Focus).

### Estado Actual
- **Focus**: Guarda eventos en `ActivityAttempts`.
- **Dashboard**: Lee de `UserProgress` (Verbos).
- **Resultado**: El usuario siente que "no avanza" en el dashboard tras sesiones de gramática.

### Opciones Conceptuales
1.  **Refactor de Modelo (Alto Esfuerzo)**: Modificar `UserProgress` para aceptar `tense_id` además de `verb_id`, o crear `UserGrammarProgress`.
2.  **Capa de Agregación (Medio Esfuerzo)**: Crear un endpoint nuevo `GET /stats/summary` que consulte ambas fuentes (`UserProgress` y `ActivityAttempts`) y las combine en tiempo real ("Total Sesiones", "Precisión Global").
3.  **Dashboard Modular (Bajo Esfuerzo)**: Añadir una *tarjeta separada* en el Dashboard llamada "Grammar Stats" que consuma directamente los `ActivityAttempts` sin mezclarlos con el vocabulario.

## 3. Vistas de Contenido (Media)

La plataforma actualmente es muy dependiente de texto. Para un nivel B2/Pro, se requiere diversificar los inputs.

**Faltantes Identificados:**
- **Audio**: Pronunciación de verbos (TTS o grabaciones reales). Crucial para listening.
- **Video**: Explicaciones cortas (tipo Reels/Shorts) para reglas gramaticales complejas.
- **Micro-Copy**: Feedback auditivo (sonidos de acierto/error) para reforzar la gamificación.

## 4. Donaciones y Monetización

Existiendo dos proyectos activos (B2English y DDShortener), se debe definir la estrategia de soporte.

- **Modelo**: "Supportware" / "Buy me a coffee".
- **Implementación**:
    - Botón discreto en Footer y Dashboard.
    - Página `/support` unificada o específica por proyecto.
    - Proveedores: PayPal, Stripe, o GitHub Sponsors.
- **DDShortener Cross-Promo**: Utilizar el acortador para links salientes de B2English, mostrando banner "Powered by DDShortener" para generar tráfico cruzado.

## 5. Estado PMV de DDShortener

DDShortener se encuentra en un estado funcional estable pero "tímido".

- **Estado**: Funcionalidad Core (acortar + redirección) operativa.
- **Copy**: Revisado para ser "Legal Light" (Best effort).
- **Falta**:
    - **Identidad**: No está claro si es un producto SAAS independiente o una herramienta interna pública.
    - **Integración**: No está siendo "consumido" dogfooding por B2English (ej. enlaces compartidos de retos).

## 6. Riesgos Detectados

### Técnicos
1.  **Fragmentación de Datos**: La separación estricta entre Focus y el resto del sistema dificulta métricas globales.
2.  **Deploy Complexity**: Manejar dos proyectos fullstack separados multiplica el esfuerzo de DevOps/Mantenimiento.
3.  **Local Storage dependency**: Estadísticas de Focus (Racha, Metas) viven solo en el navegador del usuario. Si cambia de dispositivo, pierde esa motivación visual inmediata.

### De Producto
1.  **Curva de Abandono**: Si el usuario no ve reflejado su esfuerzo de gramática en su "Nivel", puede desmotivarse.
2.  **Falta de Contenido**: Pocas preguntas por Tense (Focus) = Repetición rápida = Aburrimiento.

## 7. Preguntas Abiertas

1.  ¿Se debe migrar el Dashboard para que sea "Card-based" y modular (permitiendo widgets de gramática)?
2.  ¿Vale la pena invertir en infraestructura de audio ahora o post-lanzamiento?
3.  ¿Cómo se integrará DDShortener visualmente? ¿Marca blanca o co-branding?

## 8. Prioridades Sugeridas (Roadmap Táctico)

1.  **Prioridad 1 (Quick Win)**: **Dashboard Modular**. Añadir una tarjeta simple que cuente "Sesiones de Foco Completadas" consultando `ActivityAttempts`. Cierra el gap de percepción de progreso sin refactor masivo.
2.  **Prioridad 2 (Visibilidad)**: **Auditoría UI Home**. Aplicar estilos de Focus a la Landing page para mejorar la conversión/primera impresión.
3.  **Prioridad 3 (Sostenibilidad)**: **Botones de Donación**. Implementar infraestructura de pagos simple para validar interés.
4.  **Prioridad 4 (Contenido)**: **Expansión de Bancos de Preguntas**. El código aguanta, el contenido es el cuello de botella actual.
