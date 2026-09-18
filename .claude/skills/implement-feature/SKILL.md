---
name: implement-feature
description: Runs one full cycle on a feature or bug spec — change to production: document, branch, implement the layers the spec touches, test, CI, merge, deploy, verify in production — following @context/ai-interaction.md. User-invoked only.
disable-model-invocation: true
---

# Implement Feature

You are running one **full cycle** on a single spec, following the standing
workflow in @context/ai-interaction.md. The spec file path is given as an
argument: $ARGUMENTS

A full cycle is **change → production**: one spec taken from its requirements
through implementation, tests, local verification, commit, CI, image publishing,
deployment and verification in production. It is not finished at the merge; it is
finished when the change is live and checked there.

Which layers get touched is whatever the spec says — backend and frontend, one of
them, or neither. A change to a Dockerfile, `docker-compose.yml` or a workflow
file with no application code at all is still a full cycle: it still needs tests
or a verification step, CI, a deploy and a production check.

## Scope of one invocation

One invocation of this skill is **one spec**, and it runs every stage of the cycle
that exists at that point in the project:

- **Platform Bootstrap specs (00-07)** — these build the cycle itself, so early ones cannot run stages that do not exist yet. Spec 00 has no CI to pass; 04 has CI but nothing to publish; 05 publishes but does not deploy; 06 and 07 run the whole thing. The table in @context/ai-interaction.md says exactly how far each one reaches. Go by that table and by whether the spec has a **Ship** section — not by assuming setup specs skip delivery.
- **Full-Cycle specs (08+)** — every stage, every time: implementation, tests, local verification, commit, CI, merge, registry, deploy, production verification. Anything created later by `/new-spec` is in this group.

Never declare a cycle complete having skipped a stage that existed. Never invent a
stage that does not.

The cycle pauses for review in two different ways, and both are mandatory:

- **Implementation pauses** — after each part in step 5. Report what changed and why, then wait. These let the code be read before more arrives.
- **Delivery pauses** — after CI (step 9) and after the deploy (step 11). Report what actually happened in Actions, the registry and Render, then wait. The pipeline is the subject of this project; a deploy that scrolls past teaches nothing.

Never skip a pause because the work looks obviously fine, and never merge two
pauses into one.

The application runs in containers. Every command that touches an app runs through
Compose (`docker compose exec backend ...`, `docker compose exec frontend ...`) —
never on the host.

## Steps

1. **Document** - Read the spec at $ARGUMENTS. If this is the first cycle of the conversation, also read @CLAUDE.md and the context files it lists. Update @context/current-feature.md: copy the name, goals and requirements from the spec into it, and set Status to "In Progress". If the spec's **Depends On** features are not in the History section, say so and ask before continuing.

2. **Branch** - Create a branch from `main`: `feature/[name]` for a feature spec, `fix/[name]` for a bug spec (derive the name from the spec file — `08-view-expenses.md` → `feature/view-expenses`, `12-fix-amount-rounding.md` → `fix/amount-rounding`).

3. **Bring the stack up** - `docker compose up --build -d`, then confirm all services are healthy (`docker compose ps`) and `GET /api/health` responds before changing anything. A failure here is an environment problem, not a feature problem — fix it first and say what it was.

   Skip this for the setup specs that are building the stack itself (00-02, and 03 for the frontend service) — there, bringing the stack up is the spec's own work and its acceptance criteria.

4. **Reproduce (bug specs only)** - Follow the spec's Reproduction steps and confirm the bug happens, in the environment the spec names. If it does not reproduce, stop and report that — do not fix a bug you have not seen. Fill in the spec's Diagnosis section with the evidence before writing any fix.

5. **Implement (looped, one part at a time)** - Break the spec's requirements into discrete parts before starting, taking the parts from the spec's own requirement sections rather than from a fixed list. Where both application layers are involved, backend comes before frontend, so the frontend calls a real endpoint instead of a mock that gets deleted later. An infrastructure-only change is its own part. A bug fix is the fix, then the regression test. Then, for each part in order:

   a. Implement only that part, following @context/coding-standards.md and the rules in @CLAUDE.md. Do not add anything beyond the spec's requirements.
   b. Stop. Show a short summary of what changed (files touched, key decision) for this part only.
   c. Wait for explicit approval ("resume", "continue", "looks good") before starting the next part. Do not implement the next part automatically, and do not batch parts into one pause.
   d. If the reviewer requests a change, make it, show the updated summary, and wait again.

   If the spec has an **Ask first** item, ask it and stop before changing any files for that part.

   If the spec has a **Design Reference**, read `Expense Tracker.dc.html` through the Claude Design MCP before building the UI part — not after. If Claude Design is unreachable, stop and tell the user to run `/design-login`. Never invent a design to work around it.

   Repeat a-d until every part is implemented and approved.

