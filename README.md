# Architect CRM Demo

A small CRM demo for an architecture firm. Built in stages.

## Stage 1 — Backend (done)

Express + TypeScript + Mongoose backend with full CRUD for `Client` and
`Project`, following the express-conventions skill (asyncHandler, ApiError,
a shared `ApiResponse<T>` type, separated routes/controllers/models).

### Setup

```
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI (defaults to local) and ANTHROPIC_API_KEY when needed
npm run dev
npm run seed            # optional: populates sample clients/projects for local testing
```

Requires a running MongoDB instance (local service or Atlas) at the URI in `.env`.

### API

Every response is `{ success: true, data }` or `{ success: false, error }`.

- `GET /health`
- `POST /api/clients`, `GET /api/clients`, `GET /api/clients/:id`, `PUT /api/clients/:id`, `DELETE /api/clients/:id`
- `POST /api/projects`, `GET /api/projects` (client populated), `GET /api/projects/:id` (client populated), `PUT /api/projects/:id`, `DELETE /api/projects/:id`
- `PATCH /api/projects/:id/stage` — updates just the stage
- `POST /api/projects/:id/interactions` — pastes free-text call/meeting notes, asks Claude for a 2-3 sentence summary + a suggested follow-up task, saves it as an `Interaction`
- `GET /api/projects/:id/interactions` — past interactions for a project, newest first
- `POST /api/projects/:id/contacts`, `GET /api/projects/:id/contacts` — contacts (contractor/engineer/consultant/...) linked to a project

Project `stage` is one of: `inquiry`, `consultation`, `quote`, `contract`,
`preliminary_design`, `permits`, `detailed_design`, `construction_oversight`, `handover`.

## Stage 2 — Frontend (done)

React + TypeScript (Vite) frontend, following the react-conventions skill
(functional components typed as `FC<Props>`, CSS Modules, Redux Toolkit +
RTK Query for server state, one folder per component with an `index.ts`).

- **Projects list** — cards showing title, client, and stage badge, filterable by stage and searchable by client/project name.
- **Project detail** — full client info (name, email, phone, address, notes).
- **Bilingual UI** — Hebrew by default (RTL) with an English toggle (LTR) in the header; the choice persists in `localStorage`.

### Setup

```
cd client
npm install
npm run dev
```

The dev server proxies `/api` to `http://localhost:4000`, so run the backend
alongside it (see Stage 1 setup, including `npm run seed` for sample data).

## Stage 3 — AI-powered interaction summaries (done)

Backend calls the Claude API (server-side only, key from `.env` via `config.ts`,
never exposed to the frontend) to turn free-text call/meeting notes into a
structured summary and a suggested follow-up task.

- **Backend**: `services/anthropicService.ts` calls `claude-opus-5` with a
  forced tool call so the summary/follow-up come back as validated structured
  data, not parsed free text. Typed error handling for rate limits, a missing
  API key, and other upstream failures.
- **Frontend**: a "paste a call/meeting summary" form on the project detail
  page, plus a list of past interactions (summary, suggested follow-up, and
  the original text collapsed under a toggle).

Requires a real `ANTHROPIC_API_KEY` in `server/.env` to actually generate
summaries — without one, the endpoint fails gracefully with a clear error
instead of a crash.

## Stage A — Project detail: stage control + contacts (done)

- The project detail page's stage is now an editable dropdown (`PATCH /api/projects/:id/stage`)
  instead of a read-only badge.
- A **Contacts** section lists everyone linked to the project (name + role —
  contractor, engineer, consultant, ...), backed by a new `Contact` model.
