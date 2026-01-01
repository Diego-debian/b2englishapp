# QA & Acceptance Criteria

## Day 2: Practice Variety (Pool Expansion + LRU)

**Objetivo:** Garantizar máxima variedad de preguntas y evitar repetición prematura en el modo Práctica Libre.

### Criterios de Aceptación

#### 1. Tamaño del Pool (Session Pool)
- **CRITERIO:** `pool_size_final` debe ser **20** siempre que `pool_size_after_dedupe` >= 20.
- **MOTIVO:** Asegura sesiones largas sin necesidad de recargar.

#### 2. Tasa de Repetición (Variety Ratio)
- **CRITERIO:** `repeats_total_in_session` debe ser **<= 30%** en 2 sesiones consecutivas (si el pool total disponible es suficiente).
- **MOTIVO:** El usuario debe sentir contenido fresco. Si `history` indica que algo se vio hace poco, no debería salir de nuevo si hay opciones frescas.
    
#### 3. Tolerancia a Fallos (Resilience)
- **Fallo Parcial:** Si una o más actividades fallan al cargar (Timeout/404) pero otras responden, el juego **debe arrancar** con las preguntas disponibles.
- **Fallo Total:** Si TODAS fallan, debe mostrar un **Alert UI** ("No se pudieron cargar preguntas") y permitir reintentar.

#### 4. Estabilidad (Small Pool)
- **CRITERIO:** Si el backend tiene pocas preguntas (< 20), el sistema NO debe crashear. Debe mostrar todas las disponibles sin truncar ni fallar por `index out of bounds`.

---

### Pasos de Verificación Manual (Dev Mode)

#### Configuración Previa
1.  En `.env.local`: `NEXT_PUBLIC_PRACTICE_VARIETY_V2="1"`.
2.  Abrir navegador > F12 > Console.

#### Check 1: Verificación de Pool y Métricas
1.  Iniciar "Práctica Libre" (Classic).
2.  Buscar grupo en consola: **"📊 Quest Variety Metrics"**.
3.  **Verificar:**
    *   `target`: "V2_LRU_SORT".
    *   `session_pool_target`: 20.
    *   `pool_size_final`: 20 (o total raw si es menor).
    *   `repeats_total_in_session`: Observar el valor.

#### Check 2: Verificación LRU (Ranking)
1.  Expandir Log.
2.  Revisar **"🏆 Top 5"**:
    *   Deben tener `seen: "NEVER"` o fechas antiguas (e.g. 2024).
3.  Revisar **"📉 Bottom 5"**:
    *   Deben ser las preguntas que acabas de ver en la sesión anterior (si corresponde).

#### Check 3: Network Resilience
1.  Simular Network Offline parcialmente (bloquear request en DevTools si es posible, o asumir Promise.allSettled test).

---

## Day 3 & 4: Onboarding & Stability

**Goal:** Ensure smooth new user entry and overall system stability.

### Manual QA Checklist

#### 1. Onboarding Flow (`/tenses`)
- [ ] **Banner Visibility:** "Master English Tenses" banner appears at the top (Desktop & Mobile).
- [ ] **Content Check:** Reads "Read -> Practice -> Repeat" clearly.
- [ ] **Interactions:**
    - [ ] "Start with a tense" -> Smoothly scrolls to the tense grid.
    - [ ] "Go to Practice" -> Navigates to `/practice`.

#### 2. Practice Focus Mode (`/practice?tense=slug`)
- [ ] **Banner:** Shows the specific Tense Focus banner (e.g. Past Continuous).
- [ ] **Style:** Dark/Glass premium card style matches the Tenses banner.
- [ ] **Filtering:** (UX Only) Confirms user is "Reviewing [Tense Name]".

#### 3. Standard Practice (`/practice`)
- [ ] **No Banner:** When no `?tense=` param is present, only the standard practice UI is shown.
- [ ] **Layout:** Spacing at top is correct (no overlap with header).

#### 4. Regression Testing
- [ ] **Classic Mode:** Game starts, questions load, submission works.
- [ ] **Millionaire Mode:** Timer works, lifelines work (frontend check).
- [ ] **Mobile Layout:** Stacked correctly, no horizontal overflow.

#### 5. Build
- [ ] `npm run build` passes with zero errors.

