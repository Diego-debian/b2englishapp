# Phase A — Write Contract v1

> **Ticket**: Phase A / A1  
> **Date**: 2026-01-19  
> **Status**: DOCUMENTATION ONLY — NO CODE CHANGES

---

## 1. Evidence: Frontend (Admin Content)

### File Locations

| Component | File Path |
|-----------|-----------|
| Zustand Store | `frontend/store/contentStore.ts` |
| Admin List | `frontend/app/admin/content/page.tsx` |
| Admin Create | `frontend/app/admin/content/new/page.tsx` |
| Admin Edit | `frontend/app/admin/content/[slug]/edit/page.tsx` |
| Feature Flags | `frontend/lib/featureFlags.ts` |

### localStorage Persistence

**Key**: `"b2english-content"`

```typescript
// frontend/store/contentStore.ts - Lines 78-79, 145
export const useContentStore = create<ContentState>()(
    persist(
        (set, get) => ({ ... }),
        { name: "b2english-content" }  // localStorage key
    )
);
```

### Shape of Stored Object

Based on `frontend/store/contentStore.ts` lines 16-62:

```typescript
// ContentItem = VideoItem | TextItem | StoryItem | CtaItem

// Common Base (Lines 19-24)
interface ContentItemBase {
    type: ContentType;          // "video" | "text" | "story" | "cta"
    slug: string;               // unique identifier
    status: ContentStatus;      // "draft" | "published"
    published_at: string | null;
}

// TextItem Example (Lines 35-43)
interface TextItem extends ContentItemBase {
    type: "text";
    title: string;              // required
    body: string;               // required (markdown)
    excerpt?: string;           // optional
    level?: string;             // optional (B1/B2/C1)
    tense?: string;             // optional
    reading_time?: number;      // optional
}
```

### CONTENT_BACKEND_READ_V1 Behavior

**File**: `frontend/lib/featureFlags.ts` — Lines 111-117

```typescript
export const isContentBackendReadV1Enabled = (): boolean => {
    return isFeatureOn(process.env.NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1);
};
```

**Behavior** (`frontend/lib/contentClient.ts` — Lines 56-60):
- **OFF**: Feed reads from `MOCK_CONTENT` (hardcoded array in `lib/mockContent.ts`)
- **ON**: Feed fetches from `${NEXT_PUBLIC_API_URL}/content` (GET only), falls back to mock on error

---

## 2. Evidence: Backend (FastAPI/Postgres)

### Router Definition

**File**: `backend/app/routers/content.py`

```python
# Lines 17-20
router = APIRouter(
    prefix="/content",
    tags=["Content (Public)"]
)
```

**Endpoints (READ ONLY)**:
| Method | Path | Function | Auth |
|--------|------|----------|------|
| GET | `/content` | `get_content_list()` | None (Public) |
| GET | `/content/{slug}` | `get_content_detail()` | None (Public) |

**No determinable with evidence del código actual**: POST, PUT, DELETE endpoints for content.

### Feature Flag (Backend)

**File**: `backend/app/settings.py` — Line 24

```python
FEATURE_CONTENT_API_V1: bool = Field(False, alias="FEATURE_CONTENT_API_V1")
```

**Mounted conditionally** (`backend/app/main.py` — Lines 211-214):
```python
if _settings.FEATURE_CONTENT_API_V1:
    from app.routers import content
    app.include_router(content.router)
    print("✅ Content API mounted (Feature Flag ON)")
```

### Authentication

**File**: `backend/app/main.py` — Lines 82-102

```python
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    # JWT validation with PyJWT
    # oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
```

**Note**: Content router does NOT use `get_current_user` dependency — endpoints are public.

### Database

**File**: `backend/app/database.py`

