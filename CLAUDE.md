# Expense Tracker — Claude Code Instructions

## Project Purpose

Expense Tracker is a deliberately small MERN-style application used to learn the
complete software development lifecycle, with the main learning focus on:

- Docker
- Docker Compose
- CI/CD
- GitHub Actions
- Container images
- Container registry
- Render deployment
- Health checks
- Logging
- Deployment and rollback concepts

Keep application development intentionally simple. Do not add features just to
make the application larger.

**The project runs in Docker from the first feature.** There is no host-level
development path: the app runs with `docker compose up`, and tests, lint, format
and build run with `docker compose exec`. Containerization is the environment, not
a later phase.

**Every change ships.** The unit of work is the full cycle:

> **Full cycle:** taking one feature or bug from specification through
> implementation, testing, containerized verification, CI, image publishing,
> deployment and verification in production. Change → production.

Which layers a change touches varies — backend and frontend, one of them, or
neither. A Dockerfile, Compose or workflow change with no application code is
still a full cycle.

That path is what this project is for. It is run repeatedly — once per change —
rather than batched by layer.

---

## Source of Truth

Use the project documentation in this order:

1. `CLAUDE.md` — global Claude Code rules
2. `context/project-overview.md` — project context
3. `context/architecture.md` — architecture decisions
4. `context/ai-interaction.md` — how every feature is worked: the cycle, branching, commits
5. `context/coding-standards.md` — coding conventions
6. `context/current-feature.md` — currently active work and history
7. Relevant file in `context/features/` — the spec being implemented

New work enters through `context/features/_TEMPLATE-feature.md` or
`_TEMPLATE-bug.md` via `/new-spec`.

If two documents conflict, stop and report the conflict instead of silently choosing an interpretation.

---

## Feature Specifications

Every change lives in `context/features/`, numbered in the order it is worked:

**Platform Bootstrap (00-07) — building the machine that runs the cycle**

- `00-repo-and-tooling-setup.md`
- `01-backend-in-docker.md`
- `02-mongodb-service-and-model.md`
- `03-frontend-in-docker.md`
- `04-github-actions-ci.md`
- `05-production-images-and-registry.md`
- `06-render-deployment.md`
- `07-logging-and-rollback.md`

**Full-Cycle Features (08+) — one complete cycle each**

- `08-view-expenses.md`
- `09-add-expense.md`
- `10-delete-expense.md`
- `11-application-acceptance.md`

**Templates — for whatever arrives next**

- `_TEMPLATE-feature.md`
- `_TEMPLATE-bug.md`

A new feature or bug gets a numbered spec from the matching template via
`/new-spec` before any code is written. Everything added after 11 is a
full-cycle feature or fix — the bootstrap happens once.

The two groups differ in how much of the cycle exists to run. During the
bootstrap the cycle is still being built, so early specs reach only part of it;
`context/ai-interaction.md` has the table of exactly how far each one reaches.
From 08 onward every spec runs all of it.

Read `context/ai-interaction.md` before starting any spec.

Do not implement anything that is not explicitly required by the relevant
specification.

---

## Claude Design — UI Source of Truth

The approved frontend design is maintained in the Claude Design project.

### Claude Design MCP

MCP endpoint:

`https://api.anthropic.com/v1/design/mcp`

Authentication:

`/design-login`

### Design Project

`https://claude.ai/design/p/b9c35a63-4da3-4e92-9f81-4d5be8aea178?file=Expense+Tracker.dc.html`

### Primary Design File

`Expense Tracker.dc.html`

### Imported Selection Files

When relevant, also inspect:

- `ios-frame.jsx`
- `support.js`

### Required UI Workflow

Before implementing or significantly changing frontend UI:

```text
Feature specification
        ↓
Claude Design project
        ↓
Expense Tracker.dc.html
        ↓
Approved visual design
        ↓
React + TypeScript + Tailwind implementation
```

Treat `Expense Tracker.dc.html` as the visual source of truth.

Use it to determine:

- layout
- spacing
- typography
- colors
- sizing
- buttons
- form controls
- cards/lists
- visual hierarchy
- responsive behavior represented by the design
- important UI states represented by the design

