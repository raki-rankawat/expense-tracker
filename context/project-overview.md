# Expense Tracker — Project Overview

## Purpose

Expense Tracker is a deliberately small full-stack application.

The application is being built primarily as a learning project to understand the complete development lifecycle, especially Docker and CI/CD.

The application itself should remain simple so that infrastructure and deployment concepts remain the main focus.

## Functional Scope

The application supports:

- Add an expense
- View expenses
- Delete an expense
- Health check endpoint

## Out of Scope

Unless explicitly added later, do not implement:

- Authentication
- User accounts
- Budgets
- Reports
- Charts
- Search
- Pagination
- Filtering
- Recurring expenses
- Notifications
- File uploads
- Multi-currency support
- Category CRUD

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Native `fetch`

### Backend

- Node.js
- Express
- TypeScript
- Mongoose
- MongoDB

### Testing

- Jest
- React Testing Library
- Supertest

Tests belong to the feature slice that introduces the behaviour — there is no
separate testing phase.

### Tooling

- ESLint
- Prettier
- npm
- Git
- GitHub

### Infrastructure

- Docker (dev and prod image targets)
- Docker Compose (local development environment)
- GitHub Actions
- GitHub Container Registry
- Render
- MongoDB in a container locally; the production database is decided separately

## Repository

The project is a monorepo with separate frontend and backend applications.

Expected top-level structure:

```text
expense-tracker/
├── frontend/
│   ├── Dockerfile          # dev + prod targets
│   └── .dockerignore
├── backend/
│   ├── Dockerfile          # dev + prod targets
│   └── .dockerignore
├── context/
│   ├── features/           # one spec per cycle, plus the two templates
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ai-interaction.md
│   ├── coding-standards.md
│   └── current-feature.md
├── .github/workflows/      # ci.yml
├── docker-compose.yml
├── .env.example
├── .nvmrc
├── .gitignore
├── CLAUDE.md
└── README.md
```

There is no root `package.json`. `docker compose` is the entry point; each app
keeps its own dependencies inside its own image.

## How the Project Is Worked

The project is developed in Docker from the first feature. `docker compose up`
runs it; `docker compose exec` runs everything else.

Every spec in `context/features/` is one complete cycle — document, branch,
backend, frontend, tests, CI, merge, deploy, verify in production — run with
`/implement-feature`. Specs 00-07 build the environment and the pipeline and end
with the empty shell live on Render. Specs 08-10 are the application features,
each shipping through that pipeline. Spec 11 accepts the finished system.

The cycle is deliberately repeated rather than batched by layer: running it a
dozen times is the point. New features and bugs enter through `/new-spec`, which
writes the next numbered spec from a template.

See `context/ai-interaction.md` for the cycle in detail.

## Primary Learning Objective

The goal is not to build a feature-rich expense application.

The goal is to understand:

```text
Design
  ↓
Development
  ↓
Testing
  ↓
Docker
  ↓
CI
  ↓
Container Registry
  ↓
CD
  ↓
Deployment
  ↓
Health Checks
  ↓
Monitoring / Troubleshooting
```