```python
# Lines 30-36
engine = create_engine(
    _settings.DATABASE_URL,  # e.g., postgresql+psycopg2://user:pass@db:5432/dbname
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=30,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

### Content Model

**File**: `backend/app/models/content.py` — Lines 9-20

```python
class ContentItem(BaseModel):
    __tablename__ = "content_items"

    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    excerpt = Column(String, nullable=True)
    body = Column(Text, nullable=False)
    status = Column(Enum("draft", "published", "archived", name="content_status_enum"), 
                   default="draft", nullable=False)
    
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
```

### Write Schemas

**No determinable with evidencia del código actual**: No `ContentCreate`, `ContentUpdate`, or `ContentDelete` schemas exist in `backend/app/schemas/`.

---

## 3. Write Contract v1 (Deducible)

### Proposed POST /content Payload

Based on frontend `TextItem` shape and backend `ContentItem` model:

```json
{
  "slug": "my-article-slug",        // required, unique
  "title": "Article Title",          // required
  "body": "Markdown content...",     // required
  "excerpt": "Short summary",        // optional
  "status": "draft"                  // optional, default: "draft"
}
```

### Field Mapping

| Frontend Field | Backend Column | Required | Notes |
|----------------|----------------|----------|-------|
| `slug` | `slug` | ✓ | Unique, indexed |
| `title` | `title` | ✓ | |
| `body` | `body` | ✓ | Text/Markdown |
| `excerpt` | `excerpt` | | |
| `status` | `status` | | Enum: draft/published/archived |
| `type` | — | | Not in backend model |
| `level` | — | | Not in backend model |
| `reading_time` | — | | Not in backend model |
| — | `published_at` | | Auto-set when status='published' |
| — | `created_at` | | Auto-set |
| — | `updated_at` | | Auto-updated |

### Versioning / IDs

**No determinable with evidencia del código actual**: No explicit version field in model. `id` is inherited from `BaseModel` (integer, auto-increment).

---

## 4. Feature Flags (Proposed — OFF by Default)

### New Flags (Documentation Only)

| Flag | Default | Purpose |
|------|---------|---------|
| `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_WRITE_V1` | `false` | Enable Admin → Backend write operations |
| `NEXT_PUBLIC_FEATURE_CONTENT_ADMIN_DUAL_MODE_V1` | `false` | Show backend/localStorage toggle in Admin |

### Existing Flags (Reference)

| Flag | Current Default | File |
|------|-----------------|------|
| `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1` | `false` | `frontend/lib/featureFlags.ts:115` |
| `FEATURE_CONTENT_API_V1` (Backend) | `false` | `backend/app/settings.py:24` |

---

## 5. Risks & Rollback

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Backend write endpoints don't exist | High | Must implement POST/PUT/DELETE in backend first |
| Frontend type mismatch | Medium | Backend model lacks `type`, `level`, `reading_time` fields |
| No auth on content router | Medium | Admin write ops need `get_current_user` dependency |
| localStorage/Backend conflict | Medium | Need dual-mode or migration strategy |

### Rollback

- **This document**: Delete `docs/phase-a-write-contract-v1.md`
- **No code changes made** — nothing else to rollback

### What Was NOT Touched

| Area | Status |
|------|--------|
| `/frontend/app/practice/*` | ✅ NOT TOUCHED |
| XP / Gamification | ✅ NOT TOUCHED |
| Zustand stores (practiceStore, authStore) | ✅ NOT TOUCHED |
| Backend endpoints | ✅ NOT TOUCHED |
| Database migrations | ✅ NOT TOUCHED |

---

## 6. Deliverables

### Files Touched
- `docs/phase-a-write-contract-v1.md` (this document) — **CREATED**

### Build Verification
```bash
# No build required — documentation only
# If desired for smoke test:
cd frontend && npm run build  # Should pass unchanged
```

### Manual Test Steps

1. **Verify localStorage key**:
   - Open Admin: `/admin/content`
   - Create/edit content
   - Open DevTools → Application → Local Storage
   - Confirm key `"b2english-content"` exists with items array

2. **Verify Feed source (flag OFF)**:
   - Set `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1=false`
   - Open `/content/feed`
   - Open DevTools → Console
   - Look for: `"[ContentClient] Backend Read Disabled -> Using Mock"`

3. **Verify Feed source (flag ON)**:
   - Set `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1=true`
   - Ensure backend is running with `FEATURE_CONTENT_API_V1=true`
   - Open `/content/feed`
   - Look for: `"[ContentClient] Fetching list from..."`

---

## Confirmation

✅ **NO CODE WAS TOUCHED** — This is documentation only based on repository evidence.
