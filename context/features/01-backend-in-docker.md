# Feature: Backend in Docker — Foundation & Health Endpoint

## Status

Not Started

## Goal

Get the Express + TypeScript backend running **inside a container** with hot
reload, plus its test harness and a working `GET /api/health`. This is the first
feature because nothing else can run until the container development loop works.

## Requirements

### Application

- Scaffold `backend/` with Node, Express and TypeScript: `tsconfig.json`, ESLint, and the `dev`, `build`, `start`, `lint`, `format`, `format:check` and `test` scripts
- Keep creating the Express app separate from calling `listen` (`src/app.ts` exports the app, `src/server.ts` starts it) so Supertest can import the app without binding a port
- Add `GET /api/health` returning `200` with a small JSON body such as `{ "status": "ok", "uptime": <seconds> }`
- Add a JSON body parser and one error-handling middleware returning a safe error shape, so later routes don't each invent one
- Read `PORT` from the environment — no hardcoded port

### Container

- Add `backend/Dockerfile` with two named stages: a `dev` target running the TypeScript watcher, and a `prod` target that compiles and runs the built output. Feature 05 uses the `prod` target; development uses `dev`
- Base both stages on the pinned Node version from feature 00 — never `latest`
- Add `backend/.dockerignore` excluding `node_modules`, `dist`, `.env`, `coverage` and git metadata
- Add a root `docker-compose.yml` with one `backend` service for now: builds the `dev` target, reads the root `.env`, maps `BACKEND_PORT`, bind-mounts the source for hot reload, and keeps `node_modules` out of the bind mount with an anonymous volume so the container's install is not shadowed by the host
- `docker compose up` must pick up a source edit without a rebuild

### Tests

- Set up Jest + Supertest for TypeScript, with one test asserting `GET /api/health` returns `200` and the expected shape
- Tests run inside the container: `docker compose exec backend npm test`. Document that command in `README.md` — it is how every later feature runs backend tests

## Acceptance Criteria

- `docker compose up` starts the backend and `curl http://localhost:${BACKEND_PORT}/api/health` returns `200` from the host
- Editing a route file and saving it restarts the server inside the container with no `docker compose build`
- `docker compose exec backend npm test` passes, and does not require MongoDB — nothing connects to a database yet
- `docker compose exec backend npm run build`, `... npm run lint` and `... npm run format:check` all pass
- `docker compose build --target prod backend` succeeds, and the resulting image contains no `.env` and no source files — only the compiled output and production dependencies
- Running the container without `PORT` set still starts, using the default

## Depends On

- Feature 00 (repository skeleton, `.env.example`, pinned Node version)

## Notes

The health endpoint is built first, before any product feature, because it is what
Compose's health check, the production image's `HEALTHCHECK` and Render's health
check all point at. At this stage it reports process health only; feature 02
extends it with database state.

The anonymous volume over `node_modules` is the detail that makes bind-mounted
development work. Without it the host's empty (or platform-wrong) `node_modules`
hides the one installed in the image.

Both Dockerfile stages are written now, but only `dev` is used until feature 05.
