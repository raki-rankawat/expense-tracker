# Fix: <name>

<!--
Copy this file to context/features/NN-fix-<kebab-name>.md, NN being the next free
number, and fill it in.

A bug fix runs the same cycle as a feature: branch, fix, test, CI, deploy, verify
in production. The branch is named `fix/<name>` rather than `feature/<name>`.

The difference from a feature spec is the top half: a bug has to be reproduced
before it is fixed, and the regression test is what proves the fix.
-->

## Status

Not Started

## Symptom

<!-- What is observably wrong, in the terms it was noticed in. Include the actual
values, messages or screenshots — not a diagnosis. -->

## Reproduction

<!-- Exact steps, starting from a known state. Say which environment it reproduces
in: local Compose, a production image run locally, or Render. If it reproduces in
production but not locally, that difference is the most important line in this
spec. -->

```text
1.
2.
3.
Expected:
Actual:
```

## Expected Behaviour

<!-- What should happen instead, and which spec, design file or data rule says so.
If nothing says so, this is a feature request, not a bug — use the feature
template. -->

## Diagnosis

<!-- Fill in after investigating, before fixing. Where the fault actually is:
frontend, backend, database, container configuration, pipeline or environment.
Include the evidence — a log line, a failing request, a health response. If the
cause is environmental (a variable, a network name, an image tag), say which
environments are affected. -->

## Requirements

### Fix

<!-- The smallest change that corrects the cause rather than the symptom. Name the
layer: frontend, backend, database, container configuration, pipeline or Render
configuration. A bug whose cause is a wrong environment variable or a broken
health check is fixed in configuration, not in application code — resist adding a
code workaround for an environment problem. -->

### Tests

<!-- A regression test that fails before the fix and passes after. State both,
because a test that passes before the fix is not testing the bug.

If the cause was configuration and there is no unit test that could have caught
it, say what would have: a health check that actually checks, a CI job, a startup
assertion on a required variable. Then add that, rather than closing the cycle
with nothing to stop a recurrence. -->

### Ship

- CI green on the pull request, including the new regression test
- Merge to `main`; confirm the images are published with this commit's SHA tag
- Confirm Render deploys; verify the original reproduction steps no longer reproduce in production
- If the bug was affecting production, note whether a rollback was used as a stopgap first

## Acceptance Criteria

- The reproduction steps no longer reproduce, in the environment where the bug was found
- The regression test fails on the previous commit and passes on this one — verified, not assumed
- Nothing else regressed: the rest of the suite still passes and the app still works end to end
- The fix is verified in production

## Depends On

<!-- Usually nothing. Name a feature only if the fix genuinely needs something
that is not merged yet. -->

## Notes

<!-- Why it was missed: a gap in a test, in a spec, in a health check, or in the
pipeline. If something in context/ or in a spec was wrong or misleading, correct
it as part of this cycle and say so here. -->
