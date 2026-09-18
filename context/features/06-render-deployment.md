# Feature: Render Deployment (CD)

## Status

Not Started

## Goal

Get the empty application shell live on Render, driven by a merge to `main`, so
that every feature from 08 onward can be shipped all the way to production as part
of its own cycle.

## Requirements

- **Ask first:** decide the Render architecture before creating anything — which services exist (backend web service, frontend static site or web service), and whether Render deploys the GHCR images from feature 05 or builds from the repository. Record the decision and its reason in @context/architecture.md
- **Ask first:** decide the production database. The Compose `mongo` service is local development only. Options include MongoDB Atlas or a Render-hosted database; record the choice
- Configure production environment variables in Render — `MONGODB_URI`, `PORT`, and the frontend's API base if the approach from feature 05 needs one. Nothing sensitive in the repository
- Point Render's health check at `GET /api/health`
- Wire continuous deployment so a successful `main` pipeline triggers the deploy, and a failing pipeline does not
- Confirm CORS or proxying works for the real production origins, which differ from the local ones
- Document in `README.md`: the production URLs, what triggers a deploy, the environment variables and where each is set

## Acceptance Criteria

- The shell application is reachable at its Render URL and renders the design's empty layout
- `GET /api/health` returns healthy in production and reports the production database honestly
- A commit merged to `main` reaches production with no manual deploy step
- A commit that fails CI does not reach production, verified on a throwaway branch
- No secret is stored anywhere except Render's environment configuration
- Production data is separate from local data — the local Compose volume and the production database are demonstrably different

## Depends On

- Feature 05 (published, tagged images)

## Notes

Deploying an empty shell feels premature and is the point: the deployment path is
proven while there is nothing to debug but the deployment path itself. Every later
feature then ships through a route that already works.

Runtime architecture and deployment architecture are different things. Render's
shape is expected to differ from `docker-compose.yml`, and the difference belongs
in @context/architecture.md rather than being smoothed over.

Free-tier services may sleep when idle, which shows up as a slow first request
after a quiet period. Check whether that is what is happening before treating it
as a bug.
