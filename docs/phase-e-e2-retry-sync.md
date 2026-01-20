# Phase E/E2: Retry Sync Feature

## Summary

Added "Retry sync" button to Admin Content pages allowing users to retry failed backend syncs when backend becomes available again.

---

## Changes

### AdminSyncStatus Component

Added new props for optional action button:
- `actionLabel` - Button text (e.g., "🔄 Retry sync")
- `onAction` - Click handler
- `actionDisabled` - Disable button (e.g., when no auth)
- `actionHint` - Hint when disabled (e.g., "Login required")

Added new sync status:
- `syncing` - Shows "🔄 Syncing..." during retry

---

### New Content Page (`new/page.tsx`)

- Stores `lastSavedPayload` when backend fails
- Shows "🔄 Retry sync" button when `syncStatus === "saved_local"` and `mode === "real"`
- `handleRetrySync()` retries `createContent(payload)`
- Error categorization: 401 (auth), 409 (conflict), 5xx (server)
- Disabled with hint "Login required" when no auth token

### Edit Content Page (`edit/page.tsx`)

- Same as above but uses `updateContent(slug, payload)`
- Error categorization: 401 (auth), 404 (not found), 5xx (server)

---

## Error Handling

| HTTP Status | Error Message | Sync Message |
|-------------|---------------|--------------|
| 401 | Authentication expired/failed | "auth expired" |
| 404 | Content not found (edit only) | "not found" |
| 409 | Content already exists (new only) | "conflict" |
| 5xx | Server error/unavailable | "server error" |

---

## Manual Testing

### Test 1: Backend Down → Retry → Success
1. Start with backend DOWN
2. Navigate to New Content, fill form, save
3. ✓ **Verify**: "💾 Saved locally — backend error" + "🔄 Retry sync" button
4. Start backend
5. Click "🔄 Retry sync"
6. ✓ **Verify**: "🔄 Syncing..." then "☁️ Synced"

### Test 2: No Auth → Disabled Button
1. Clear auth token
2. Navigate to New Content, fill form, save (real mode)
3. ✓ **Verify**: "💾 Saved locally — no auth" + "🔄 Retry sync" button disabled
4. ✓ **Verify**: Hint "(Login required)" shown

### Test 3: Edit Page Retry
1. Same as Test 1, but editing existing content
2. ✓ **Verify**: Retry uses `updateContent` not `createContent`

### Test 4: Conflict Error (409)
1. Create content locally
2. Create same slug on backend directly
3. Try retry sync
4. ✓ **Verify**: "Content already exists on server. — conflict"

---

## Files Touched

| File | Change |
|------|--------|
| `frontend/components/admin/AdminSyncStatus.tsx` | Added action button props + syncing status |
| `frontend/app/admin/content/new/page.tsx` | Added retry sync with handleRetrySync |
| `frontend/app/admin/content/[slug]/edit/page.tsx` | Added retry sync with handleRetrySync |
| `docs/phase-e-e2-retry-sync.md` | This documentation |

---

## What Was NOT Touched

| Area | Status |
|------|--------|
| `/practice/*` | ✅ NOT TOUCHED |
| XP, gamification | ✅ NOT TOUCHED |
| `feed/contentClient.ts` | ✅ NOT TOUCHED |
| Backend endpoints | ✅ NOT TOUCHED |
| Stores (contentStore) | ✅ NOT TOUCHED |
| Migrations | ✅ NOT TOUCHED |
