# Current Feature

Backend in Docker — Foundation & Health Endpoint — `context/features/01-backend-in-docker.md`

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements, copied from the spec being implemented -->

Get the Express + TypeScript backend running **inside a container** with hot
reload, plus its test harness and a working `GET /api/health`.

### Application

- Scaffold `backend/` with Node, Express and TypeScript: `tsconfig.json`, ESLint, and the `dev`, `build`, `start`, `lint`, `format`, `format:check` and `test` scripts
- Keep creating the Express app separate from calling `listen` (`src/app.ts` exports the app, `src/server.ts` starts it) so Supertest can import the app without binding a port
- Add `GET /api/health` returning `200` with a small JSON body such as `{ "status": "ok", "uptime": <seconds> }`
- Add a JSON body parser and one error-handling middleware returning a safe error shape, so later routes don't each invent one
- Read `PORT` from the environment — no hardcoded port

### Container

- Add `backend/Dockerfile` with two named stages: a `dev` target running the TypeScript watcher, and a `prod` target that compiles and runs the built output
- Base both stages on the pinned Node version from feature 00 — never `latest`
- Add `backend/.dockerignore` excluding `node_modules`, `dist`, `.env`, `coverage` and git metadata
- Add a root `docker-compose.yml` with one `backend` service: builds the `dev` target, reads the root `.env`, maps `BACKEND_PORT`, bind-mounts the source for hot reload, and keeps `node_modules` out of the bind mount with an anonymous volume
- `docker compose up` must pick up a source edit without a rebuild

### Tests

- Set up Jest + Supertest for TypeScript, with one test asserting `GET /api/health` returns `200` and the expected shape
- Tests run inside the container: `docker compose exec backend npm test`, documented in `README.md`

### Acceptance Criteria

- `docker compose up` starts the backend and `curl http://localhost:${BACKEND_PORT}/api/health` returns `200` from the host
- Editing a route file and saving it restarts the server inside the container with no `docker compose build`
- `docker compose exec backend npm test` passes without MongoDB
- `docker compose exec backend npm run build`, `... npm run lint` and `... npm run format:check` all pass
- `docker compose build --target prod backend` succeeds; the image has no `.env` and no source files — only compiled output and production dependencies
- Running the container without `PORT` set still starts, using the default

## Notes

<!-- Any extra notes: deviations from the design, assumptions, open items -->

- TypeScript is pinned `~6.0.3`, not the latest 7.x: typescript-eslint supports `<6.1`, ts-jest `<7`
- The Node version now appears twice: `.nvmrc` (source of truth, used by CI in 04) and `ARG NODE_VERSION` in `backend/Dockerfile`, because `FROM` cannot read a file. The README line calling `.nvmrc` "the only place it appears" is no longer true. Open item: spec 04's CI could check the two agree
- File-change events from the Windows host do not reach the container through the bind mount; `CHOKIDAR_USEPOLLING=true` on the Compose service makes the tsx watcher poll (~3% CPU)
- The root `.prettierrc` is bind-mounted read-only at `/.prettierrc` so Prettier inside the container finds it by walking up from `/app`; `backend/.prettierignore` exists because Prettier only reads the ignore file in its working directory
- ts-jest warns (TS151002) that `module: nodenext` is only supported with `isolatedModules: true`; `module: commonjs` was rejected because TypeScript 6 pairs it with Bundler resolution. With `isolatedModules: true` ts-jest only transpiles, so `lint` runs `tsc --noEmit` first to type-check tests as well as source. `build` uses `tsconfig.build.json`, which excludes `*.test.ts` from `dist/`
- `docker compose build --target prod backend` (acceptance criterion) does not exist — Compose v5.5 has no `--target` flag. Verified with `docker build --target prod ./backend` instead. Spec 03 uses the same wording, and spec 04's "compose build for both targets" needs a real mechanism

## History

<!-- Keep this updated. Earliest to latest. One line per merged feature. -->

- 00 Repository & Tooling Setup — monorepo skeleton, `.env.example`, Prettier/EditorConfig, Node pinned in `.nvmrc`; merged `ce6823c` (PR #1), not deployed (no deploy path before 06)
