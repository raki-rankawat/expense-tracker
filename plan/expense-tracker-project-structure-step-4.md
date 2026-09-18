# Expense Tracker — Step 4: Project Structure

Now that we understand:

- What the application contains
- How the application communicates
- How a request moves through the system
- How code eventually moves toward production

we can define the **repository structure**.

The goal is to create a structure that is:

- Simple enough for a small project
- Professional enough to resemble a real project
- Suitable for Docker and CI/CD
- Easy for Claude Code to understand
- Easy to expand without over-engineering

---

# 1. Repository Strategy

We will use a **monorepo**.

The entire project lives in one Git repository:

```text
expense-tracker/
```

Inside it:

```text
expense-tracker/
├── frontend/
├── backend/
├── context/
├── specs/
├── docker-compose.yml
├── .gitignore
├── .env.example
├── CLAUDE.md
└── README.md
```

The main reason for using a monorepo is simplicity.

We have only one frontend and one backend, so maintaining separate repositories would add unnecessary complexity.

---

# 2. Recommended Project Tree

Our initial target structure is:

```text
expense-tracker/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── .dockerignore
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── development-workflow.md
│   ├── coding-standards.md
│   └── current-feature.md
│
├── specs/
│   ├── 01-add-expense.md
│   ├── 02-view-expenses.md
│   └── 03-delete-expense.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── CLAUDE.md
└── README.md
```

Some of these files will not exist immediately.

We will create them as we reach the relevant stage of the project.

---

# 3. Frontend

The frontend will contain the React application.

```text
frontend/
├── src/
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
└── .dockerignore
```

## `frontend/src/`

Contains the actual React application.

Eventually this will contain things such as:

```text
components/
pages/
hooks/
services/
types/
```

However, we should **not create every possible directory immediately**.

The exact internal frontend structure will be determined when we write the feature specifications.

---

## `frontend/package.json`

Contains:

- Dependencies
- Development dependencies
- npm scripts
- Project metadata

For example, scripts will eventually include things such as:

```text
npm run dev
npm run build
npm run lint
npm run test
```

The exact scripts are still to be finalized.

---

## `frontend/Dockerfile`

This will describe how the frontend is converted into a Docker image.

Conceptually:

```text
React Source Code
       ↓
Dockerfile
       ↓
Docker Build
       ↓
Frontend Image
```

We will write this later when we start the Docker phase.

---

## `frontend/.dockerignore`

Similar to `.gitignore`, but specifically for Docker build context.

It will prevent unnecessary files from being sent into the Docker build.

For example, we generally don't want:

```text
node_modules/
.git/
```

to unnecessarily become part of the build context.

The exact contents will be decided during the Docker phase.

---

# 4. Backend

The backend will contain the Node.js/Express API.

```text
backend/
├── src/
├── package.json
├── tsconfig.json
├── Dockerfile
└── .dockerignore
```

## `backend/src/`

Contains the Express application.

Potential structure:

```text
src/
├── routes/
├── controllers/
├── models/
├── services/
├── middleware/
├── config/
└── server.ts
```

However, this is a **candidate structure**, not a requirement.

Because this is a small application, we should avoid creating abstractions simply for the sake of having an "enterprise" folder structure.

For example, if a separate service layer adds no meaningful value, we don't need to force one into the project.

Claude Code should follow the approved architecture/specification rather than inventing layers.

---

# 5. Docker Compose

At the repository root:

```text
docker-compose.yml
```

Its purpose will eventually be to define our local multi-container environment.

Conceptually:

```text
docker-compose.yml
        │
        ├── Frontend
        │
        ├── Backend
        │
        └── MongoDB
```

So instead of manually starting three separate services, we'll eventually be able to run something like:

```bash
docker compose up
```

and start the complete stack.

Docker Compose configuration will be implemented during the Docker phase.

---

# 6. GitHub Actions

GitHub Actions workflows will live here:

```text
.github/
└── workflows/
    ├── ci.yml
    └── cd.yml
```

## `ci.yml`

Responsible for the Continuous Integration workflow.

Conceptually:

```text
Pull Request / Push
        ↓
Install
        ↓
Lint
        ↓
Test
        ↓
Build
        ↓
Docker validation
```

The exact workflow will be defined later.

---

## `cd.yml`

Responsible for the Continuous Deployment workflow.

Conceptually:

```text
Approved code
      ↓
Build Docker images
      ↓
Push images
      ↓
Deploy
      ↓
Health check
```

The exact deployment strategy is **TBD**.

---

# 7. Context Files

This is particularly important because we will use **Claude Code** to build the project.

The `context/` directory will contain project knowledge that should remain available to Claude.

```text
context/
├── project-overview.md
├── architecture.md
├── development-workflow.md
├── coding-standards.md
└── current-feature.md
```

## `project-overview.md`

Explains:

- What the project is
- Why we're building it
- Project goals
- Technology stack
- Scope
- What is intentionally excluded

---

## `architecture.md`

Contains:

- Application architecture
- Component relationships
- Request lifecycle
- Deployment architecture
- Infrastructure decisions

This becomes the technical reference for Claude.

---

## `development-workflow.md`

Explains how we work with the project.

For example:

```text
Feature idea
    ↓
Specification
    ↓
Claude Code
    ↓
Implementation
    ↓
Local testing
    ↓
Git
    ↓
GitHub
```

Later this will include Docker and CI/CD workflows.

---

## `coding-standards.md`

Contains project-specific coding rules.

For example:

- TypeScript conventions
- Naming
- Component conventions
- API conventions
- Error handling
- Testing expectations

We don't need to fully define this yet.

---

## `current-feature.md`

