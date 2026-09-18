---
name: update-readme
description: Updates README.md after a feature is implemented — refreshes the progress table and appends a build-log entry covering what shipped, what was decided, and what broke, derived from the commits since README was last touched. Use when the user says "update the readme", "update readme after this feature", or runs /update-readme.
---

# Update README

Bring `README.md` up to date with the work that landed since it was last updated.
Everything written must be derived from the repo — commits, diffs, and the feature
docs — never from memory or assumption.

## Steps

1. **Find the range** - Get the last commit that touched the README:

   ```bash
   git log -1 --format=%H -- README.md
   ```

   That hash is the start of the range. If the command returns nothing, use the repo's first commit (`git rev-list --max-parents=0 HEAD`). Everything from there to `HEAD` is what this update must cover.

2. **Gather what happened** - Within that range, collect:

   - `git log <start>..HEAD --oneline` — the commits, including merge commits
   - `git diff <start>..HEAD --stat` — which files and areas actually changed
   - `git log <start>..HEAD --format="%h %s%n%b"` — the commit bodies, which already carry the what/why bullets written by `/commit-msg`

   Then read `context/current-feature.md` (goals, notes, decisions for the feature just finished) and the matching spec in `context/features/`. If a decision or fix is not visible in the commits or these docs, do not write it down.

3. **Handle the first run** - If `README.md` is still the placeholder from feature 00, replace it entirely rather than editing around it. Build the full structure from step 4.

4. **Write the README** - Target this structure, creating any section that doesn't exist yet and leaving sections not covered by this update untouched:

   ```markdown
   # Expense Tracker

   <one-line description: a deliberately small MERN app used to learn the full development-to-deployment lifecycle>

   ## Status

   | # | Feature | Status | Deployed SHA |
   |---|---------|--------|--------------|
   | 00 | Repository & Tooling Setup | ✅ Done | — |
   | 01 | Backend in Docker | ⬜ Not started | |
   ...

   (The Deployed SHA column is filled from feature 06 onward, when there is a
   production deploy to record. Setup features before that show `—`.)

   ## Roadmap

   <mermaid dependency graph — see Diagrams below>

   ## Architecture

   <mermaid runtime data-flow graph — see Diagrams below>

   ## Deployment Pipeline

   <mermaid deployment graph — see Diagrams below>

   ## Getting Started

   <the real commands — Compose only: `docker compose up --build`, and the
   `docker compose exec` commands for tests, lint, format and build. Never a
   host-level `npm run dev`.>

   ## Environment Variables

   <every variable in .env.example, what it is for, and where it is set in each environment>

   ## Tech Stack

   ## Project Structure

   ## Development Workflow

   <mermaid workflow graph — see Diagrams below>

   ## Deployment & Rollback

   <from features 06-07 onward: production URLs, what triggers a deploy, the
   rollback steps by image SHA, and what to check first when production
   misbehaves>

   ## Build Log

   ### 00 — Repository & Tooling Setup

   `888de9b`

   **Shipped** — what now exists that didn't before
   **Decisions** — non-obvious choices and the reasoning
   **Fixes** — anything that broke during the work and how it was resolved
   **Deployed** — the SHA now running in production, for features that shipped
   ```

   - The **Status** table lists every spec in `context/features/`, so the reader sees the whole roadmap and where it stands.
   - The **Build Log** grows downward: newest entry appended at the bottom, existing entries never rewritten or deleted.
   - Omit the **Fixes** line entirely when nothing broke — do not pad it with "None".
   - Keep entries short. Three to six lines per feature, not a diff transcript.
   - Keep the Environment Variables section in sync with `.env.example`. A variable that exists in one and not the other is a bug in this document.

