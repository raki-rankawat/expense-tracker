# Expense Tracker — Docker & CI/CD Learning Project

## 1. Project Definition

### Project: Expense Tracker

The application will be deliberately small. The goal is **not** to build a feature-rich expense management product.

The application exists mainly to give us a realistic codebase on which to learn:

- Docker
- Docker Compose
- CI/CD
- Container registries
- Linux/server deployment
- Production configuration
- Health checks
- Logging
- Rollbacks
- Basic monitoring

We already know how to build a MERN application and deploy it using platforms such as Render. Therefore, we will avoid spending too much time on application features.

---

## 2. Minimal Application Features

The application will have only three core features.

### 2.1 Add an Expense

The user can enter:

```text
Amount:       €25
Category:     Food
Description:  Lunch
Date:         18 Sep 2026
```

After clicking **Add Expense**, the frontend sends the data to the backend and the backend stores it in MongoDB.

### 2.2 View Expenses

The user can see a simple list:

```text
Expenses
────────────────────────────────────
Date         Category    Description    Amount
18 Sep       Food        Lunch           €25
17 Sep       Travel      Metro           €3
16 Sep       Bills       Internet        €30
```

### 2.3 Delete an Expense

Each expense will have a delete action:

```text
[ Delete ]
```

That's enough.

We will deliberately avoid:

- Authentication
- User registration
- Budgets
- Recurring expenses
- Charts
- Notifications
- CSV/PDF exports
- Complex filtering
- Multiple currencies
- Admin dashboards

These features would distract from the main learning objective.

---

# 3. Technology Stack

We will use technologies that are already familiar where possible.

## Application

```text
Frontend
React + TypeScript
       │
       │ REST API
       ▼
Backend
Node.js + Express + TypeScript
       │
       ▼
Database
MongoDB
```

## DevOps / Infrastructure

```text
Docker
Docker Compose
Git
GitHub
GitHub Actions
GitHub Container Registry
Nginx
Linux Server
```

Later we may introduce:

```text
Health Checks
Logging
Monitoring
Rollback Strategy
```

---

# 4. High-Level Application Architecture

The basic application will look like:

```text
┌──────────────────────┐
│                      │
│    React Frontend    │
│                      │
└──────────┬───────────┘
           │
           │ HTTP / REST API
           ▼
┌──────────────────────┐
│                      │
│   Express Backend    │
│                      │
└──────────┬───────────┘
           │
           │ MongoDB Driver
           ▼
┌──────────────────────┐
│                      │
│       MongoDB        │
│                      │
└──────────────────────┘
```

The application itself is intentionally simple.

The complexity will come later from how we build, package, test, deploy, and operate it.

---

# 5. Docker Architecture

Once the application works locally, we will containerize it.

The local Docker environment will eventually look like:

```text
┌─────────────────────────────────────────────┐
│              Docker Compose                 │
│                                             │
│   ┌────────────┐      ┌──────────────┐     │
│   │            │      │              │     │
│   │  Frontend  │ ──── │   Backend    │     │
│   │ Container  │ HTTP │  Container   │     │
│   │            │      │              │     │
│   └────────────┘      └──────┬───────┘     │
│                              │             │
│                              │ MongoDB     │
│                              ▼             │
│                       ┌──────────────┐     │
│                       │              │     │
│                       │   MongoDB    │     │
│                       │  Container   │     │
│                       │              │     │
│                       └──────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

We will learn:

- What a Docker image is
- What a Docker container is
- Dockerfile
- `.dockerignore`
- Docker Compose
- Docker networks
- Docker volumes
- Environment variables
- Container-to-container communication
- Multi-stage builds
- Development containers
- Production containers
- Image tagging
- Container registries

---

# 6. CI — Continuous Integration

Every Pull Request should eventually go through an automated pipeline.

The basic flow:

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Install dependencies
    │
    ├── Lint
    │
    ├── Run tests
    │
    ├── Build application
    │
    └── Build Docker image
```

If something fails:

```text
❌ CI FAILED
```

The goal is to understand how automated verification works rather than manually checking everything before deployment.

---

# 7. Container Registry

After CI, we will introduce a container registry.

For example:

```text
GitHub
   │
   ▼
GitHub Actions
   │
   ▼
Build Docker Image
   │
   ▼
GitHub Container Registry
```

We will learn:

- Why images need to be stored in a registry
- Image tags
- Versioning
- Pulling images
- Pushing images
- Registry authentication
- Using immutable versions
- Why production servers should not need the source repository just to run the application

---

# 8. CD — Continuous Deployment

After CI and the container registry are working, we will introduce deployment automation.

The eventual flow:

```text
Developer
    │
    ▼
Push / Merge to main
    │
    ▼
GitHub Actions
    │
    ▼
Run CI
    │
    ▼
Build Docker Images
    │
    ▼
Push Images to Registry
    │
    ▼
Production Server
    │
    ▼
Pull New Images
    │
    ▼
Restart / Update Containers
    │
    ▼
Health Check
    │
    ▼
Application Updated
```

