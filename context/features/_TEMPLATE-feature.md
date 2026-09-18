# Feature: <name>

<!--
Copy this file to context/features/NN-<kebab-name>.md, NN being the next free
number, and fill it in. Delete every comment block as you go, and delete any
section that genuinely does not apply — an empty section is worse than no section.

One spec is one branch and one full cycle: change → production. The layers it
touches vary — backend and frontend, one of them, or neither. What never varies is
the tail: tests or a verification step, CI, a deploy and a production check.

If a spec cannot ship on its own, it is too big — split it.
-->

## Status

Not Started

## Goal

<!-- Two or three sentences: what the user can do after this that they couldn't
before, and why it matters. Not a list of tasks. -->

## Requirements

<!-- Keep only the sections this change actually touches, and say in Notes which
you dropped and why. A change that touches none of the three application sections
is an infrastructure change — use that section alone. -->

### Backend

<!-- Endpoints with their methods and status codes; validation rules; model
changes. -->

### Frontend

<!-- Which API module functions are added; what the UI does; which states must be
handled (loading, empty, error, pending, disabled); what the design dictates. -->

### Infrastructure

<!-- Dockerfile, docker-compose.yml, .env.example, workflow or Render
configuration changes. Name which environments are affected — dev target, prod
target, CI, production — since they differ. If the change is to a `prod` target or
to Render config, say how it is verified before it reaches production, because the
`dev` target passing proves nothing about it. -->

### Tests

<!-- Backend (Jest + Supertest) and frontend (Jest + RTL) cases, written as
behaviours rather than file names. Both run inside the containers.

For an infrastructure change there may be no unit test to write. Then say what is
checked instead, concretely: a container starting healthy, an image built and run,
a variable arriving in the process, a pipeline job passing. "Verified manually" is
not a check — name the command and the expected output. -->

### Ship

- CI green on the pull request: both application jobs and the container-build job
- Merge to `main`; confirm both images are published with this commit's SHA tag
- Confirm Render deploys the new version automatically
- Verify the feature at the production URL, and confirm `GET /api/health` is still healthy afterwards

## Acceptance Criteria

<!-- Checkable statements, not intentions. Each one names how it is verified:
a command, a request, a thing seen in the browser, a record read back out of the
database. Include at least one that is checked in production. -->

## Depends On

<!-- Features by number and what specifically is needed from each. "Nothing" is a
valid answer for an independent change. -->

## Design Reference

<!-- For any UI work:

See the Design Reference in @context/features/03-frontend-in-docker.md.
Read `Expense Tracker.dc.html` for <the specific screen or control> before
building.

If the design has nothing for this feature, say so explicitly and state which
existing visual language it follows instead. -->

## Notes

<!-- Scope boundaries (what this feature deliberately does not do), assumptions,
anything left for a later feature, and any decision that needs recording. -->