5. **Refresh the diagrams** - The README carries four Mermaid diagrams (GitHub renders them natively, so no images or external tooling). Update them as part of every run:

   - **Roadmap** — a `flowchart TD` of the feature specs, with the Platform Bootstrap (00-07) and the Full-Cycle Features (08+) in labelled subgraphs, since they mean different things. Edges come from each spec's **Depends On** section, never from the numbering: some features are only *sequenced* after others without depending on them, and those edges must be dotted and labelled as such. Completed features get the `done` class (green), the rest `todo` (grey). This doubles as the progress chart, so recolouring the node of the feature that just landed is the main edit each run.
   - **Architecture** — two `flowchart LR` graphs: the runtime flow (browser → React → Express → Mongoose → MongoDB) and the local container topology (frontend, backend, mongo on the Compose network, with the ports and the service-name URI labelled). They change only when the flow or the topology actually changes.
   - **Deployment Pipeline** — a `flowchart LR` of push → GitHub Actions → lint/test/build → compose build → image build → GHCR → Render → production verify. Grey out the stages that do not exist yet, and light them up as features 04-06 land. Runtime and deployment are different flows and stay in different diagrams.
   - **Development Workflow** — the full cycle from `implement-feature`. This one is fixed: use the graph below verbatim, adjusting only the class assignments. Every failure edge in it is required — a workflow diagram with no way to fail is decoration, and the rollback edge out of `PROD` is the one most often missing. Steps that wait for the user (the implementation and delivery pauses) carry the `gate` class (amber).

     ```mermaid
     flowchart TD
         NEW["NEW CHANGE · feature or bug"] --> SCOPE{"in scope?"}
         SCOPE -->|"no"| SCOPEQ["scope decision with the owner"]
         SCOPEQ --> NEW
         SCOPE -->|"yes"| SPEC["SPEC · /new-spec from template"]
         SPEC --> BRANCH["BRANCH · feature/x or fix/x"]
         BRANCH --> STACK["STACK UP · compose up, services healthy"]
         STACK --> ISBUG{"bug?"}
         ISBUG -->|"yes"| REPRO["REPRODUCE · see it fail, then diagnose"]
         REPRO --> BE
         ISBUG -->|"no"| BE["BACKEND · endpoint, validation, its tests"]
         BE --> FE["FRONTEND · api call, UI, states, its tests"]
         FE --> LOCAL["LOCAL VERIFY · test, lint, build, browser"]
         LOCAL -->|"fail"| BE
         LOCAL -->|"pass"| COMMIT["COMMIT · /commit-msg"]
         COMMIT --> CI["CI · lint, test, build, compose build"]
         CI -->|"red"| BE
         CI -->|"green"| MERGE["MERGE to main"]
         MERGE --> GHCR["GHCR · images tagged with commit SHA"]
         GHCR --> RENDER["RENDER · deploys that SHA"]
         RENDER --> PROD{"PROD VERIFY · behaviour, health, logs"}
         PROD -->|"broken"| RB["ROLLBACK · redeploy previous SHA"]
         RB --> BUGSPEC["new bug spec"]
         BUGSPEC --> NEW
         PROD -->|"works"| CLOSE["CLOSE OUT · delete branch, README, history + SHA"]
         CLOSE --> NEW
     ```

     Backend and frontend are sequential, not parallel: the frontend calls a real endpoint rather than a mock that gets deleted later. Do not redraw them as a fork.

   Quote every node label (`F00["00 · Repo & Tooling"]`) so punctuation doesn't break the parse, and re-read the diagram after editing to confirm each node id still resolves.

6. **Commit** - Show the user what changed, then invoke `/commit-msg` to commit it (`docs:` type). Ask before committing, per `context/ai-interaction.md`.

## Rules

- Never invent progress. A feature is only ✅ Done if its commits are in the log.
- Never describe a fix that isn't evidenced in the commits or `current-feature.md`.
- Keep the Getting Started commands accurate for the current state of the project, and Compose-only. A host-level `npm run dev` is not a supported path and must never appear in the README.
- Keep the Status table's spec list in sync with `context/features/`, including specs added later from the templates. Exclude the `_TEMPLATE-*` files.
- Never write a real secret, connection string or token into the README — names and placeholders only.
- A diagram that contradicts the Status table is worse than no diagram — the table, the roadmap colours, and the "N of M complete" line must always agree, where M is the number of specs currently in `context/features/`.
- Never record a feature as deployed unless the production check in its Ship section was actually carried out.
