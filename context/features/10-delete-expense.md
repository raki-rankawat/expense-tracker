# Feature: Delete Expense

## Status

Not Started

## Goal

The third full cycle: `DELETE /api/expenses/:id`, the delete control in the list,
tests for both, shipped to production. This completes the application's scope.

## Requirements

### Backend

- `DELETE /api/expenses/:id` taking the expense id as a URL parameter
- `204 No Content` on success
- `404 Not Found` when the expense does not exist
- `400` for an id that is not a valid identifier — not a `500`

### Frontend

- Add `deleteExpense(id)` to the API module
- Add the delete control as the design shows it, clearly communicating the action
- Handle the pending state on that item, and show an error if deletion fails
- Remove the item from the list only after the request succeeds
- Do not add a confirmation step unless the design has one or it is explicitly requested

### Tests

- Backend: successful deletion returns `204` and the record is gone; a missing expense returns `404`; an invalid id is handled
- Frontend: delete is triggered for the correct expense, success removes the item, failure is handled and the item stays, pending/disabled behaviour where applicable

### Ship

- CI green on the pull request, merge to `main`, images published with the new SHA
- Render deploys automatically; verify delete works in production

## Acceptance Criteria

- Deleting from the UI removes the expense from both the list and MongoDB
- Deleting the last expense leaves the empty state from feature 08, not a broken list
- `curl -X DELETE` against a non-existent id returns `404`, and a malformed id returns `400`
- Tests, lint, format check and build pass in both containers
- CI passed and the feature is verified at the production URL

## Depends On

- Feature 08 (the list the control lives in)
- Feature 09 (expenses to delete, created through the UI)

## Design Reference

See the Design Reference in @context/features/03-frontend-in-docker.md. Read
`Expense Tracker.dc.html` for the delete control and its states before building.

## Notes

The third run of the same cycle and the smallest of the three — by now the API
module, the list, its states, both test harnesses and the whole pipeline exist, so
the slice is one endpoint, one control and its tests. That shrinking is the
evidence the setup features paid off.

Removing the item only after a successful response is deliberate: an optimistic
removal that has to be undone on failure is more UI state than this project needs.
