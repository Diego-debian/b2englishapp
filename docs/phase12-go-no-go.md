# Phase 12 — Go/No-Go Decision Matrix

> **Release decision framework**  
> **Input documents**: [phase12-smoke-regression-checklist.md](./phase12-smoke-regression-checklist.md), [phase12-test-run-results.md](./phase12-test-run-results.md)

---

## A) Regression Matrix

### Core Areas

| Area | Routes | Flag Dependent | Priority |
|------|--------|----------------|----------|
| **Homepage** | `/` | No | P0 |
| **Content Feed** | `/content/feed` | `FEATURE_CONTENT` | P1 |
| **Content Detail** | `/content/[slug]` | `FEATURE_CONTENT` | P1 |
| **Admin List** | `/admin/content` | `FEATURE_CONTENT` | P1 |
| **Admin Create** | `/admin/content/new` | `FEATURE_CONTENT` | P1 |
| **Admin Edit** | `/admin/content/[slug]/edit` | `FEATURE_CONTENT` | P1 |
| **Practice Hub** | `/practice` | — | P0 |
| **Focus Mode** | `/practice/focus` | — | P0 |
| **Dashboard** | `/dashboard` | — | P1 |

### UI Flag Matrix

| Flag State | Expected Behavior |
|------------|-------------------|
| `UI_V11=false` | Light calm palette, legacy styles |
| `UI_V11=true` | Light calm palette + ds.* polish |

### Content Flag Matrix

| Flag State | Expected Behavior |
|------------|-------------------|
| `CONTENT=false` | Content routes redirect to `/` |
| `CONTENT=true` | Content routes accessible |
| `CONTENT_UX_V2=true` | Glassmorphic V2 experience |
| `CONTENT_BACKEND_READ_V1=true` | Fetch from backend API |

---

## B) Risk Classification

### P0 — Critical (Blocker)
> Release cannot proceed

- [ ] Build fails (`npm run build` non-zero exit)
- [ ] Homepage (`/`) crashes or shows error
- [ ] Practice routes completely broken
- [ ] User data loss or corruption
- [ ] Security vulnerability exposed

### P1 — Major (High Impact)
> Release can proceed with documented workaround

- [ ] Content feed fails to load
- [ ] Admin CRUD operations broken
- [ ] Feature flag toggle causes crash
- [ ] Significant visual regression
- [ ] Authentication flow broken

### P2 — Minor (Low Impact)
> Release can proceed, fix in next iteration

- [ ] Minor styling inconsistencies
- [ ] Non-critical console warnings
- [ ] Edge case UI glitches
- [ ] Copy/text typos
- [ ] Performance degradation (non-blocking)

---

## C) Decision Criteria

### GO Criteria (All must be true)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | `npm run build` passes (exit 0) | ☐ |
| 2 | Zero P0 incidents | ☐ |
| 3 | All P1 incidents have documented workaround | ☐ |
| 4 | Homepage loads successfully | ☐ |
| 5 | Practice core functionality works | ☐ |
| 6 | Flag OFF/ON both produce expected results | ☐ |

### NO-GO Criteria (Any one triggers)

| # | Criterion | Triggered |
|---|-----------|-----------|
| 1 | Build fails | ☐ |
| 2 | Any P0 incident unresolved | ☐ |
| 3 | More than 3 unresolved P1 incidents | ☐ |
| 4 | Core practice flow broken | ☐ |
| 5 | Data integrity risk detected | ☐ |

---

## D) Final Decision

### Current Status

| Metric | Value |
|--------|-------|
| **Date** | YYYY-MM-DD |
| **Commit** | `xxxxxxx` |
| **P0 Incidents** | 0 |
| **P1 Incidents** | 0 |
| **P2 Incidents** | 0 |
| **Build Status** | ☐ PASS / ☐ FAIL |

### Decision

```
┌─────────────────────────────────────────────┐
│                                             │
│   ☐  GO — Ready for release                 │
│                                             │
│   ☐  NO-GO — Blocking issues found          │
│                                             │
│   ☐  CONDITIONAL GO — With noted caveats    │
│                                             │
└─────────────────────────────────────────────┘
```

### Notes

_Document any conditions, caveats, or follow-up items:_

1. 
2. 
3. 

### Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Dev Lead | | | |
| Product | | | |

---

## References

- [Smoke Regression Checklist](./phase12-smoke-regression-checklist.md)
- [Test Run Results Template](./phase12-test-run-results.md)
