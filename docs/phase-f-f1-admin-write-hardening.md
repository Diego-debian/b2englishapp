# Phase F/F1: Admin Write Hardening

## Summary

Hardened admin content write endpoints (`POST/PUT/DELETE /admin/content`) with structured logging and consistent error handling.

---

## Changes Made

### `backend/app/routers/admin_content.py`

**Logging:**
- Added `logging.getLogger(__name__)`
- Structured logs for each action: `slug`, `action`, `status_code`, `result`
- No tokens or body content logged

**Error Handling:**
| Error | Status | Detail |
|-------|--------|--------|
| Duplicate slug | 409 | "Content with this slug already exists" |
| IntegrityError (DB) | 409 | "Content with this slug already exists" |
| Content not found | 404 | "Content not found" |
| Unexpected exception | 500 | "An unexpected error occurred" |

---

## Log Format Examples

```
# Success
INFO - admin_content.create: slug=my-article action=create status=201 result=success

# Duplicate
WARNING - admin_content.create: slug=my-article action=create status=409 result=duplicate

# Not found
WARNING - admin_content.update: slug=missing action=update status=404 result=not_found

# Server error
ERROR - admin_content.delete: slug=bad action=delete status=500 result=error error_type=ValueError
```

---

## Testing with curl

### Prerequisites
```bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass" | jq -r '.access_token')
```

### 201 - Create Success
```bash
curl -X POST http://localhost:8000/admin/content \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug":"test-article","title":"Test","body":"Content"}'
# Expected: 201 + JSON response
# Log: admin_content.create: slug=test-article action=create status=201 result=success
```

### 409 - Duplicate Slug
```bash
curl -X POST http://localhost:8000/admin/content \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug":"test-article","title":"Test","body":"Content"}'
# Expected: 409 {"detail":"Content with this slug already exists"}
# Log: admin_content.create: slug=test-article action=create status=409 result=duplicate
```

### 404 - Update Non-existent
```bash
curl -X PUT http://localhost:8000/admin/content/non-existent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'
# Expected: 404 {"detail":"Content not found"}
# Log: admin_content.update: slug=non-existent action=update status=404 result=not_found
```

### 401 - No Auth
```bash
curl -X POST http://localhost:8000/admin/content \
  -H "Content-Type: application/json" \
  -d '{"slug":"test","title":"Test","body":"Content"}'
# Expected: 401 {"detail":"Not authenticated"}
```

### 422 - Validation Error
```bash
curl -X POST http://localhost:8000/admin/content \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug":"test"}'
# Expected: 422 (missing required fields title, body)
```

---

## Files Touched

| File | Change |
|------|--------|
| `backend/app/routers/admin_content.py` | Added logging + error handling |
| `docs/phase-f-f1-admin-write-hardening.md` | This documentation |

---

## What Was NOT Touched

| Area | Status |
|------|--------|
| `/practice/*` | ✅ NOT TOUCHED |
| XP, gamification | ✅ NOT TOUCHED |
| Migrations | ✅ NOT TOUCHED |
| DB models | ✅ NOT TOUCHED |
| Frontend | ✅ NOT TOUCHED |
| API contract | ✅ PRESERVED (POST/PUT/DELETE still protected) |
| `FEATURE_CONTENT_ADMIN_WRITE_V1` flag | ✅ PRESERVED |

---

## Rollback

Revert `admin_content.py` to previous version (no logging, basic error messages).
