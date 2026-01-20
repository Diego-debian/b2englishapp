# Release v0.8.0 Checklist

## 1. Local Smoke Tests
Run these tests locally with Docker (`docker compose up`) before pushing.

- [ ] **Backend Health**: `GET http://localhost:8000/health` -> 200 OK.
- [ ] **Backend Content List**: `GET http://localhost:8000/content` -> 200 OK (returns JSON list).
- [ ] **Feed Source Indicator**: Open `http://localhost:3000/content/feed`.
  - [ ] Should show green badge: `Source: Backend`.
  - [ ] Should NOT show "fetch failed" error.
- [ ] **Admin Write Disabled**:
  - [ ] Set `NEXT_PUBLIC_FEATURE_CONTENT_ADMIN_DUAL_MODE_V1=false`.
  - [ ] Verify Admin UI does not show "Real/Mock" toggle (should be stuck in Mock or disabled, depending on other flags, but goal is "Admin Write Disabled" for public).
  - *Correction*: If `ADMIN_WRITE_V1=false` on backend, writing should fail/be hidden.

## 2. Docker SSR Configuration
**Critical for Docker Deployments:**
Ensure the frontend service in `docker-compose.yml` (and production env) has:
```yaml
environment:
  API_INTERNAL_URL: http://backend:8000
```
This enables Server-Side Rendering (SSR) to communicate with the backend container.

## 3. Final Environment Variables (Production)
Use these values to "Freeze" the Admin (Read-Only) and enable Public Feed from Backend.

### Frontend (`.env.local` / Docker env)
```bash
# Disable Admin Write UI / Dual Mode
NEXT_PUBLIC_FEATURE_CONTENT_ADMIN_DUAL_MODE_V1=false
NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_WRITE_V1=false

# Enable Public Feed Reading from Backend
NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1=true

# Standard URLs
NEXT_PUBLIC_API_URL=https://api.b2english.com # (Or your domain)
API_INTERNAL_URL=http://backend:8000 # (Keep internal for Docker)
```

### Backend (`.env` / Docker env)
```bash
# Enable API V1
FEATURE_CONTENT_API_V1=true

# Enforce Published Only for Public API
FEATURE_CONTENT_PUBLIC_PUBLISHED_ONLY_V1=true

# Disable Admin Writes
FEATURE_CONTENT_ADMIN_WRITE_V1=false
```

## 4. GitHub Release Commands
```bash
# 1. Push Main
git push origin main

# 2. Tag Release
git tag v0.8.0
git push origin v0.8.0
```

## 5. Server Deployment Commands
Assuming Docker Compose setup on server:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Pull/Build Containers
docker compose build --no-cache

# 3. Restart Services
docker compose up -d

# 4. Post-Deploy Verification
# Check logs for frontend fetch errors
docker compose logs -f frontend
```

## 6. Rollback Plan
If `v0.8.0` fails:
1. Revert `NEXT_PUBLIC_FEATURE_CONTENT_BACKEND_READ_V1=false` (Frontend uses Mock).
2. Redeploy Frontend.
