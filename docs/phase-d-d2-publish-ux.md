# Phase D/D2: Publish UX Improvements

## Summary

Enhanced Admin Content UI with clearer publish status controls and feedback messages.

---

## Changes Made

### 1. Admin List Page (`frontend/app/admin/content/page.tsx`)

**In REAL mode**, the info banner now:
- Clarifies data comes from `GET /content` (public API)
- Warns that if `FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1=true` is set on backend, draft items won't appear

### 2. New Content Page (`frontend/app/admin/content/new/page.tsx`)

- Added **status selector** (Draft / Published) before the form
- Shows clear explanation of each status
- Displays **success message** before redirect:
  - "✅ Saved as draft."
  - "✅ Published successfully!"

### 3. Edit Content Page (`frontend/app/admin/content/[slug]/edit/page.tsx`)

- Added **success message** state for all actions:
  - "✅ Changes saved successfully." (on save)
  - "✅ Published successfully!" (on publish)
  - "✅ Moved to drafts." (on unpublish)

---

## Impact of Published-Only Flag on Admin REAL Mode

| Scenario | Effect on Admin List (REAL mode) |
|----------|----------------------------------|
| Flag OFF | Shows ALL items (drafts + published) |
| Flag ON | Shows ONLY published items (drafts hidden) |

> **Important**: The Admin list in REAL mode uses the public `GET /content` endpoint.
> When `FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1=true`, the backend excludes drafts from this endpoint.

---

## Manual Testing Steps

### Test 1: Admin List Banner
1. Enable `NEXT_PUBLIC_FEATURE_CONTENT_ADMIN_DUAL_MODE_V1=true`
2. Enable `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_WRITE_V1=true`
3. Navigate to `/admin/content`
4. Switch to "Real" mode
5. ✓ Verify banner shows `GET /content` and mentions `FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1`

### Test 2: Create with Status Selector
1. Navigate to `/admin/content/new`
2. ✓ Verify "Save as: 📝 Draft / 🌐 Published" selector is visible
3. Fill form, select "Draft", submit
4. ✓ Verify success message "✅ Saved as draft."
5. Create another, select "Published"
6. ✓ Verify success message "✅ Published successfully!"

### Test 3: Edit Page Status Actions
1. Edit a draft item via `/admin/content/{slug}/edit`
2. Click "Publish" and confirm
3. ✓ Verify success message "✅ Published successfully!"
4. Click "Unpublish" and confirm
5. ✓ Verify success message "✅ Moved to drafts."
6. Click "Save Changes"
7. ✓ Verify success message "✅ Changes saved successfully."

### Test 4: Published-Only Flag Impact
1. Set backend `FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1=true`
2. Create a draft in REAL mode
3. ✓ Verify draft does NOT appear in Admin list (REAL mode)
4. Set flag to `false`, refresh
5. ✓ Verify draft now appears

---

## Files Touched

| File | Change |
|------|--------|
| `frontend/app/admin/content/page.tsx` | Enhanced REAL mode banner |
| `frontend/app/admin/content/new/page.tsx` | Added status selector + success messages |
| `frontend/app/admin/content/[slug]/edit/page.tsx` | Added success messages |
| `docs/phase-d-d2-publish-ux.md` | This documentation |

---

## What Was NOT Touched

| Area | Status |
|------|--------|
| `/practice/*` | ✅ NOT TOUCHED |
| XP, gamification | ✅ NOT TOUCHED |
| `feed/contentClient.ts` | ✅ NOT TOUCHED |
| Backend endpoints | ✅ NOT TOUCHED |
| Migrations | ✅ NOT TOUCHED |
| ContentForm.tsx | ✅ NOT TOUCHED |

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Brief delay on redirect (1.2s for success message) | Low | Intentional for user feedback |
| Draft not visible in REAL mode with flag ON | Info | Documented in banner + this doc |

---

## Rollback

All changes are additive UI messages. To rollback:
1. Revert the 3 modified files
2. Delete this documentation file
