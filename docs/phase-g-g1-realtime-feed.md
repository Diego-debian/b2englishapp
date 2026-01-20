# Phase G/G1: Feed Real-Time Integration

## Summary

Implemented real-time content fetching for `/content/feed` by disabling caching when reading from the backend, and added a visual source indicator in the UI.

---

## Changes

### 1. `frontend/lib/contentClient.ts`

- **No Cache:** Added `cache: 'no-store'` and `next: { revalidate: 0 }` to backend fetch requests to ensure data is always fresh.
- **Metadata Support:** Added `fetchContentListWithMetadata()` which returns items along with `source` ("Backend" vs "Mock") and `timestamp`.
- **Backward Compatibility:** `fetchContentList()` still exists and wraps the new function.

### 2. `frontend/app/content/feed/page.tsx`

- Updated to use `fetchContentListWithMetadata()`.
- Passes `source` and `timestamp` to the client component.

### 3. `frontend/app/content/feed/FeedClient.tsx`

- Added props for `source` and `timestamp`.
- Displays a source badge (e.g., "Source: Backend") and "Updated: HH:MM:SS" in the header.
- Supports both V2 (Glassmorphic) and Legacy UI modes.

---

## Verification Steps

### Test 1: Real-Time Updates
1. Ensure `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1=true` and Backend is running.
2. Create/Publish a new article in Admin Panel (Real Mode).
3. Open `/content/feed`.
4. **Verify:**
   - New article appears immediately.
   - Indicator shows "Source: Backend".
   - Refresh page -> Timestamp updates.

### Test 2: Fallback (Backend Down)
1. Stop backend service.
2. Refresh `/content/feed`.
3. **Verify:**
   - Content still loads (from Mock).
   - Indicator shows "Source: Mock (fallback)".

### Test 3: Backend Disabled via Flag
1. Set `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1=false`.
2. Refresh `/content/feed`.
3. **Verify:**
   - Content loads from Mock.
   - Indicator shows "Source: Mock".

---

## Files Touched

- `frontend/lib/contentClient.ts`
- `frontend/app/content/feed/page.tsx`
- `frontend/app/content/feed/FeedClient.tsx`
- `docs/phase-g-g1-realtime-feed.md`

---

## What Was NOT Touched

- `/practice` endpoints
- Gamification / XP logic
- Core design system components
- Other pages