The goal is to understand the complete journey from source code to a running production application.

---

# 9. Production Architecture

Eventually the production environment can look roughly like:

```text
                         Internet
                            │
                            ▼
                         Nginx
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
        React Container        API Container
                                       │
                                       ▼
                                MongoDB Container
```

The production server will run Linux and Docker.

We will learn what actually happens on the server instead of hiding the deployment process behind a PaaS.

---

# 10. Production Concepts

Once basic deployment works, we will introduce real production concerns.

## Environment Variables

For example:

```text
MONGO_URI
API_URL
NODE_ENV
PORT
```

We will learn the difference between:

- Local configuration
- CI configuration
- Production configuration
- Secrets

## Health Checks

We should be able to determine whether the application is actually working.

For example:

```text
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

The deployment pipeline can use this to verify that the new version started successfully.

## Logging

We will learn how to inspect:

```text
Application logs
Container logs
Nginx logs
Docker logs
```

For example:

```bash
docker logs backend
```

## Restart Policies

We will understand what happens if a container crashes and how Docker can automatically restart it.

## Persistent Storage

MongoDB data should not disappear simply because a container was recreated.

We will learn how Docker volumes solve this problem.

## Rollbacks

We will deliberately deploy a bad version and learn how to return to a previous image.

For example:

```text
v1.0
 │
 ▼
Production
 │
 ▼
v1.1
 │
 ▼
Something breaks
 │
 ▼
Rollback
 │
 ▼
v1.0
```

---

# 11. Learning Philosophy

For every technology we introduce, we should understand three things.

## 1. What is it?

Example:

> What is Docker Compose?

## 2. Why do we need it?

Example:

> Why can't we simply run `npm start` for everything?

## 3. What actually happens?

Example:

> What happens internally when I run `docker compose up`?

The third question is particularly important.

The goal is not to memorize commands.

The goal is to understand the system well enough that we can troubleshoot it when something goes wrong.

---

# 12. Development Lifecycle We Are Building Toward

The complete mental model should eventually be:

```text
                         Developer
                             │
                             ▼
                         Local Code
                             │
                             ▼
                            Git
                             │
                             ▼
                          GitHub
                             │
                             ▼
                     GitHub Actions
                     ┌───────┴───────┐
                     │               │
                    CI              CD
                     │               │
              Test / Build        Deploy
                     │               │
                     └───────┬───────┘
                             ▼
                       Docker Image
                             │
                             ▼
                    Container Registry
                             │
                             ▼
                        Linux Server
                             │
                             ▼
                           Docker
                             │
                    ┌────────┼────────┐
                    ▼        ▼        ▼
                Frontend  Backend   Database
                    │        │
                    └────────┘
                         │
                         ▼
                        User
```

This is the real learning objective.

The Expense Tracker is simply the application we use to understand this lifecycle.

---

# 13. Project Repository

We will initially use a single repository:

```text
expense-tracker/
│
├── frontend/
│
├── backend/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

We will decide the exact structure later.

We should not over-engineer the repository before the architecture is finalized.

---

# 14. Planned Learning Sequence

We will proceed in this order:

```text
Step 1
Project Scope
        ↓
Step 2
High-Level Architecture
        ↓
Step 3
Request Lifecycle / Data Flow
        ↓
Step 4
Project Structure
        ↓
Step 5
Feature Specifications
        ↓
Step 6
Build Minimal MERN Application
        ↓
Step 7
Dockerize Application
        ↓
Step 8
Docker Compose
        ↓
Step 9
Development vs Production Containers
        ↓
Step 10
GitHub Actions / CI
        ↓
Step 11
Docker Image Registry
        ↓
Step 12
Production Linux Server
        ↓
Step 13
Continuous Deployment
        ↓
Step 14
Nginx / Reverse Proxy
        ↓
Step 15
Health Checks / Logs / Volumes
        ↓
Step 16
Rollback Strategy
        ↓
Step 17
Basic Monitoring
        ↓
Step 18
Complete End-to-End Workflow
```

---

# 15. Important Constraint

We should continuously ask:

> **Does this feature help us learn Docker, CI/CD, deployment, or production engineering?**

If the answer is no, we probably don't need the feature.

The project should remain small enough that the majority of our time is spent understanding the **development and deployment lifecycle**, not writing business logic.

---

# Next Step

The next step is **High-Level Architecture**.

We will define:

1. Application components
2. Frontend/backend/database responsibilities
3. How components communicate
4. Local development architecture
5. Docker development architecture
6. Production architecture
7. CI pipeline
8. CD pipeline
9. How all of these environments relate to each other

Only after that architecture is clear will we move toward the feature-wise specification files for Claude Code.
