# Feature: Production Images & Container Registry

## Status

Not Started

## Goal

Turn the `prod` stages into real, published artifacts: CI builds both production
images and pushes them to GitHub Container Registry, tagged so that any past
version can be redeployed.

## Requirements

### Production images

- Finish the `prod` target of both Dockerfiles: multi-stage, production dependencies only, no source, no `.env`, running as a non-root user, pinned base images
- Backend `prod`: compiled output, `HEALTHCHECK` hitting `GET /api/health`
- Frontend `prod`: built static output served by a small web server image, with client-side routes resolving correctly and `/api` requests reaching the backend
- **Decide and record** how the production frontend reaches the backend: a reverse-proxy rule in the static server, or a build-time API base URL baked in by Vite. Write the choice and its trade-off into @context/architecture.md
- Record both image sizes against a single-stage build of the same app — the measurable reason the pattern exists

### Pipeline

- Extend CI so that, after the lint/test/build jobs pass, both production images are built
- On a pull request: build only, publish nothing
- On `main`: push to `ghcr.io/<owner>/expense-tracker-backend` and `...-frontend`
- Tag every image with both the commit SHA and `latest`. The SHA tag is what makes rollback possible; `latest` is a convenience
- Authenticate with `GITHUB_TOKEN` and the minimum `packages: write` permission — no personal access token anywhere in the repo
- Use layer caching so repeat builds are not full rebuilds
- Document in `README.md` how to pull and run a published image by SHA tag

## Acceptance Criteria

- A merge to `main` puts two new images in the repository's Packages, each carrying a SHA tag and `latest`
- `docker pull ghcr.io/<owner>/expense-tracker-backend:<sha>` and running it works after `docker image rm` locally
- The two published images run together against a MongoDB and serve the app — verified without the `dev` targets involved
- A pull request builds both images and publishes nothing, verified on a throwaway PR
- No credentials appear in the workflow files or in any image layer, verified with `docker history`
- Both production images run as a non-root user

## Depends On

- Feature 04 (CI must pass before anything is published)

## Notes

Publishing only from `main`, and only after the checks pass, is what makes the
registry trustworthy: every tag in it corresponds to a commit that passed CI.

The SHA tag matters more than it looks. Feature 07's rollback is nothing more than
redeploying an earlier one.

The production routing decision is forced here rather than at deploy time because
Vite bakes its environment in at build time — discovering that after the images are
published means rebuilding them.
