# Feature: GitHub Actions CI

## Status

Not Started

## Goal

Every push and pull request runs the checks, so that from the very first feature
onward the cycle can end in a pipeline run rather than a local "looks fine".

## Requirements

- Add `.github/workflows/ci.yml` triggered on push to `main` and on pull requests
- Run two application jobs, backend and frontend, so a failure names which app broke. Each job: check out, set up the pinned Node version from feature 00, `npm ci`, lint, format check, test, build
- Add a third job validating the containers: `docker compose build` for both `dev` and `prod` targets, so a Dockerfile break is caught by CI and not at deploy time
- Provide whatever MongoDB the backend tests need, consistent with the decision made in feature 02 — an in-memory server, or a service container
- Cache npm downloads and use Docker layer caching in the compose-build job; record the before and after run times
- No secrets are required at this stage; nothing in the workflow may reference a real database or a deployment target
- Add the CI status badge to `README.md`

## Acceptance Criteria

- A pull request shows all three jobs running and passing
- Three deliberate breakages each fail the pipeline, verified one at a time on a throwaway branch and then reverted: a lint violation, a failing test, and a TypeScript error
- A deliberately broken Dockerfile fails the container job while the application jobs still pass — showing why that job exists separately
- The failing job's log makes it obvious which check failed and why
- `npm ci` is used rather than `npm install`, so the lockfile is authoritative
- CI is green on `main` after the merge

## Depends On

- Feature 03 (both apps exist, with tests and builds worth running)

## Notes

CI arrives before any product feature because of how the cycle is defined: a
feature is not done until the pipeline has passed on it. It cannot pass on
feature 08 if it does not exist until feature 11.

Deliberately breaking the pipeline four times is the acceptance criterion that
teaches the most. A pipeline that has only ever been green proves nothing about
whether it is checking anything.

Publishing images is not part of this feature — that is feature 05, kept separate
so the difference between "the code is valid" and "the image is shippable" stays
visible.
