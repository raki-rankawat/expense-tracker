# Feature: Add Expense

## Status

Not Started

## Goal

The second full cycle: `POST /api/expenses` with authoritative validation, the
expense form with its frontend validation and minor-unit conversion, tests for
both sides, shipped to production.

## Requirements

### Backend

- `POST /api/expenses` accepting `{ amount, category, description?, date }`
- Backend validation is authoritative and repeats every rule: amount present, integer, greater than zero; category present and in the approved list; date present and valid; description optional and short
- `201 Created` with the created expense including its generated `id`
- `400` with a useful message for invalid input — no stack traces, no internal details

### Frontend

- Add `createExpense()` to the API module
- Build the form as the design shows it: amount, category, optional description, date, clear labels, submit button
- Frontend validation for user experience: required fields, amount valid and greater than zero, category selected, date valid
- Convert the typed amount to integer minor units by parsing the text — not with floating-point arithmetic
- Handle the submitting state, server error feedback, and the success path: add the created expense to the list and reset the form
- Follow the design for validation feedback and submission states; record any state the design does not cover as a deviation

### Tests

- Backend: valid creation returns `201` and persists; invalid input returns `400`, with a case per validation rule
- Frontend: required-field validation, amount validation, category selection, successful submission, server-error handling, submitting/disabled behaviour

### Ship

- CI green on the pull request, merge to `main`, images published with the new SHA
- Render deploys automatically; verify add works in production
- Confirm the production database holds the new record with an integer amount

## Acceptance Criteria

- A valid expense entered in the UI is stored in MongoDB and appears in the list without a manual refresh
- €25.50 typed into the form is stored as `2550`, verified by reading the record back out of the database — locally and in production
- Invalid input is rejected by the frontend, and still rejected by the backend when the frontend is bypassed: `curl` directly at the container's mapped port
- Tests, lint, format check and build pass in both containers
- CI passed and the deployed version is the one carrying this feature's commit SHA
- Records seeded by hand during feature 08 can be deleted and the list rebuilt entirely through the UI

## Depends On

- Feature 08 (the list this feature writes into, and `getExpenses`)

## Design Reference

See the Design Reference in @context/features/03-frontend-in-docker.md. Read
`Expense Tracker.dc.html` for the form layout, controls and validation feedback
before building.

## Notes

Verifying the stored value is an integer is the acceptance criterion that matters
most here — it is the one data rule in @CLAUDE.md that is easy to satisfy in the UI
and get wrong in the database.

Bypassing the frontend with `curl` is what makes "backend validation is
authoritative" a tested claim rather than a sentence in a document.
