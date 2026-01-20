# Hotfix: SSR Docker API URL

## Problem
In Docker environments, frontend SSR (Server-Side Rendering) requests to `http://localhost:8001` fail because `localhost` refers to the frontend container itself, not the host machine or backend container.

## Solution
Implemented split routing for API requests:
- **Client-Side (Browser):** Uses `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:8001`).
- **Server-Side (SSR):** Uses `API_INTERNAL_URL` (e.g., `http://backend:8000`).

## Changes
1. **`docker-compose.yml`**: Added `API_INTERNAL_URL: http://backend:8000` to frontend service.
2. **`frontend/lib/contentClient.ts`**: Updated `getApiUrl` to prioritized `API_INTERNAL_URL` when `window` is undefined.
3. **`frontend/lib/adminContentClient.ts`**: Same update as above.

## Verification
1. **Docker Build:** `docker-compose up --build`
2. **SSR Check:** Open `/content/feed`. Should load data (Source: Backend) without "fetch failed" errors.
3. **Client Check:** Browser network tab shows requests to `localhost:8001`.

## Risks
- If `API_INTERNAL_URL` is misconfigured in production (e.g., different service name), SSR will fail.
- Ensure `backend` service name matches `http://backend:8000`.
