# Feature: Repository & Tooling Setup

## Status

Not Started

## Goal

Create the monorepo skeleton and the conventions every later feature depends on,
so the first real feature branch starts from a repository that already has its
formatting, environment handling and version decisions made.

No application code, no containers yet — only the shell and the decisions.

## Requirements

- Initialize the git repository on `main`, if it is not already initialized
- Create the top-level layout from @context/project-overview.md:

  ```text
  expense-tracker/
  ├── frontend/
  ├── backend/
  ├── context/
  ├── .github/
  ├── .gitignore
  ├── .dockerignore
  ├── .env.example
  ├── CLAUDE.md
  └── README.md
  ```

- Add a root `.gitignore` covering `node_modules`, `dist`, `build`, `coverage`, `.env` and OS/editor junk
- Add a root `.env.example` listing every variable the project will use, with placeholder values and a comment per variable. Start with `NODE_ENV`, `BACKEND_PORT`, `FRONTEND_PORT`, `MONGO_PORT`, `MONGODB_URI`. Later specs extend this file rather than creating their own
- Add shared Prettier config (`.prettierrc`, `.prettierignore`) and an `.editorconfig` at the root
- Pin the Node version in one place (`.nvmrc`), because the dev containers, the production images and the CI runner all have to agree on it
- Add a short root `README.md` with the project's one-line purpose and a placeholder Getting Started section. `/update-readme` fills in the rest from feature 01 onward
- Record in `README.md` that this project is developed in containers: `docker compose` is the way the app is run, and `npm run dev` on the host is not a supported path

## Acceptance Criteria

- `git status` is clean on `main` with the skeleton committed
- `.env` is gitignored; `.env.example` is committed and every variable in it has a comment
- `npx prettier --check .` passes on the committed files
- The Node version appears in exactly one place
- Docker and Docker Compose are installed and working on the machine: `docker --version` and `docker compose version` both succeed

## Depends On

- Nothing — this is the foundation feature

## Notes

The root `package.json` from the earlier local-first plan is deliberately absent.
There is no host-level script runner: `docker compose` is the entry point, and each
app keeps its own `package.json` inside its own image.

`.github/` is created empty (or with a `.gitkeep`) so its purpose is visible. It is
filled in by feature 04.