Do not create a separate visual design when an approved design already exists.

If the design does not specify a required functional state, implement the minimum reasonable UI needed by the feature specification and preserve the existing design language.

---

## Development Order

Work `context/features/` in order, one spec per branch, with
`/implement-feature`. Each spec is one full cycle:

```text
Document
    ↓
Branch
    ↓
Stack up (docker compose)
    ↓
Backend
    ↓
Frontend
    ↓
Tests
    ↓
Verify locally (in the containers)
    ↓
Commit
    ↓
CI (GitHub Actions)
    ↓
Merge
    ↓
Images published to GHCR
    ↓
Render deploys
    ↓
Verify in production
    ↓
Close out
```

**Platform Bootstrap (00-07)** builds that path itself — containers, CI,
registry, deployment, logging and a practised rollback — and ends with the empty
app shell live on Render. These are still real cycles (spec, branch, implement,
verify, commit, merge), but they cannot run stages that do not exist yet: spec 00
has no CI to pass because CI is spec 04. That is not an exception to the rule,
it is the machine being assembled.

**Full-Cycle Features (08+)** run every stage. Specs 08-10 are the application
features; spec 11 accepts the finished system; anything added later joins this
group.

Do not split an application feature across branches by layer. Within one branch:
backend, then frontend, then tests, then ship the whole thing.

A spec's **Depends On** section, not its number, is what gates it. Do not start a
spec whose dependencies are not merged.

---

## Application Scope

The application currently supports only:

1. Add an expense
2. View expenses
3. Delete an expense
4. `GET /api/health`

Do not add:

- authentication
- user accounts
- budgets
- reports
- charts
- search
- pagination
- filtering
- recurring expenses
- notifications
- file uploads
- multi-currency support
- category CRUD

unless the user explicitly changes the project scope.

---

## Architecture

Runtime flow:

```text
Browser
   ↓
React + TypeScript + Vite
   ↓ HTTP / REST
Node.js + Express + TypeScript
   ↓
Mongoose
   ↓
MongoDB
```

Local development, from feature 03 onward, is three containers on one Compose
network:

```text
host:FRONTEND_PORT → [ frontend ]  Vite dev server, /api proxied to backend
                          ↓
host:BACKEND_PORT  → [ backend  ]  Express, MONGODB_URI=mongodb://mongo:27017/...
                          ↓
                     [ mongo    ]  named volume for data
```

Production on Render differs from this, deliberately. The difference is recorded
in `context/architecture.md`, decided in features 05 and 06.

### Frontend

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- native `fetch`

Use React state/hooks for application state initially.

Do not introduce Redux or another state-management library unless complexity genuinely requires it and the user approves it.

### Backend

Use:

- Node.js
- Express
- TypeScript
- Mongoose
- MongoDB

Keep backend architecture simple and understandable.

Do not create abstraction layers only for the sake of following a pattern.

---

## API

### Create

`POST /api/expenses`

### List

`GET /api/expenses`

### Delete

`DELETE /api/expenses/:id`

### Health

`GET /api/health`

The health endpoint exists primarily for infrastructure and deployment health checks.

---

## Data Rules

Expense fields:

```text
id
amount
category
description
date
```

Money must be stored as integer minor units.

Example:

```text
€25.50 → 2550
```

Do not store monetary amounts as floating-point values.

Frontend validation improves user experience.

Backend validation is authoritative.

---

## Testing

Use:

### Frontend

- Jest
- React Testing Library

### Backend

- Jest
- Supertest

Tests should focus on meaningful application behaviour rather than implementation
details.

Tests are written inside the feature that introduces the behaviour — there is no
separate testing phase — and they run inside the containers:

```bash
docker compose exec backend npm test
docker compose exec frontend npm test
```

Before declaring a cycle complete:

- run the tests in both containers
- run TypeScript/build checks
- run ESLint
- verify formatting
- rebuild the images if a Dockerfile or `docker-compose.yml` changed
- confirm CI passed on the pull request
- verify the change in production

Actually run these. Do not reason about whether they would pass.

---

## Docker

