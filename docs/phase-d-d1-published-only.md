# Phase D/D1: Published-Only Filter

## Summary

Added `FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1` flag to control whether the public `/content` API returns only published items or all items.

---

## Flag Behavior

| Flag Value | List `/content` | Detail `/content/{slug}` |
|------------|-----------------|--------------------------|
| **OFF** (default) | Returns ALL content | Returns ANY status |
| **ON** | Returns ONLY published | Drafts → 404 |

---

## Files Modified

| File | Change |
|------|--------|
| `backend/app/settings.py` | +`FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1` |
| `backend/app/routers/content.py` | Conditional filtering based on flag |

---

## How to Enable

### Docker Compose
```yaml
backend:
  environment:
    - FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1=true
```

### Standalone
```bash
FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1=true uvicorn app.main:app --reload
```

---

## Test Commands

### With Flag OFF (default)
```bash
# List all content (including drafts)
curl http://localhost:8000/content
# Expected: items array may include draft items

# Get draft item
curl http://localhost:8000/content/draft-slug
# Expected: 200 OK with draft content
```

### With Flag ON
```bash
# List only published
curl http://localhost:8000/content
# Expected: items array contains ONLY published items

# Get draft item
curl http://localhost:8000/content/draft-slug
# Expected: 404 Not Found

# Get published item
curl http://localhost:8000/content/published-slug
# Expected: 200 OK
```

---

## Rollback

1. Set `FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1=false` (or remove the env var)
2. Restart backend
3. Behavior returns to default (all content visible)

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Draft content exposed when flag OFF | Low | Default is OFF only for dev; enable in prod |
| LRU cache on settings | Low | Flag read at import; restart required to change |

---

## What Was NOT Touched

| Area | Status |
|------|--------|
| Admin write router | ✅ NOT TOUCHED |
| Migrations | ✅ NOT TOUCHED |
| CRUD functions | ✅ NOT TOUCHED (reused existing) |
| Frontend | ✅ NOT TOUCHED |
