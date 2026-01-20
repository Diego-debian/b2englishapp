# Phase A — Flag Matrix, Threat Model & QA Plan

> **Ticket**: Phase A / A3  
> **Date**: 2026-01-19  
> **Status**: DOCUMENTATION ONLY — NO CODE CHANGES

---

## 1. Flag Matrix

### Frontend Flags

| Flag | Default | Purpose |
|------|---------|---------|
| `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1` | `false` | Feed reads from Backend API (vs mock) |
| `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_WRITE_V1` | `false` | Admin writes to Backend API (vs localStorage) |
| `NEXT_PUBLIC_FEATURE_CONTENT_ADMIN_DUAL_MODE_V1` | `false` | Admin shows toggle for backend/localStorage |

### Backend Flags

| Flag | Default | Purpose |
|------|---------|---------|
| `FEATURE_CONTENT_API_V1` | `false` | Mount public read router `/content` |
| `FEATURE_CONTENT_ADMIN_WRITE_V1` | `false` | Mount admin write router `/admin/content` |

---

### Valid Combinations

| # | READ_V1 | WRITE_V1 | DUAL_MODE | API_V1 | ADMIN_WRITE | Status | Notes |
|---|---------|----------|-----------|--------|-------------|--------|-------|
| 1 | OFF | OFF | OFF | OFF | OFF | ✅ VALID | Demo mode (localStorage + mock) |
| 2 | ON | OFF | OFF | ON | OFF | ✅ VALID | Read from backend, write to localStorage |
| 3 | ON | ON | OFF | ON | ON | ✅ VALID | Full backend integration |
| 4 | ON | ON | ON | ON | ON | ✅ VALID | Dual mode with toggle |
| 5 | OFF | OFF | ON | OFF | OFF | ✅ VALID | Dual mode in demo (localStorage only) |

---

### Prohibited Combinations

| # | READ_V1 | WRITE_V1 | DUAL_MODE | API_V1 | ADMIN_WRITE | Status | Reason |
|---|---------|----------|-----------|--------|-------------|--------|--------|
| P1 | OFF | ON | * | * | * | ❌ INVALID | Cannot write to backend without reading from it |
| P2 | ON | ON | * | OFF | * | ❌ INVALID | Frontend expects backend but API not mounted |
| P3 | ON | ON | * | ON | OFF | ❌ INVALID | Admin write enabled but router not mounted |
| P4 | * | * | * | OFF | ON | ❌ INVALID | Admin write router without public read API |

**Rule**: `WRITE_V1=ON` requires `READ_V1=ON` AND `API_V1=ON` AND `ADMIN_WRITE_V1=ON`

---

## 2. Threat Model

### Actors

| Actor | Description | Trust Level |
|-------|-------------|-------------|
| Anonymous User | Public internet visitor | Untrusted |
| Authenticated User | Logged in via `/token` | Low trust |
| Admin User | Authenticated + authorized | Trusted |

### Roles & Permissions

**No determinable con evidencia del código actual**: No role-based access control (RBAC) exists. Current `get_current_user` only validates JWT token, does not check roles.

**Proposed mitigation (Phase B)**: 
- All `/admin/*` endpoints require valid JWT (existing `get_current_user`)
- Treat any authenticated user as "admin" for MVP
- Future: Add `is_admin` field to User model

---

### Threat Analysis

| ID | Threat | Actor | Impact | Likelihood | Mitigation |
|----|--------|-------|--------|------------|------------|
| T1 | Unauthenticated content modification | Anonymous | High | Medium | `Depends(get_current_user)` on all write endpoints |
| T2 | Unauthorized user creates content | Auth User | Medium | Medium | *No determinable* — assume all auth users are admin for MVP |
| T3 | Slug injection / XSS in body | Any | Medium | Low | Validate slug regex; sanitize markdown render |
| T4 | Mass content deletion | Auth User | High | Low | Confirmation UI; soft-delete option (future) |
| T5 | Duplicate slug collision | Auth User | Low | Medium | 409 Conflict response, unique constraint in DB |
| T6 | Rate limiting abuse | Any | Medium | Medium | *No determinable* — rate limiting not implemented |

### Required Mitigations for Phase B

| Priority | Mitigation | Status |
|----------|------------|--------|
| P0 | JWT auth on all `/admin/*` routes | Planned (Phase B) |
| P0 | Slug validation regex | Planned (Phase B) |
| P1 | Unique slug constraint (DB level) | ✅ Exists in model |
| P1 | Status enum validation | ✅ Exists in model |
| P2 | Admin role check | Deferred (post-MVP) |
| P2 | Rate limiting | Deferred (post-MVP) |
| P2 | Markdown sanitization | *No determinable* — frontend renders, review needed |

