---
name: new-spec
description: Writes a new numbered feature or bug spec in context/features/ from the project templates, ready for /implement-feature. Use when the user says "new feature", "new spec", "we have a bug", "log this bug" or runs /new-spec.
---

# New Spec

A feature or a bug has arrived. Turn it into a spec file that the standard cycle
can run on. The user's description of it is given as an argument: $ARGUMENTS

This skill only writes the spec. It does not create a branch and does not
implement anything — that is `/implement-feature`.

## Steps

1. **Decide which template** - A bug is something that contradicts an existing spec, the design, or a data rule in @CLAUDE.md. Everything else is a feature, including "it works but it should also do X". If the user calls it a bug but nothing states the expected behaviour, say so and use the feature template instead.

   - Feature → `context/features/_TEMPLATE-feature.md`
   - Bug → `context/features/_TEMPLATE-bug.md`

2. **Check the scope list** - @CLAUDE.md lists what this project deliberately does not do (authentication, budgets, reports, charts, search, pagination, filtering, recurring expenses, notifications, file uploads, multi-currency, category CRUD). If the request is on that list, stop and say so: it needs an explicit scope change from the user before a spec is worth writing. Do not write the spec and then note the conflict.

3. **Find the next number** - List `context/features/`, take the highest `NN` and add one. Name the file `NN-<kebab-name>.md` for a feature, `NN-fix-<kebab-name>.md` for a bug. Never renumber or reuse an existing spec's number.

4. **Ask what the description doesn't settle** - Read the chosen template and ask only about what you cannot answer from $ARGUMENTS, @CLAUDE.md, the context files and the existing specs. Ask everything in one go, then stop and wait. Typically:

   - **Feature:** what the user can do afterwards that they can't now; which layers it touches — backend, frontend, infrastructure, or some subset; whether the design covers it or a state has to be invented; anything it deliberately leaves out.
   - **Bug:** the exact reproduction steps; which environment it happens in (local Compose, a production image locally, or Render); the expected behaviour and what states it.

   For a bug, if the user cannot reproduce it, say that reproducing it is the first thing the cycle will have to do, and write the spec with the Reproduction section holding what is known.

5. **Write the spec** - Fill in every section of the template, delete its comment blocks, and delete any section that genuinely does not apply — noting in Notes why. Then:

   - Keep the **Ship** section as the template has it. Every spec ends in production; a spec that does not ship is not finished.
   - Keep only the requirement sections the change touches, and delete the rest rather than filling them with "no change". A spec may be infrastructure-only — a Compose variable, a health check, a workflow fix — and that is a full cycle like any other.
   - If a change has no test that could catch a regression (common for configuration), do not leave Tests empty. Name what is checked instead, as a command and an expected result, and consider what would have caught it — that is usually worth adding in the same cycle.
   - Write Acceptance Criteria as checkable statements naming how each is verified, with at least one checked in production.
   - Fill **Depends On** from what the spec actually needs, not from its number.
   - For any UI work, point the Design Reference at @context/features/03-frontend-in-docker.md and name the specific screen or control. If the design has nothing for it, say so explicitly.
   - If the spec cannot ship on its own — it needs another spec merged first to be usable — it is too big. Say so and propose the split before writing.

6. **Report** - Show the file path and a short summary: what it covers, which layers it touches, what it depends on, and anything you had to assume. Then tell the user the command to run it:

   ```text
   /implement-feature context/features/NN-<name>.md
   ```

7. **Commit** - Ask whether to commit the spec on its own (`docs:` via `/commit-msg`) before implementation starts, or to let the feature branch carry it. Either is fine; do not decide silently.

## Rules

- Do not implement anything, create a branch, or touch @context/current-feature.md. `/implement-feature` does all three.
- Do not invent requirements the user did not describe and cannot confirm. An unanswered question belongs in the spec as an open question, not as a guess.
- Do not write a spec for something on @CLAUDE.md's out-of-scope list without an explicit scope change.
- One spec is one cycle. Two features that happen to touch the same file are still two specs.
