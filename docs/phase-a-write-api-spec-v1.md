# Phase A — Write API Specification v1

> **Ticket**: Phase A / A2  
> **Date**: 2026-01-19  
> **Status**: DOCUMENTATION ONLY — NO CODE CHANGES

---

## 1. Context (Summary from A1)

### Backend Evidence

| Component | Status | File |
|-----------|--------|------|
| Content Router | ✅ Exists (READ-ONLY) | `backend/app/routers/content.py` |
| Content Model | ✅ Exists | `backend/app/models/content.py` |
| Table | ✅ `content_items` | PostgreSQL |
| Auth Dependency | ✅ `get_current_user` | `backend/app/main.py:82-102` |

### Current Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/content` | None | List published content |
| GET | `/content/{slug}` | None | Get single published item |

### Missing (per A1)

- POST/PUT/DELETE endpoints for content
- `ContentCreate`, `ContentUpdate` schemas
- Admin-specific router

---

## 2. Decision: Router Placement

### Option A: Write in `/content` (Same Router)

| Pros | Cons |
|------|------|
| Simple, single router | Mixes public (GET) and admin (POST/PUT/DELETE) |
| Fewer files | Requires conditional auth logic |
| | Public router becomes privileged |

### Option B: Write in `/admin/content` (Separate Router) ✅ RECOMMENDED

| Pros | Cons |
|------|------|
| Clear separation of concerns | Additional router file |
| All `/admin/*` endpoints require auth | Two routers for same resource |
| Matches frontend Admin path structure | |
| Easier feature flag isolation | |

### Decision

**Recommendation**: Option B — Create new `backend/app/routers/admin_content.py`

**Rationale**: 
- Matches frontend Admin structure (`/admin/content/*`)
- All admin endpoints can share `Depends(get_current_user)` at router level
- Easier to feature-flag independently from public read API

---

## 3. Endpoint Specification (Proposed)

### POST /admin/content

**Purpose**: Create new content item

| Field | Value |
|-------|-------|
| Method | POST |
| Path | `/admin/content` |
| Auth | `Depends(get_current_user)` |
| Request Body | `ContentCreate` |
| Response | `ContentItemPublic` |

**Status Codes**:
| Code | Condition |
|------|-----------|
| 201 Created | Success |
| 400 Bad Request | Invalid payload structure |
| 401 Unauthorized | Missing/invalid token |
| 409 Conflict | Slug already exists |
| 422 Unprocessable Entity | Validation error |

---

### PUT /admin/content/{slug}

**Purpose**: Update existing content item

| Field | Value |
|-------|-------|
| Method | PUT |
| Path | `/admin/content/{slug}` |
| Auth | `Depends(get_current_user)` |
| Request Body | `ContentUpdate` |
| Response | `ContentItemPublic` |

**Status Codes**:
| Code | Condition |
|------|-----------|
| 200 OK | Success |
| 400 Bad Request | Invalid payload structure |
| 401 Unauthorized | Missing/invalid token |
| 404 Not Found | Slug does not exist |
| 422 Unprocessable Entity | Validation error |

---

### DELETE /admin/content/{slug}

**Purpose**: Delete content item

| Field | Value |
|-------|-------|
| Method | DELETE |
| Path | `/admin/content/{slug}` |
| Auth | `Depends(get_current_user)` |
| Request Body | None |
| Response | None |

**Status Codes**:
| Code | Condition |
|------|-----------|
| 204 No Content | Success |
| 401 Unauthorized | Missing/invalid token |
| 404 Not Found | Slug does not exist |

---

## 4. Pydantic Schemas (Proposed — Doc Only)

### ContentCreate

```python
class ContentCreate(BaseModel):
    slug: str = Field(..., min_length=1, max_length=100, pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    title: str = Field(..., min_length=1, max_length=255)
    body: str = Field(..., min_length=1)
    excerpt: Optional[str] = Field(None, max_length=500)
    status: Literal["draft", "published"] = Field("draft")
```

### ContentUpdate

