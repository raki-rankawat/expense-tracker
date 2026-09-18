# Feature: Application Acceptance

## Status

Not Started

## Goal

The full-system gate. Nothing new is built — the application, its containers and
its pipeline are checked end to end, locally and in production, and the project is
declared complete.

## Requirements

- Work through the functional checklist and record a pass or fail for each item, **in production as well as locally**:
  - **Add** — expense created; amount, category and date validated; description optional; backend validates; persisted; `201 Created`
  - **View** — saved expenses displayed; loading, empty and error states work; fields displayed correctly
  - **Delete** — correct record removed; `204 No Content`; UI updates; missing and invalid ids handled
  - **Health** — `GET /api/health` reflects process and database state in both environments
- Compare the implementation against `Expense Tracker.dc.html`: layout, spacing, typography, buttons and form controls, list presentation, responsive behaviour and interaction states the design represents. Fix differences now
- Technical check in both containers: TypeScript build, ESLint, Prettier, tests
- Container check: `docker compose up --build` from a clean state works; `docker compose down -v` then `up` gives an empty app; both production images run together without the `dev` targets
- Pipeline check: CI is green on `main`; the latest images carry the latest SHA; production is running that SHA
- Resilience check: stop the database and confirm the UI error state, the health endpoint and the logs all behave — locally and, where possible, in production
- Rollback check: the procedure from feature 07 still matches reality after four features of change
- Confirm the scope list in @CLAUDE.md still holds — nothing unapproved was added along the way
- Confirm `.env.example` lists every variable the app actually reads, and that Render's configuration matches
- Bring `README.md` fully up to date via `/update-readme`
- Update @context/current-feature.md to record that the project is complete, and that future work enters through `_TEMPLATE-feature.md` or `_TEMPLATE-bug.md`

## Acceptance Criteria

- Every item above is reported with an explicit pass or fail — no item silently skipped
- Any failure is either fixed in this cycle or written down in @context/current-feature.md as a known open item with a reason
- Both containers build, lint, format-check and test clean
- The app runs from a single `docker compose up` locally and is live on Render
- The rollback steps were re-read against the current setup and corrected if stale

## Depends On

- Features 08, 09 and 10 (the whole application)

## Design Reference

See the Design Reference in @context/features/03-frontend-in-docker.md. This is
the last full pass over the design.

## Notes

This gate is a checkpoint, not a phase: the app has been deployed since feature 06
and shipping has happened three times already. What is being accepted here is the
whole system — application, containers, pipeline and production — as one thing.

No new functionality. If something is missing, it is a fix within the existing
scope, not a new feature.
