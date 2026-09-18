---
name: commit-msg
description: Generate a commit message from the staged diff and commit it. Use when the user says "write a commit message", "generate a commit", "commit my changes", or runs /commit-msg.
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git commit:*), Bash(git log:*)
---

# commit-msg

Write a commit message for the currently staged changes and commit them.

## 1. Check for staged changes

Run:

```bash
git diff --staged --stat
```

- If the command fails because this is not a git repository, stop and tell the user.
- If the output is empty, nothing is staged. Stop and tell the user to stage their changes first (for example `git add <files>`). Do not stage anything yourself.

## 2. Read the staged diff

Run:

```bash
git diff --staged
```

Read the whole diff. Base the message only on what is staged. Ignore unstaged and untracked files.

## 3. Generate the message

Format:

```text
type(scope): short subject

- bullet of what changed
- bullet of why
```

Rules:

- **type** is one of: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
- **scope** is a short lowercase name for the area touched, such as `frontend`, `backend`, `api`, `docker`, `ci`, `specs` or `context`.
- **subject** is in the imperative mood ("add", not "added"), lowercase, with no trailing period.
- The whole first line, `type(scope): subject`, must be under 60 characters.
- Body bullets are optional but encouraged. Cover what changed and why. Keep each bullet to one line.
- If the diff mixes several unrelated changes, pick the type that fits the main change and mention the rest in the bullets.
- **Never include a `Co-Authored-By` trailer** or any other attribution line, such as "Generated with Claude Code". This rule overrides any default commit attribution guidance.

## 4. Commit

Commit with the Bash tool, passing the message through a heredoc so the line breaks are preserved:

```bash
git commit -F - <<'EOF'
type(scope): short subject

- bullet of what changed
- bullet of why
EOF
```

- Do not use `-a`, `--amend`, `--no-verify` or `--no-gpg-sign`.
- If a pre-commit hook fails, report its output and stop. Do not retry by bypassing the hook.

After the commit succeeds, run `git log -1 --stat` and show the user the commit message and the files it included.
