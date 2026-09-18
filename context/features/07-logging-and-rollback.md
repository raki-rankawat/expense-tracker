# Feature: Logging & Rollback Drill

## Status

Not Started

## Goal

Complete the pipeline before feature work begins: know when production is
unhealthy, be able to find out why from the logs, and have actually rolled back
once.

## Requirements

- Add structured request logging to the backend: method, path, status and duration, one line per request, to stdout. No secrets, no full request bodies
- Make log level configurable by environment variable so production and local differ
- Confirm logs are readable in all three places: `docker compose logs -f`, `docker logs` on a production image run locally, and Render's log view
- Review every health check — the backend image's `HEALTHCHECK`, the Compose checks, Render's — and confirm each fails when the app is genuinely broken, not only when the process has exited
- Document the rollback procedure in `README.md`: redeploy a previous image SHA tag from feature 05, with exact steps and where to find the tag
- **Perform one real rollback:** deploy a deliberately broken commit, observe the health check or the logs reporting it, roll back to the previous SHA, confirm recovery, and record how long it took
- Record in `README.md` what to check first when production misbehaves: health endpoint, then logs, then environment variables, then database connectivity

## Acceptance Criteria

- Stopping the database makes the health check report unhealthy both in Compose and on Render — not a healthy service serving errors
- A request to the deployed application appears in its logs with status and duration
- The rollback was actually carried out, not just documented, and the elapsed time is written down
- The rollback steps in `README.md` are precise enough to follow under pressure without rereading this spec
- No sensitive value appears in any log line

## Depends On

- Feature 06 (a live deployment to observe and roll back)

## Notes

This is the last setup feature. After it merges, the full path exists: containers,
CI, registry, deployment, health, logs and a practised rollback. Features 08
onward are ordinary cycles through that path.

The deliberately broken deploy is the whole point. A rollback procedure that has
never been executed is a paragraph, not a capability. Doing it now, while the app
is an empty shell, means the first real rollback is not the first attempt.
