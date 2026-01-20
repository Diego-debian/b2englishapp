# Phase 12 — Smoke Tests & Regression Checklist

> **Purpose**: Manual verification checklist before releases  
> **Last Updated**: 2026-01-19

---

## A) Build Verification

### A1. Production Build
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Run `npm run build` in `/frontend` | Exit code 0, no errors | ☐ PASS / ☐ FAIL | |

### A2. Linting
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Run `npm run lint` in `/frontend` | No errors (warnings OK) | ☐ PASS / ☐ FAIL | |

---

## B) Public Routes

### B1. Homepage
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Navigate to `/` | Page loads, no console errors | ☐ PASS / ☐ FAIL | |
| Verify navigation links visible | Header/nav renders correctly | ☐ PASS / ☐ FAIL | |

### B2. Content Feed
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Navigate to `/content/feed` | Feed page loads | ☐ PASS / ☐ FAIL | |
| Verify published content appears | Cards render with title, excerpt | ☐ PASS / ☐ FAIL | |
| Click tag filter dropdown | Options appear, filter works | ☐ PASS / ☐ FAIL | |
| Click on a content card | Navigates to detail page | ☐ PASS / ☐ FAIL | |

### B3. Content Detail
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Navigate to `/content/[slug]` | Article loads with title, body | ☐ PASS / ☐ FAIL | |
| Verify markdown renders correctly | Headers, lists, code blocks visible | ☐ PASS / ☐ FAIL | |
| Click "Back to feed" link | Returns to `/content/feed` | ☐ PASS / ☐ FAIL | |
| Click Share button | Web Share API / copy link works | ☐ PASS / ☐ FAIL | |

---

## C) Core User Features

> ⚠️ **Note**: These tests require authentication and active feature flags

### C1. Practice Routes
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Navigate to `/practice` | Practice hub loads | ☐ PASS / ☐ FAIL | |
| Navigate to `/practice/focus` | Focus mode loads, tense selector visible | ☐ PASS / ☐ FAIL | |
| Complete a Focus session | Summary screen appears | ☐ PASS / ☐ FAIL | |

### C2. XP & Gamification
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Complete practice activity | XP counter increments | ☐ PASS / ☐ FAIL | |
| Check dashboard | XP total reflects activity | ☐ PASS / ☐ FAIL | |

### C3. Progress Persistence
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Complete activities, reload page | Progress persists | ☐ PASS / ☐ FAIL | |
| Log out and log back in | Previous progress visible | ☐ PASS / ☐ FAIL | |

---

## D) Admin Panel

> ⚠️ **Note**: Requires admin authentication / content feature flag

### D1. Content List
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Navigate to `/admin/content` | Content list loads | ☐ PASS / ☐ FAIL | |
| Verify filter tabs work | All/Draft/Published filter correctly | ☐ PASS / ☐ FAIL | |
| Click Edit on an item | Navigates to edit form | ☐ PASS / ☐ FAIL | |

### D2. Create Content
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Click "New Content" button | Form loads | ☐ PASS / ☐ FAIL | |
| Fill required fields, submit | Item created, appears in list | ☐ PASS / ☐ FAIL | |
| Verify validation | Errors show for empty required fields | ☐ PASS / ☐ FAIL | |

### D3. Edit Content
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Edit existing item | Form pre-fills with data | ☐ PASS / ☐ FAIL | |
| Change title, save | Title updates in list | ☐ PASS / ☐ FAIL | |

### D4. Publish/Unpublish
| Action | Expected Result | Status | Notes |
|--------|-----------------|--------|-------|
| Publish a draft | Status changes to Published | ☐ PASS / ☐ FAIL | |
| Verify item appears in public feed | `/content/feed` shows item | ☐ PASS / ☐ FAIL | |
| Unpublish an item | Status changes to Draft | ☐ PASS / ☐ FAIL | |
| Verify item hidden from public feed | `/content/feed` no longer shows item | ☐ PASS / ☐ FAIL | |

---

## Summary

| Section | Tests | Passed | Failed |
|---------|-------|--------|--------|
| A) Build | 2 | — | — |
| B) Public Routes | 8 | — | — |
| C) Core User | 6 | — | — |
| D) Admin | 10 | — | — |
| **Total** | **26** | — | — |

**Tester**: _______________  
**Date**: _______________  
**Overall Status**: ☐ PASS / ☐ FAIL
