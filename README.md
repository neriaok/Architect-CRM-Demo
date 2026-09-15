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
cp .env.example .env   # fill in MONGODB_URI (defaults to local)
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
- `POST /api/projects/:id/interactions` — saves free-text call/meeting notes as an `Interaction`; pass `useAi: true` to have Claude turn it into a 2-3 sentence summary first, or omit it to save the text verbatim
- `GET /api/projects/:id/interactions` — past interactions for a project, newest first
- `DELETE /api/projects/:id/interactions/:interactionId` — deletes one interaction
- `POST /api/projects/:id/contacts`, `GET /api/projects/:id/contacts` — contacts (contractor/engineer/consultant/...) linked to a project
- `POST /api/assistant/ask` — ask a free-form question about the firm's projects/clients; see Stage E below

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

Turns free-text call/meeting notes into a summary and a suggested follow-up
task.

- **Backend**: `services/claudeCliService.ts` spawns the local `claude` CLI
  (`claude -p`, non-interactive mode) via Node's `execFile` — no API key,
  no SDK. The instruction prompt is prepended to the user's text and the
  whole thing is piped in over **stdin**, never passed as a command-line
  argument or interpolated into a shell string, so free-form user input
  can't reach argv or get shell-interpreted. Explicit handling for the CLI
  missing (`ENOENT`), timing out (45s), and non-zero exits, each mapped to
  a `502 Bad Gateway` `ApiError` with a clear message instead of a raw
  stack trace.
- **Frontend**: a "paste a call/meeting summary" form on the project detail
  page with two explicit actions — **Save as written** (verbatim, instant)
  or **AI Edit** (sends it through the CLI) — so an architect who wants the
  client's exact words isn't forced through a rewrite. Past interactions
  show an "AI-generated" badge only on the ones that went through the CLI,
  each with a delete button behind a confirmation dialog, and the original
  text collapsed under a toggle. Updated via RTK Query cache invalidation
  with no full page reload.

The server detects Hebrew via a Unicode-range check on the input and tells
the CLI exactly which language to answer in - asking it to just "match the
input language" proved inconsistent in practice.

Requires the `claude` CLI to already be installed and authenticated on the
machine running the server (`claude auth status` / `ant auth status`) —
without it, the AI-Edit path fails gracefully with a clear error instead of
a crash; Save-as-written never touches the CLI.

## Stage A — Project detail: stage control + contacts (done)

- The project detail page's stage is now an editable dropdown (`PATCH /api/projects/:id/stage`)
  instead of a read-only badge.
- A **Contacts** section lists everyone linked to the project (name + role —
  contractor, engineer, consultant, ...), backed by a new `Contact` model.

## Stage B — "New Project" flow (done)

A "+ New Project" button on the projects list opens a modal to create a
Client + Project together in one flow (client name, project title, initial
stage). It makes two sequential calls to the existing `POST /clients` and
`POST /projects` endpoints, then navigates straight to the new project's
detail page.

## Stage D — "Stuck project" detection (done)

`GET /api/projects` now also returns `daysSinceLastInteraction` and
`needsAttention` per project, computed server-side (`utils/projectAttention.ts`)
from the most recent `Interaction` date - or `createdAt` if it has none -
against a per-stage tolerance (e.g. 3 days for a fresh `inquiry`, 30 for
`permits`, which can legitimately sit quiet waiting on a public body). A
"Needs attention" badge shows on the project card in the list when a
project exceeds its stage's threshold. Computed server-side rather than
purely client-side so the same logic can be reused by other features
(e.g. the general AI assistant) without duplicating it.

## Stage E — General AI assistant with a graceful fallback (done)

A floating "Ask the assistant" chat widget, available on every page, that
answers free-form questions about the firm's real project and client data
("which projects are stuck?", "how many projects are in the permits
stage?", or a lookup by client/project name).

- **Backend** (`services/assistantService.ts`): builds a plain-text context
  of every project (title, client, stage, days since last contact, needs
  attention) from the same data `Stage D` computes, and sends it to the
  `claude` CLI (`services/claudeCli.ts` - the low-level runner shared with
  the Stage 3 summarizer) alongside the question.
- **Graceful degradation, not an error**: if the CLI is unavailable (not
  installed/authenticated - e.g. this exact deployment on Vercel, which has
  no local CLI at all), `askAssistant` catches that and falls back to
  `answerFromKeywords` - a small keyword matcher over the same real data
  (stuck-project questions, counts, name lookups). The response always
  includes a `source: "ai" | "demo"` field; the widget shows a small "demo
  mode" badge on `demo` answers instead of failing the request.
- The interaction summarizer (Stage 3) takes the opposite approach on
  purpose: an "AI Edit" is an explicit action the user chose, so instead of
  silently substituting a worse answer, a CLI failure there surfaces a
  clear "AI service is currently unavailable" message and leaves
  "Save as written" as the obvious next step.

## Deployment (Vercel + MongoDB Atlas)

The app deploys as a single Vercel project: the React build is served as
static output, and the Express API runs as a Vercel serverless function
(`server/api/index.ts`, wired up via the root `vercel.json`). The database
is a MongoDB Atlas cluster - Vercel's functions have no fixed IP and no
local disk, so a local `mongod` isn't an option there.

Setup:

```
vercel link
vercel env add MONGODB_URI production   # mongodb+srv://<user>:<password>@<cluster>/<db-name>
vercel env add MONGODB_URI preview
vercel --prod
```

Since Vercel's serverless environment doesn't have the `claude` CLI
installed, the deployed instance always answers assistant questions via the
Stage E keyword fallback and always shows the "AI service is currently
unavailable" message on "AI Edit" - by design, not a bug. Running the
`claude` CLI-backed features live requires the local dev setup from Stage 1.
