# B2 English Learning Platform 🎓

> **Status:** Public Beta (v0.2.0)
> **Focus:** Fullstack Language Learning Architecture

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://english.diegodebian.online) [![License](https://img.shields.io/badge/License-GPLv3-blue)](LICENSE)

## 1. What is B2 English?
**B2 English** is a specialized, gamified learning platform designed to help intermediate students master the nuances of English grammar and vocabulary. Unlike generic language apps, it focuses strictly on the "B2 Bridge" – the gap between basic fluency and professional competence – by providing targeted drills on irregular verbs and complex tenses.

It is built as a robust **Fullstack Application** that demonstrates modern architectural patterns, separating concerns between high-performance drill execution (Focus Mode) and persistent vocabulary tracking (Dashboard).

## 2. Product Philosophy
We believe in **"Honest Gamification"**:
- **No vanity metrics**: Progress is measured by actual correct answers, not just time spent.
- **Short, Intense Sessions**: Micro-learning sessions (3-5 mins) designed for high cognitive load and retention.
- **Immediate Logic**: Every mistake provides an instant, grammatical explanation, not just the correct answer.

## 3. Core Feature: Focus Mode 🎯
The flagship feature of this Beta release is **Focus Mode**:
- **Targeted Grammar**: Select specific tenses (e.g., *Past Perfect Continuous*) to drill deep.
- **Smart Decks**: Questions are not random; they are curated to cover specific edge cases of each tense.
- **Stateless Execution**: Designed as a rapid-fire "gym" session. If you refresh, you reset. This encourages completing the 5-question set in flow state.
- **Results Tracking**: Every session result is cryptographically signed and sent to the backend for audit, ensuring learning proof.

## 4. Current Capabilities (Beta)
The platform currently offers:
- **Practice Engines**:
  - **Classic Mode**: Adaptive difficulty ladder for vocabulary.
  - **Millionaire Mode**: Gamified quiz with high-stakes mechanics.
  - **Focus Mode**: Tense-specific grammar drills.
- **Knowledge Base**:
  - Searchable Irregular Verb Database.
  - Comprehensive Tense Guides with examples.
- **User System**:
  - Secure Authentication (JWT).
  - Personal Dashboard.
  - Mobile-Responsive Design.

## 5. Progress & Dashboard (Current Scope)
The **Dashboard** currently tracks your **Vocabulary Mastery** (Verbs).
- It consumes data from the **Spaced Repetition System (SRS)** engine.
- XP and Level reflect your overall engagement.

> **Note on Focus Mode stats:**
> While Focus Mode results are persisted in the backend (`ActivityAttempts`), they **do not yet** contribute to the "Accumulated Learning" vocabulary stats on the dashboard. This is an intentional architectural separation during the Beta phase: generic grammar practice is tracked separately from specific verb mastery.

## 6. Tech Stack
This project utilizes a modern, type-safe stack:

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State**: Zustand (Local), React Query (Server)
- **Styling**: Tailwind CSS + Framer Motion
- **Architecture**: Atomic Design Components

### Backend
- **API**: FastAPI (Python 3.11)
- **Database**: PostgreSQL 16
- **ORM**: SQLAlchemy (Async)
- **Auth**: OAuth2 + JWT
- **Quality**: Pydantic v2 for rigorous schema validation

## 7. Architecture Notes
The system is designed with **Domain-Driven Design (DDD)** principles loosely applied:
- **Progress Isolation**: User mastery is decoupled from activity execution. A user can practice endless activities without polluting their long-term SRS stats unless explicitly intended.
- **Event-Based Results**: Practice sessions emit "Results Events" to the backend. In the future, these events can be replayed to recalculate stats with different algorithms without losing data.
- **Frontend-First Logic**: For immediate feedback, question validation happens optimistically on the client (Focus Mode), while the backend remains the source of truth for persistence.

## 8. Known Limitations
As a Beta release, please note:
1.  **Dashboard Scope**: As mentioned, grammar drills (Focus) do not update the "Verbs Learned" counter.
2.  **Session Persistence**: Refreshing the browser during a Focus session will reset that specific session (by design, to avoid state corruption).
3.  **Content**: Current question banks cover major tenses but are not exhaustive.

## 9. Planned Evolution
- **Unified Analytics**: Merging Grammar and Vocabulary stats into a holistic "Fluency Score".
- **Multi-Day Streaks**: Moving streak logic from local-device to server-side for cross-device persistence.
- **Adaptive Focus**: Using previous mistakes to recommend specific Focus sessions.
