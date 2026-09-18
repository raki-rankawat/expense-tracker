# Feature: MongoDB Service & Expense Model

## Status

Not Started

## Goal

Add MongoDB as a container service on the Compose network and define the
`Expense` model, so the backend talks to a database by service name and the
feature slices only have to add routes.

## Requirements

### Container

- Add a `mongo` service to `docker-compose.yml` on a pinned MongoDB image version
- Add a named volume for the data directory, so expenses survive `docker compose down` and are lost only on `down -v`
- Do not publish MongoDB's port to the host by default. If it is published for inspection with a GUI, make that explicit and note why
- Add a health check to the `mongo` service, and make `backend` wait for it to be healthy via `depends_on: condition: service_healthy`
- Set restart policies appropriate to local development

### Application

- Connect with Mongoose using `MONGODB_URI` from the environment, pointing at the **service name** (`mongodb://mongo:27017/expense_tracker`), not `localhost`
- Fail loudly and clearly on a connection error at startup — a readable message, not a stack trace dump
- Define the `Expense` schema per @context/architecture.md:
  - `amount` — integer, required, greater than zero, stored as minor units (€25.50 → 2550)
  - `category` — required, restricted to the approved category list
  - `description` — optional, short text
  - `date` — required
- Serialize to JSON as `id`, hiding `_id` and `__v`
- Export the approved category list from one place on the backend so routes and validation share it
- Extend `GET /api/health` to report database connection state alongside process state

### Tests

- **Ask first:** how should tests reach MongoDB — a dedicated test database on the `mongo` service, or an in-memory server such as `mongodb-memory-server` (an extra dependency)? Whichever is chosen must work both inside the container and on a CI runner, since feature 04 runs the same tests there
- Add model tests: a valid expense saves; zero, negative and non-integer amounts are rejected; a missing category and an unknown category are rejected; a missing date is rejected

## Acceptance Criteria

- `docker compose up` brings up `mongo` and `backend`, and the backend logs a successful connection
- `docker compose logs backend` shows the backend waiting for, not crashing against, a not-yet-ready MongoDB
- `GET /api/health` reports unhealthy while `docker compose stop mongo` is in effect, and healthy again after `docker compose start mongo`
- `docker compose exec backend npm test` passes, including the model tests
- Data survives `docker compose down` followed by `docker compose up`, and is gone after `docker compose down -v`
- `MONGODB_URI` pointing at `localhost` fails, confirming the app is genuinely using container networking
- No speculative schema fields exist beyond the five in the spec

## Depends On

- Feature 01 (backend container, health endpoint, test harness)

## Notes

The backend reaching Mongo at `mongo:27017` rather than `localhost:27017` is the
container-networking lesson, and having it from the second feature onward means no
later migration from a host database.

A health check that returns `200` while the database is unreachable makes Render's
rollback behaviour useless later, which is why database state goes into the health
response now rather than in feature 07.

Money is never stored as a float. The integer constraint here is what makes the
backend authoritative; the text-to-minor-units conversion is the frontend's job in
feature 09.