6. **Verify locally** - In the running containers (for specs 00-02, run whatever of these exists yet):

   - `docker compose exec backend npm test` / `npm run lint` / `npm run format:check` / `npm run build`
   - `docker compose exec frontend npm test` / `npm run lint` / `npm run format:check` / `npm run build`
   - The feature by hand in the browser against the Compose stack
   - For a bug: the reproduction steps no longer reproduce, and the regression test fails on `main` and passes here — check both, do not assume
   - If the spec touched a Dockerfile or `docker-compose.yml`: `docker compose build` for both `dev` and `prod` targets

   Every check must pass before moving on. Run them; do not reason about whether they would pass.

7. **Iterate** - Anything that doesn't match the spec or the design reference gets fixed now, before committing.

8. **Commit** - Ask for permission. Once approved, invoke `/commit-msg` — don't hand-write the message.

9. **CI — delivery pause** - Push the branch and open a pull request. For specs before 04, CI does not exist yet — say so and go to step 10. Otherwise wait for CI, then report:

    - the result per job, and for a failure the log line that caused it
    - what each job actually did, in one line each — where the time went, what the cache hit or missed
    - the pull request URL and the Actions run URL, so they can be opened

    Then **stop and wait** for the user before merging. If a job fails, fix it on this branch and push again; a red pipeline is not merged around. If locally-green code passes CI only sometimes, say so rather than re-running until it goes green.

10. **Merge** - Merge to `main` once CI is green.

11. **Ship — delivery pause** - If the spec has no **Ship** section, there is no deployment path yet (specs 00-04) — say so in one line and go to step 12. Otherwise follow it:

    - Confirm both images were published with this commit's SHA tag, and give the exact tags
    - Confirm Render deployed that SHA — not that a deploy was triggered, that it finished
    - Verify the feature (or the fixed behaviour) at the production URL, against the production database
    - Confirm `GET /api/health` is healthy in production afterwards, and check the logs for the requests just made
    - If production is broken and not fixable in minutes, roll back per `README.md` and report that — the rollback is the correct move, not a failure

    Then report what happened across the whole delivery — image tags, deploy duration, what the health response and logs said — with the registry and Render URLs, and **stop and wait** before closing out.

12. **Delete Branch** - Ask before deleting the branch, then delete it.

13. **Review** - Quick self-review for logic errors, unnecessary complexity and consistency with existing patterns. For anything touching containers or the pipeline, also confirm no secret was committed or baked into an image.

14. **Update README** - Invoke `/update-readme`. It derives its entry from the commits since the README was last touched, so run it after the merge. It also reads the Goals and Notes in @context/current-feature.md, so write the README first — but stop before its commit step. The commit happens in step 15.

15. **Close out** - Every finished feature ends here; never skip it. Update @context/current-feature.md: set Status to "Completed", clear Goals/Notes, and append a one-line summary to History that includes the deployed SHA (for specs with no deploy yet, the merge SHA and "not deployed"). Then ask for permission and invoke `/commit-msg` to commit `README.md` and `context/current-feature.md` together in one `docs:` commit, and push `main`. Then state which spec is next and stop.

## Rules

- Never skip the confirmation before committing or deleting a branch.
- Never merge on a red pipeline. From spec 05 onward, never mark a cycle complete before production is verified; before that, CI green and the local checks are the bar.
- If something isn't working after 2-3 attempts, stop and explain rather than guessing.
- Don't refactor unrelated code and don't add features not in the spec.
- Do not write code-level explanations, tutorials or "what this teaches you" sections. Report what changed, what was checked, and any non-obvious decision — nothing more. The user reads the code themselves.
- Do not run app commands on the host. If a container is not running, bring it up; do not work around it with a local install.
- One run of this skill is one spec. Do not start the next one automatically.
- A cycle is not finished until @context/current-feature.md is closed out and committed with the README.
- Both delivery pauses are reports plus a stop. Do not merge straight through from a green pipeline, and do not close out straight from a successful deploy.
