# Current Feature

Repository & Tooling Setup — `context/features/00-repo-and-tooling-setup.md`

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

Create the monorepo skeleton and the conventions every later feature depends on,
so the first real feature branch starts from a repository that already has its
formatting, environment handling and version decisions made. No application code,
no containers yet — only the shell and the decisions.

- Initialize the git repository on `main`, if it is not already initialized
- Create the top-level layout: `frontend/`, `backend/`, `context/`, `.github/`, `.gitignore`, `.dockerignore`, `.env.example`, `CLAUDE.md`, `README.md`
- Root `.gitignore` covering `node_modules`, `dist`, `build`, `coverage`, `.env` and OS/editor junk
- Root `.env.example` listing every variable with placeholder values and a comment per variable: `NODE_ENV`, `BACKEND_PORT`, `FRONTEND_PORT`, `MONGO_PORT`, `MONGODB_URI`
- Shared Prettier config (`.prettierrc`, `.prettierignore`) and an `.editorconfig` at the root
- Pin the Node version in one place (`.nvmrc`)
- Short root `README.md`: one-line purpose, placeholder Getting Started, and the rule that `docker compose` is the way the app runs — `npm run dev` on the host is not supported

## Notes

<!-- Any extra notes: deviations from the design, assumptions, open items -->

- `.gitattributes` added (not in the spec): forces LF in the working tree so a Windows checkout matches Prettier and the Linux containers
- `.prettierignore` excludes `.claude/`, `context/` and `plan/`: they are hand-written docs, and four of them failed `prettier --check` on table alignment only
- `prettier --check .` was run in a throwaway `node:24.21.0-alpine` container, not on the host

## History

<!-- Keep this updated. Earliest to latest. One line per merged feature. -->
