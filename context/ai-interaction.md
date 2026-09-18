# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features not in the spec
- Never delete files without clarification
- Report assumptions instead of silently inventing product behaviour
- Do not write code-level walkthroughs, tutorials or "what this teaches you" sections unless explicitly asked — the developer reads the code themselves

## This Project Runs in Containers

The application is developed in Docker from the first feature. There is no
supported host-level run.

- `docker compose up` is how the app runs
- `docker compose exec backend <cmd>` and `docker compose exec frontend <cmd>` are how tests, lint, format and build are run
- `docker compose logs -f <service>` is how output is read
- The backend reaches MongoDB by service name (`mongo`), never `localhost`
- Configuration comes from the root `.env`, which is gitignored; `.env.example` is the committed list

If a container is not running, bring it up. Do not work around it with a local
`npm install` and do not add host-level scripts.

## The Full Cycle

> **Full cycle:** taking one feature or bug from specification through
> implementation, testing, containerized verification, CI, image publishing,
> deployment and verification in production. Change → production.

The cycle is defined by its endpoints, not by its middle. Which layers a change
touches varies: backend and frontend, one of them, or neither. A wrong environment
variable in `docker-compose.yml`, a broken `HEALTHCHECK`, a CI job that needs
fixing — none of those touch application code, and each is still a full cycle,
because it still needs verification, CI, a deploy and a production check.

Every change — a new feature or a bug fix — runs that same cycle, and it ends in
production, not at the merge:

```text
1. Document      → context/current-feature.md
2. Branch        → feature/<name> or fix/<name>
3. Stack up      → docker compose up --build, services healthy
4. Reproduce     → bug fixes only: see the bug before fixing it
5. Backend       → endpoints, validation, model (when the change touches it)
6. Frontend      → API call, UI, states (when the change touches it)
7. Tests         → for whichever layers changed, inside the containers
8. Verify local  → tests, lint, format, build, by hand in the browser
9. Commit        → /commit-msg, after permission
10. CI           → push, open PR, pipeline green
11. Merge        → to main
12. Ship         → images published with the SHA, Render deploys it
13. Verify prod  → the change works at the production URL, health still healthy
14. Clean up     → delete branch, /update-readme, close out
```

A cycle is not complete until step 13. A merged branch that has not been verified
in production is an unfinished cycle.

Run it with `/implement-feature context/features/<spec>.md`.

### Two Kinds of Pause

The cycle stops twice over, for two different reasons, and the reasons are worth
keeping distinct:

**Implementation pauses** — after the backend part, after the frontend part, after
the tests. Each one reports what changed and why, and waits. These exist so the
code can be read before more of it arrives.

**Delivery pauses** — after CI, and after the deploy. Each one reports what
happened in GitHub Actions, in the registry and on Render, and waits. These exist
because the pipeline is the actual subject of this project: a deploy that scrolls
past in a wall of output teaches nothing. This is where the Actions log, the
package page and the Render dashboard get looked at.

Neither kind is skipped because the work looks obviously fine.

## Bootstrap vs Full Cycle

`context/features/` has two groups, and they differ in how much of the cycle
exists to run.

**Platform Bootstrap (00-07)** builds the cycle itself. These are still real
cycles — spec, branch, implement, verify, commit, merge — but a stage that has not
been built yet cannot be run. The cycle grows as the machine does:

| Spec | Runs in containers | Tests | CI | Images to GHCR | Deploys | Prod verify |
|------|-----|-----|-----|-----|-----|-----|
| 00 Repo & tooling | — | — | — | — | — | — |
| 01 Backend in Docker | yes | yes | — | — | — | — |
| 02 MongoDB & model | yes | yes | — | — | — | — |
| 03 Frontend in Docker | yes | yes | — | — | — | — |
| 04 CI | yes | yes | yes | — | — | — |
| 05 Images & registry | yes | yes | yes | yes | — | — |
| 06 Render deployment | yes | yes | yes | yes | yes | yes |
| 07 Logging & rollback | yes | yes | yes | yes | yes | yes |

So "every change ships" becomes literally true from 06 onward, and the bootstrap
is the reason it is true rather than an exception to it. If a bootstrap spec seems
to skip a stage, check this table before treating it as an oversight.

**Full-Cycle Features (08+)** run every stage, every time. Specs 08-10 are the
application features, 11 is the acceptance gate, and everything added later —
feature or fix — joins this group. The bootstrap happens once.

## Specs

Every change gets a spec in `context/features/` before it is implemented.

- Specs 00-07 are the Platform Bootstrap: repo, backend container, MongoDB service, frontend container, CI, production images and registry, Render deployment, logging and rollback
- Specs 08-10 are the application features, one full cycle each
- Spec 11 is the full-system acceptance gate
- Anything new goes through `/new-spec`, which writes the next numbered spec from `_TEMPLATE-feature.md` or `_TEMPLATE-bug.md`

Work the specs in order. A spec's **Depends On** section, not its number, is what
actually gates it.

Do not split one feature across branches by layer — no "backend now, UI next
week". One spec, one branch, one deploy.

## Branching

Create a new branch off `main` for every spec. Name it `feature/[feature]` or
`fix/[fix]`. Ask to delete the branch once merged.

## Commits

- Ask before committing (don't auto-commit)
- Use the `commit-msg` skill (`/commit-msg`) to generate and run commits — it checks staged changes, reads the diff, and writes a conventional commit message (`type(scope): subject` + why/what bullets)
- Keep commits focused (one feature/fix per commit)
- Never put "Generated With Claude" in commit messages
- Never include a Co-Authored-By trailer

## Pipeline Discipline

- Never merge on a red pipeline
- Never fix CI by disabling the check that caught the problem
- Images are published only from `main`, only after CI passes
- Every image carries its commit SHA tag — that tag is what a rollback redeploys
- If production breaks and the fix is not minutes away, roll back first and debug after. Rolling back is the correct move, not an admission of failure

## When Stuck

- If something isn't working after 2-3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear
- If the frontend gets no data, check the backend container is up and connected to `mongo` before debugging React
- If something works locally but not in a production image, suspect the difference between the `dev` and `prod` targets first — the Vite proxy exists only in `dev`
- If something works in a container but not on Render, suspect environment variables and the production database before application code

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features (this app is intentionally minimal)
- Preserve existing patterns in the codebase
- Do not add a dependency without saying why a platform or existing capability won't do

## Code Review

Review AI-generated code periodically, especially for:

- Logic errors (amount conversion to minor units, validation gaps, id handling)
- Performance (unnecessary re-renders, redundant fetches)
- Patterns (matches existing codebase?)
- Infrastructure correctness (secrets not baked into images, health checks that actually check something, no `latest` base images)
