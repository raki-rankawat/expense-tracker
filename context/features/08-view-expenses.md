# Feature: View Expenses

## Status

Not Started

## Goal

The first full cycle: one branch that adds `GET /api/expenses`, the expense list
UI and the tests for both, then goes through CI, the registry and Render to a
verified production deploy.

## Requirements

### Backend

- `GET /api/expenses` returns the saved expenses as an array of `{ id, amount, category, description?, date }`
- An empty collection returns `200` with `[]`, not a `404`
- If the spec and the design do not decide the order, sort by date with the newest first and record that as an assumption
- A database failure returns `500` with a safe message, not a leaked stack trace

### Frontend

- Add `getExpenses()` to the API module from feature 03
- Render the list as the design shows it: amount (formatted from minor units), category, description when present, and date
- Handle all four states: loading, populated list, empty list, API error
- Follow the design where it represents these states; where it does not, implement the minimum UI in the same visual language and record the deviation

### Tests

- Backend (Jest + Supertest, inside the container): successful `GET`, the returned data shape, empty-collection behaviour, database-error handling where practical
- Frontend (Jest + RTL, `fetch` mocked, inside the container): loading, successful rendering, empty state, error state, and that expense fields display correctly

### Ship

- CI green on the pull request: both application jobs and the container-build job
- Merge to `main`, confirm both images are published with the new commit's SHA tag
- Confirm Render deploys the new version automatically
- Verify the feature in production, not only locally, and confirm `GET /api/health` is still healthy afterwards

## Acceptance Criteria

- With records inserted into the Compose `mongo` service, the app displays them locally
- All four UI states can be produced and each is visibly handled — none silently renders nothing
- `docker compose exec backend npm test` and `docker compose exec frontend npm test` both pass
- Lint, format check and build pass in both containers
- CI passed on the pull request, and no unrelated job was skipped
- The feature is verified working at the production URL, against the production database
- No search, filters, pagination, sorting controls or charts have been added

## Depends On

- Feature 02 (Expense model and database service)
- Feature 03 (app shell, API module, money formatter, test harness)
- Feature 07 (the pipeline must be complete and proven before a feature ships through it)

## Design Reference

See the Design Reference in @context/features/03-frontend-in-docker.md — same
project, same file, same rules. Read `Expense Tracker.dc.html` for the list
presentation and its states before building.

## Notes

View comes before Add so the first full cycle is read-only: one endpoint, one
screen, no validation, no mutation. The cycle itself is the new thing here, not
the code.

Seeding a couple of records by hand (`docker compose exec mongo mongosh`) is
expected for this feature and thrown away once feature 09 lands.

The delete control belongs to feature 10 — the list renders without it here.