```python
class ContentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    body: Optional[str] = Field(None, min_length=1)
    excerpt: Optional[str] = Field(None, max_length=500)
    status: Optional[Literal["draft", "published", "archived"]] = None
```

**Note**: `slug` is NOT updatable (immutable identifier).

### Field Mapping to Model

| Schema Field | Model Column | Notes |
|--------------|--------------|-------|
| `slug` | `slug` | Unique, immutable |
| `title` | `title` | Required |
| `body` | `body` | Required (Text) |
| `excerpt` | `excerpt` | Optional |
| `status` | `status` | Enum |
| — | `published_at` | Auto-set (see rules) |
| — | `created_at` | Auto-set |
| — | `updated_at` | Auto-updated |

---

## 5. Business Rules

### Slug Uniqueness

- On POST: If slug exists → 409 Conflict
- Slug is immutable after creation

### Published At Timestamp

```python
# Desired behavior in CRUD layer:
if new_status == "published" and old_status != "published":
    item.published_at = datetime.utcnow()
```

### Status Transitions

| From | To | Allowed |
|------|----|---------|
| draft | published | ✅ |
| draft | archived | ✅ |
| published | draft | ✅ |
| published | archived | ✅ |
| archived | draft | ✅ |
| archived | published | ✅ |

**No determinable con evidencia del código actual**: No explicit status transition validation exists in current codebase.

---

## 6. Feature Flags

### Frontend (Proposed — OFF by default)

```env
NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_WRITE_V1=false
```

**Behavior**:
- OFF: Admin uses localStorage only (current behavior)
- ON: Admin calls POST/PUT/DELETE to backend

### Backend (Proposed — OFF by default)

```env
FEATURE_CONTENT_ADMIN_WRITE_V1=false
```

**Behavior**:
- OFF: Admin write router NOT mounted
- ON: Admin write router mounted at `/admin/content`

### Flag Dependency Chain

```
Frontend WRITE_V1 = ON
    ↳ requires Backend ADMIN_WRITE_V1 = ON
        ↳ requires Backend CONTENT_API_V1 = ON (for public read)
```

---

## 7. Verification Plan (Phase B — Doc Only)

### Pre-Implementation Checklist

- [ ] Backend: Create `backend/app/routers/admin_content.py`
- [ ] Backend: Create `ContentCreate`, `ContentUpdate` schemas
- [ ] Backend: Add CRUD functions in `backend/app/crud/content.py`
- [ ] Backend: Add `FEATURE_CONTENT_ADMIN_WRITE_V1` to settings
- [ ] Frontend: Add `isContentBackendWriteV1Enabled()` helper
- [ ] Frontend: Add API calls in Admin components

### Test Scenarios (When Implemented)

| Scenario | Steps | Expected |
|----------|-------|----------|
| Create (success) | POST valid payload | 201, item in DB |
| Create (duplicate slug) | POST existing slug | 409 Conflict |
| Create (no auth) | POST without token | 401 Unauthorized |
| Update (success) | PUT valid changes | 200, DB updated |
| Update (not found) | PUT non-existent slug | 404 |
| Delete (success) | DELETE existing slug | 204, removed from DB |
| Publish flow | PUT status="published" | `published_at` set |

### Demo Safety

- Flag OFF → Demo continues using localStorage
- Flag ON → Test in isolated environment first
- Rollback: Set flag OFF, demo unaffected

---

## 8. Confirmation

✅ **NO CODE WAS TOUCHED** — This is API specification documentation only.

### Files Created

- `docs/phase-a-write-api-spec-v1.md` (this document)

### What Was NOT Touched

| Area | Status |
|------|--------|
| `/frontend/app/practice/*` | ✅ NOT TOUCHED |
| XP / Gamification | ✅ NOT TOUCHED |
| Zustand stores (practiceStore, authStore) | ✅ NOT TOUCHED |
| Backend source code | ✅ NOT TOUCHED |
| Database / Migrations | ✅ NOT TOUCHED |
| Schemas (`.py` files) | ✅ NOT TOUCHED |