This is a working context file.

It can describe the feature Claude is currently implementing.

For example:

```text
Current Feature:
Add Expense

Status:
In development

Relevant specification:
specs/01-add-expense.md
```

This prevents Claude from needing to infer the current task from the entire project.

---

# 8. Feature Specifications

The `specs/` directory is where we will eventually put the detailed feature instructions for Claude Code.

```text
specs/
├── 01-add-expense.md
├── 02-view-expenses.md
└── 03-delete-expense.md
```

Each specification should describe a feature in enough detail that Claude can implement it without guessing.

For example:

```text
01-add-expense.md

Purpose
Requirements
User flow
UI requirements
API requirements
Data model
Validation
Error handling
Testing requirements
Acceptance criteria
```

These files will be created **after we finish the architecture and project structure**.

We should not generate detailed feature specs yet because some architectural decisions are still pending.

---

# 9. Root `CLAUDE.md`

The root `CLAUDE.md` is Claude Code's primary project instruction/context file.

Conceptually:

```text
CLAUDE.md
    │
    ├── Project purpose
    ├── Architecture
    ├── Technology
    ├── Important rules
    ├── Development workflow
    └── References to context/spec files
```

Claude should use this as the starting point when working on the repository.

The root file should **not become a giant document containing every project detail**.

Instead, it should provide the high-level rules and point Claude toward the appropriate context/specification files.

---

# 10. Environment Configuration

At the repository root we will have:

```text
.env.example
```

This documents the environment variables required by the application without exposing real secrets.

For example, conceptually:

```text
MONGODB_URI=...
PORT=...
```

The actual values will not be committed.

The exact environment variables and environment strategy will be finalized later.

---

# 11. `.gitignore`

The root `.gitignore` should prevent things such as:

```text
node_modules/
.env
dist/
coverage/
```

from being committed.

The exact rules will be finalized when the project is initialized.

---

# 12. README

The root:

```text
README.md
```

will eventually explain:

- What the project is
- How to run it locally
- How Docker works in this project
- How CI/CD works
- How deployment works
- Important commands
- Architecture overview

The README is primarily for humans.

`CLAUDE.md` and `context/` are primarily for the AI-assisted development workflow.

---

# 13. Why We Are Using This Structure

The repository is deliberately divided into four concerns:

```text
                  expense-tracker/
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    Application      Knowledge        Automation
        │                │                │
   frontend/          context/       .github/
   backend/           specs/         Docker
                                      CI/CD
                         │
                         ▼
                      Claude
```

### Application

```text
frontend/
backend/
```

Contains the actual product.

### Knowledge

```text
context/
specs/
CLAUDE.md
README.md
```

Contains information needed by humans and Claude Code.

### Infrastructure / Automation

```text
Docker
docker-compose.yml
.github/workflows/
```

Contains the systems that build, package, test, and deploy the application.

---

# 14. What Is Decided Now

These decisions are currently established:

### Repository

- Monorepo

### Frontend

- React
- TypeScript

### Backend

- Node.js
- Express
- TypeScript

### Database

- MongoDB

### Application scope

- Add expense
- View expenses
- Delete expense

### DevOps learning

- Docker
- Docker Compose
- GitHub Actions
- Container Registry
- Linux production server
- Nginx
- Health checks
- Logging
- Rollbacks

### Documentation

- Root `CLAUDE.md`
- `context/`
- `specs/`

---

# 15. What Is Still TBD

We intentionally haven't decided:

- Exact frontend framework setup
- Exact backend folder structure
- Exact API response format
- Exact MongoDB schema
- Exact Dockerfile strategy
- Development Docker setup
- Production Docker setup
- Docker networking details
- Exact container ports
- Container image naming
- Container Registry configuration
- Production cloud/VPS provider
- Server configuration
- Nginx configuration
- Deployment strategy
- Rollback mechanism
- Monitoring implementation
- Secret management strategy

These should be decided at the appropriate stage instead of guessing now.

---

# 16. Development-to-Production Structure

Eventually, the repository should support this complete flow:

```text
                    SOURCE CODE
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
          frontend/             backend/
              │                     │
              └──────────┬──────────┘
                         ▼
                       Git
                         │
                         ▼
                      GitHub
                         │
                         ▼
                  GitHub Actions
                         │
                ┌────────┴────────┐
                ▼                 ▼
               CI                CD
                │                 │
              Test             Docker
              Build              │
                │                 ▼
                │        Container Registry
                │                 │
                │                 ▼
                │        Production Server
                │                 │
                │               Docker
                │                 │
                │        ┌────────┼────────┐
                │        ▼        ▼        ▼
                │    Frontend  Backend  MongoDB
                │
                └─────── PASS ────────────┘
```

This repository structure exists to support that lifecycle.

---

# Step 4 — Summary

We now have a proposed monorepo structure:

```text
expense-tracker/
│
├── frontend/
├── backend/
├── context/
├── specs/
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── CLAUDE.md
└── README.md
```

The most important principle is:

> **Don't let the repository become more complicated than the application requires.**

The infrastructure will already introduce enough complexity.

Our application should stay small so that we can spend our time understanding **Docker, CI/CD, deployment, and production**.

---

# Next Step — Step 5

Before generating feature specifications, we should make one final architectural decision:

## Detailed Application Architecture

We will define:

1. Frontend responsibilities
2. Backend responsibilities
3. API endpoints
4. MongoDB data model
5. Request/response format
6. Error handling
7. Validation
8. Frontend ↔ backend communication
9. Development environment
10. Production environment

After that, the architecture will be stable enough to start generating the **feature-wise specification files for Claude Code**.