Docker is the development environment, established in features 01-03.

Both apps have a Dockerfile with two named stages:

- **`dev`** — the TypeScript watcher and the Vite dev server, with the source bind-mounted for hot reload and an anonymous volume keeping the container's `node_modules` from being shadowed by the host's
- **`prod`** — compiled output only: production dependencies, no source, no `.env`, a non-root user, pinned base images, and a `HEALTHCHECK` on the backend

`docker-compose.yml` runs three services — `frontend`, `backend`, `mongo` —
on one network, with a named volume for the database and health checks gating
startup order.

Rules:

- The backend addresses MongoDB by service name, never `localhost`
- Configuration comes from the root `.env`; nothing is baked into an image
- No `latest` base images — pin versions so CI, local and production agree
- MongoDB in Compose is local development only. It is not the production database

The Vite proxy exists only in the `dev` target. How `/api` reaches the backend in
production is decided in feature 05 and recorded in `context/architecture.md`.

---

## CI/CD

CI and CD are built in features 04-06, before any application feature, because
every feature cycle ends by passing through them.

```text
Git push
   ↓
GitHub Actions
   ↓
Install dependencies (npm ci)
   ↓
Lint
   ↓
Test
   ↓
Build
   ↓
docker compose build (dev and prod targets)
   ↓
Production images built
   ↓
GitHub Container Registry (main only)
   ↓
Render deploys
```

Use GitHub Actions. Use GitHub Container Registry for image publishing.

Rules:

- Pull requests build; only `main` publishes
- Every image is tagged with its commit SHA as well as `latest` — the SHA tag is what a rollback redeploys
- Authenticate with `GITHUB_TOKEN` and the minimum permissions; no personal access tokens in the repo
- Never merge on a red pipeline, and never fix CI by disabling the check that caught the problem

---

## Deployment

Production target:

**Render**

Deployment is set up in feature 06, with the empty application shell, so that
every later feature ships through a path that already works.

- A successful `main` pipeline triggers the deploy; a failing one does not
- Render's health check points at `GET /api/health`, which reports database state as well as process state
- Secrets live only in Render's environment configuration
- Do not assume a VPS or a manually managed Nginx server
- The production database is a separate decision from the local Compose `mongo` service, made in feature 06 and recorded in `context/architecture.md`

Runtime architecture and deployment architecture are different concepts. Render's
shape is expected to differ from `docker-compose.yml`; that difference is written
down rather than smoothed over.

Rollback is redeploying a previous image SHA tag. The procedure is documented — and
practised once, deliberately — in feature 07.

---

## Coding Rules

Prefer:

- simple code
- clear names
- small functions
- explicit behavior
- readable TypeScript
- minimal dependencies
- maintainable components
- straightforward error handling

Avoid:

- premature abstraction
- unnecessary design patterns
- unnecessary libraries
- duplicated business logic
- unrelated refactoring
- speculative features
- over-engineering

---

## Change Discipline

When implementing a task:

1. Read the relevant specification.
2. Inspect the existing implementation.
3. Inspect the Claude Design project when UI is involved.
4. Make the smallest complete change.
5. Do not modify unrelated files.
6. Run relevant checks in the containers.
7. Confirm CI passed before merging.
8. Confirm the change is live and verified in production before closing the cycle.
9. Report what changed.
10. Report tests/checks performed, including the CI result and the deployed SHA.
11. Report any assumptions or unresolved questions.

If requirements are unclear, ask rather than inventing product behavior.

---

## Important Learning Rule

This project is not only about producing a working Expense Tracker.

The developer should understand the lifecycle — and run it repeatedly, once per
feature, rather than once for the project:

```text
Design
  ↓
Code
  ↓
Test
  ↓
Package
  ↓
Containerize
  ↓
Automate
  ↓
Publish
  ↓
Deploy
  ↓
Monitor
  ↓
Update
```

Keep each step visible and inspectable rather than hiding the process behind a
single script — the developer reads the code and the configuration themselves.

Do not write code walkthroughs, tutorials or "what this teaches you" sections
unless explicitly asked. Report what changed, what was checked, and any
non-obvious decision. That is all.
