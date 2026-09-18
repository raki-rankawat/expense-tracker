# Expense Tracker — Coding Standards

## General Principles

Prefer code that is:

- simple
- readable
- explicit
- maintainable
- easy to test
- easy for a learner to understand

Do not optimize for abstraction or cleverness.

## TypeScript

- Prefer explicit types at important boundaries.
- Avoid `any` unless there is a documented reason.
- Use interfaces/types that clearly describe API data.
- Keep data models consistent between frontend and backend where practical.
- Validate external input rather than trusting TypeScript types at runtime.

## React

- Use functional components.
- Use React hooks where appropriate.
- Keep components focused.
- Keep state local unless it genuinely needs to be shared.
- Prefer React state/hooks before introducing a state-management library.
- Do not introduce Redux for this project unless complexity requires it.

## UI

- Use Tailwind CSS.
- Follow the Claude Design project.
- Do not redesign approved screens without an explicit requirement.
- Keep reusable components only where reuse is real and useful.
- Avoid building a large component library for this small project.

## Backend

- Keep routes, validation, and application logic understandable.
- Use appropriate HTTP methods and status codes.
- Validate request data on the backend.
- Do not trust frontend validation.
- Return useful error responses without exposing sensitive internals.

## Database

- Use Mongoose for MongoDB access.
- Store monetary values as integer minor units.
- Keep the schema aligned with the approved application scope.
- Do not add speculative fields.

## Error Handling

Handle expected errors explicitly.

Examples:

- invalid request → client error
- missing expense → `404 Not Found`
- successful creation → `201 Created`
- successful deletion → `204 No Content`
- server/database failure → appropriate server error

Do not silently swallow errors.

## Testing

Test observable behavior.

Prefer tests that answer:

> Does the application do what the user or API consumer expects?

Avoid tests that depend heavily on internal implementation details.

## Formatting and Linting

Use:

- ESLint
- Prettier

Do not disable lint rules globally just to make code pass.

## Dependencies

Before adding a dependency, ask:

1. Is it required?
2. Is it substantially simpler than using existing platform/project capabilities?
3. Does it introduce unnecessary complexity?

For a small learning project, fewer dependencies are preferred.