---

## 3. QA Plan for Phase B

### Happy Path Tests

| Test ID | Endpoint | Action | Expected |
|---------|----------|--------|----------|
| HP1 | POST /admin/content | Create valid item | 201, item in response |
| HP2 | PUT /admin/content/{slug} | Update title | 200, updated title |
| HP3 | PUT /admin/content/{slug} | Publish (status=published) | 200, published_at set |
| HP4 | DELETE /admin/content/{slug} | Delete existing | 204 No Content |
| HP5 | GET /content | List after create | New item in list |
| HP6 | GET /content/{slug} | Get created item | Item details |

### Error Tests

| Test ID | Endpoint | Condition | Expected |
|---------|----------|-----------|----------|
| E401-1 | POST /admin/content | No token | 401 Unauthorized |
| E401-2 | PUT /admin/content/{slug} | Invalid token | 401 Unauthorized |
| E401-3 | DELETE /admin/content/{slug} | Expired token | 401 Unauthorized |
| E403-1 | * | Non-admin user | *No determinable* — RBAC not implemented |
| E404-1 | PUT /admin/content/{slug} | Non-existent slug | 404 Not Found |
| E404-2 | DELETE /admin/content/{slug} | Non-existent slug | 404 Not Found |
| E409-1 | POST /admin/content | Duplicate slug | 409 Conflict |
| E422-1 | POST /admin/content | Missing title | 422 Unprocessable |
| E422-2 | POST /admin/content | Invalid slug format | 422 Unprocessable |
| E422-3 | PUT /admin/content/{slug} | Empty body | 422 Unprocessable |

### Integration Tests

| Test ID | Scenario | Expected |
|---------|----------|----------|
| INT1 | Admin creates → Feed shows | Published item visible in /content |
| INT2 | Admin unpublishes → Feed hides | Item not in /content list |
| INT3 | Admin deletes → Feed 404 | /content/{slug} returns 404 |

---

## 4. Rollback Plan

### Flag Disable Order

```
1) Frontend: NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_WRITE_V1 → false
   ↳ Admin reverts to localStorage-only mode
   ↳ Users see existing localStorage data

2) Frontend: NEXT_PUBLIC_FEATURE_CONTENT_ADMIN_DUAL_MODE_V1 → false
   ↳ Dual mode toggle hidden

3) Backend: FEATURE_CONTENT_ADMIN_WRITE_V1 → false
   ↳ /admin/* routes return 404

4) (Optional) Backend: FEATURE_CONTENT_API_V1 → false
   ↳ Public /content routes return 404
   ↳ Feed falls back to MOCK_CONTENT
```

### Rollback Scenarios

| Scenario | Action | Data Impact |
|----------|--------|-------------|
| Bug in write API | Disable WRITE_V1 (front) | Backend data preserved, localStorage resumes |
| Auth failure | Disable ADMIN_WRITE_V1 (back) | Routes return 404, frontend gets network error |
| Full revert | All flags OFF | Demo mode, mock data, localStorage |

### Data Preservation

- Backend data remains in PostgreSQL
- localStorage data remains in browser
- No automatic sync between sources
- Manual migration required if switching back

---

## 5. Acceptance Criteria Checklist

- [x] Document exists: `docs/phase-a-flag-matrix-threatmodel-qa.md`
- [x] Flag matrix with valid/prohibited combinations
- [x] Threat model with actors, risks, mitigations
- [x] QA plan with 401/403/404/409/422 + happy paths
- [x] Rollback plan with flag order
- [x] Only changes in `/docs`

---

## 6. Confirmation

✅ **NO CODE WAS TOUCHED** — This is documentation only.

### Files Created

- `docs/phase-a-flag-matrix-threatmodel-qa.md` (this document)

### What Was NOT Touched

| Area | Status |
|------|--------|
| `/frontend/app/practice/*` | ✅ NOT TOUCHED |
| XP / Gamification | ✅ NOT TOUCHED |
| Zustand stores (practiceStore, authStore) | ✅ NOT TOUCHED |
| Backend source code | ✅ NOT TOUCHED |
| Schemas / Migrations | ✅ NOT TOUCHED |
| Feature flag implementation | ✅ NOT TOUCHED |
