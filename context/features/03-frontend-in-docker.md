# Feature: Frontend in Docker — App Shell

## Status

Not Started

## Goal

Get the React + TypeScript + Vite frontend running inside a container with hot
reload, wired to the backend over the Compose network, with Tailwind carrying the
design's visual language and the empty app shell built. After this, one
`docker compose up` runs the whole system.

## Requirements

### Application

- Scaffold `frontend/` with the Vite React + TypeScript template using npm; keep the template's ESLint and add Prettier with `format` / `format:check`
- Add Tailwind CSS and move the design's colours, fonts, radii and spacing into the Tailwind theme rather than repeating literal values in components
- Build the empty page layout from the design — header, containers, sections — with no data, no form and no list
- Configure the Vite dev server to proxy `/api` to `http://backend:${BACKEND_PORT}` (the service name), so the frontend never hardcodes a host origin
- Add a small typed API module (`src/lib/api.ts`) with one `fetch` wrapper that turns a non-OK response into an `Error` carrying a readable message. Per-endpoint functions are added by the feature that needs them
- Define the shared `Expense` type and the approved category list on the frontend, matching the backend's model
- Add a money formatter converting integer minor units to the display format the design shows (2550 → €25.50)

### Container

- Add `frontend/Dockerfile` with two named stages: a `dev` target running the Vite dev server, and a `prod` target that builds the app and serves the static output from a small web server image. Feature 05 uses `prod`
- Add `frontend/.dockerignore` on the same rules as the backend's
- Add a `frontend` service to `docker-compose.yml`: builds the `dev` target, maps `FRONTEND_PORT`, bind-mounts the source with the same anonymous-volume treatment for `node_modules`, and depends on `backend`
- Bind the Vite dev server to `0.0.0.0` so it is reachable from the host, and enable whatever polling or watch option HMR needs through a bind mount on this platform

### Tests

- Set up Jest + React Testing Library + jsdom for the Vite/TypeScript app, with a `test` script. Handle CSS imports, and `import.meta` if the app uses it, since Jest does not support it by default
- Add a smoke test rendering the shell, and a test for the money formatter
- Tests run inside the container: `docker compose exec frontend npm test`. Document that command in `README.md`

## Acceptance Criteria

- `docker compose up` brings up `mongo`, `backend` and `frontend`, and the page loads at `http://localhost:${FRONTEND_PORT}`
- A request to `/api/health` from the browser reaches the backend through the proxy and returns the health payload
- Editing a component and saving it updates the browser without a rebuild
- `docker compose exec frontend npm test` passes
- `docker compose exec frontend npm run build`, `... npm run lint` and `... npm run format:check` all pass
- `docker compose build --target prod frontend` succeeds and the resulting image contains no source files and no `node_modules`
- The empty layout matches the design at the sizes the design shows
- No mock expense data ships — the shell is empty, not pre-filled

## Depends On

- Feature 01 (a backend service to proxy to)
- Feature 02 (Compose network and the full stack running together)

## Design Reference

The approved UI design is the visual source of truth. Read it before building,
not after.

- Claude Design MCP: `https://api.anthropic.com/v1/design/mcp` — authenticate with `/design-login`
- Design project: `https://claude.ai/design/p/b9c35a63-4da3-4e92-9f81-4d5be8aea178?file=Expense+Tracker.dc.html`
- Primary file: `Expense Tracker.dc.html`
- Also read when relevant: `ios-frame.jsx`, `support.js`

Take from it: layout structure, spacing, typography, colours, controls, visual
hierarchy, and the responsive and interaction states it represents. Translate its
styles into Tailwind per @context/coding-standards.md, but do not restructure what
it lays out, and do not invent a different design.

If the design does not specify a state a spec requires, implement the minimum
reasonable UI in the same visual language and record it as a deviation in
@context/current-feature.md.

If the design shows the app inside an iPhone frame (`ios-frame.jsx`) and it is
unclear whether the frame is part of the app or only a presentation wrapper, ask
before building it.

## Notes

The `prod` target is written now but not used until feature 05. The important
difference to understand: the Vite proxy exists only in the `dev` target. In
production there is no dev server, so how `/api` reaches the backend is a separate
decision made in feature 05.

Vite inlines environment variables at build time, so anything the frontend needs
about the API is baked into the image — which is exactly why the production
routing decision cannot be deferred past feature 05.
