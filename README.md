# B2English — English Grammar Learning Platform

> **Status:** Public Beta (v0.2.0)  
> **Core:** Focus Mode — Targeted Grammar Drills

[![License](https://img.shields.io/badge/License-GPLv3-blue)](LICENSE)

---

## 1. What is B2English (Beta)

B2English is a specialized learning platform designed to help intermediate English students master complex grammar patterns. Unlike generic language apps, it focuses strictly on the **B2 Bridge** — the gap between basic fluency and professional competence.

This is a **public beta**. Some features are stable, others are experimental, and some are in progress.

---

## 2. Core Experience: Focus Mode 🎯

The flagship feature of this release is **Focus Mode**:

- **Targeted Grammar**: Select specific tenses (e.g., *Past Perfect Continuous*) to drill deep
- **Smart Decks**: Questions are curated to cover specific edge cases of each tense
- **5-Question Sessions**: Designed for high cognitive load in 2-3 minutes
- **Backend Sync**: Results are persisted to the backend (`/focus/results`) for audit

> Focus Mode is **stable and validated** (see `docs/t3.3-focus-validation.md`)

---

## 3. Features

| Status | Feature | Notes |
|--------|---------|-------|
| ✅ Stable | **Focus Mode** | Tense-specific grammar drills, backend sync |
| ✅ Stable | **Tense Reference** | 12 tense guides with examples |
| ✅ Stable | **Irregular Verbs** | Searchable verb database |
| ✅ Stable | **Authentication** | JWT-based login/register |
| ✅ Stable | **Level/XP Display** | Header shows current level |
| ⚠️ Experimental | **Dashboard Stats** | Shows vocab progress, not grammar |
| ⚠️ Experimental | **Classic/Millionaire Modes** | Functional but not Focus-integrated |
| 🧪 In Progress | **Progress/SRS for Grammar** | Focus results do NOT update vocabulary stats |
| ❌ Not Ready | **Streak (cross-device)** | Currently localStorage only, hidden in UI |
| ❌ Not Ready | **Unified Analytics** | Grammar + Vocab in single score |

---

## 4. Limitations / Known Gaps

- **Focus ↔ Dashboard gap**: Focus Mode results are persisted but do NOT update the "Verbs Learned" counter or SRS. This is intentional architecture separation (see `docs/t2.3-focus-progress-bridge.md` — ABORTED).
- **Streak is device-local**: If you clear cache or change device, streak resets. Hidden from UI for honesty (see `docs/t1.2-streak-visibility.md`).
- **Session refresh = reset**: Refreshing browser during Focus resets that session (by design).
- **Content scope**: Question banks cover major tenses but are not exhaustive.
- **No mobile app**: Web-only (responsive design available).

---

## 5. Quickstart

### Option A: Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/b2english.git
cd b2english

# 2. Copy environment file
cp .env.example .env
# Edit .env with your values (see section 6)

# 3. Start all services
docker-compose up -d

# 4. Verify
curl http://localhost:8001/health   # → {"status":"alive"}
curl http://localhost:3000          # → Frontend

# 5. Create user and login via UI
open http://localhost:3000/register
```

### Option B: Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

---

## 6. Configuration (Environment Variables)

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@db:5432/b2english` |
| `SECRET_KEY` | JWT signing key | `your-secret-key-here` |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend URL for frontend | `http://localhost:8001` |

### Optional (with defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token TTL (24h) |
| `JWT_ALGORITHM` | `HS256` | JWT algorithm |
| `BACKEND_PORT` | `8001` | Backend exposed port |
| `FRONTEND_PORT` | `3000` | Frontend exposed port |

> See `docs/t0.1-contract-api.md` for full API contract.

---

## 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend 401 on all requests** | Token expired. Logout and login again. |
| **Focus results not saving** | Check backend logs. Ensure `/focus/results` returns 200. |
| **Dashboard shows 0 verbs** | Focus Mode does not update vocab stats (by design). Use Classic Mode. |
| **Streak shows 0 after cache clear** | Expected. Streak is localStorage-only during beta. |
| **CORS errors in browser** | Ensure `CORS_ORIGINS` includes your frontend URL. |

---

## 8. Contributing Workflow

This project follows strict collaboration rules (see `docs/t0.2-workflow-freeze-rules.md`):

| Action | Diego | Contributor |
|--------|:-----:|:-----------:|
| Git commit/push/merge | ✅ | ❌ |
| Write code | ❌ | ✅ |
| Create/edit docs | ❌ | ✅ |
| Execute verifications | ❌ | ✅ |
| Approve changes | ✅ | ❌ |

**Before closing any task:**
- List files touched
- Run `npm run build` / backend health check
- Document manual test steps
- Update docs if behavior changed

---

## 9. Documentation

Technical documentation lives in `/docs`:

| Doc | Description |
|-----|-------------|
| [t0.1-contract-api.md](docs/t0.1-contract-api.md) | API contract (endpoints, schemas) |
| [t0.2-workflow-freeze-rules.md](docs/t0.2-workflow-freeze-rules.md) | Development workflow |
| [t0.3-content-spec.md](docs/t0.3-content-spec.md) | Content structure |
| [t0.4-data-model.md](docs/t0.4-data-model.md) | Database schema |
| [t0.5-comments-strategy.md](docs/t0.5-comments-strategy.md) | Code comments policy |
| [t4.1-reduce-hardcode.md](docs/t4.1-reduce-hardcode.md) | Constants extraction |

---

## 10. Roadmap

See `/docs` for phase documentation:

- **Phase 1**: UI Honesty (Level, Streak visibility) — ✅ Done
- **Phase 2**: Backend Sync (Focus results) — ✅ Done
- **Phase 3**: Validation (E2E Focus flow) — ✅ Done
- **Phase 4**: Polish (Hardcode reduction, docs) — 🔄 In Progress
- **Future**: Unified analytics, server-side streaks, adaptive Focus

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Zustand |
| Backend | FastAPI, Python 3.11, SQLAlchemy Async |
| Database | PostgreSQL 16 |
| Auth | OAuth2 + JWT |

---

*Last updated: 2026-01-18*

---

## Files Touched

- `README.md` (this file)
