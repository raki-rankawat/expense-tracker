# Current Feature

Backend in Docker — Foundation & Health Endpoint — `context/features/01-backend-in-docker.md`

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements, copied from the spec being implemented -->

## Notes

<!-- Any extra notes: deviations from the design, assumptions, open items -->

## History

<!-- Keep this updated. Earliest to latest. One line per merged feature. -->

- 00 Repository & Tooling Setup — monorepo skeleton, `.env.example`, Prettier/EditorConfig, Node pinned in `.nvmrc`; merged `ce6823c` (PR #1), not deployed (no deploy path before 06)
- 01 Backend in Docker — Express 5 + TypeScript API with `GET /api/health` and one error handler, `dev`/`prod` Dockerfile, Compose `backend` service with polling hot reload, Jest + Supertest; merged `8c63009` (PR #2), not deployed (no deploy path before 06)
