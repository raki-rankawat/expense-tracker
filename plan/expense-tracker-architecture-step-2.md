# Expense Tracker — Step 2: High-Level Architecture

## Project Goal

The application is a deliberately minimal **MERN Expense Tracker**.

The main goal is **not** to build a feature-rich expense application. The main goal is to use a small, realistic application to learn the **full development lifecycle**, especially:

- Docker
- Docker Compose
- CI/CD
- GitHub Actions
- Container Registry
- Linux production deployment
- Nginx
- Health checks
- Logging
- Rollbacks

The application should remain simple so that infrastructure and deployment remain the primary learning focus.

---

# 1. Overall Architecture

At a high level:

```text
                         ┌──────────────────┐
                         │      User        │
                         │    Web Browser   │
                         └────────┬─────────┘
                                  │
                                  │ HTTP
                                  ▼
                         ┌──────────────────┐
                         │     Frontend     │
                         │ React + TypeScript│
                         └────────┬─────────┘
                                  │
                                  │ REST API
                                  ▼
                         ┌──────────────────┐
                         │      Backend     │
                         │ Node + Express   │
                         └────────┬─────────┘
                                  │
                                  │ MongoDB Driver
                                  ▼
                         ┌──────────────────┐
                         │     MongoDB      │
                         │    Database      │
                         └──────────────────┘
```

This represents the **application architecture**.

The project will also have a second layer around the application for development, CI/CD, Docker, and production deployment.

---

# 2. Development Architecture

On the local machine:

```text
                    Your Computer
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
         Source Code              Git
              │                     │
              │                     ▼
              │                  GitHub
              │
              ▼
       Docker Compose
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
    Frontend Backend MongoDB
   Container Container Container
```

Docker Compose will eventually allow the complete application stack to run locally with a single command:

```bash
docker compose up
```

Instead of manually starting React, Node, and MongoDB separately.

---

# 3. Production Architecture

Production will introduce another layer.

Eventually we expect something conceptually similar to:

```text
                         INTERNET
                            │
                            ▼
                         NGINX
                            │
                    ┌───────┴───────┐
                    │               │
                    ▼               ▼
               Frontend          Backend
               Container         Container
                                    │
                                    ▼
                              MongoDB
                              Container
```

The exact production setup is **TBD** for now.

We have not yet decided whether the production server will use:

- AWS
- Azure
- DigitalOcean
- Hetzner
- Another VPS
- Another deployment platform

Do not make this decision prematurely.

The important learning objective is to understand what a **Linux server + Docker-based production deployment** looks like.

---

# 4. Where CI/CD Fits

GitHub Actions will eventually sit between GitHub and our deployment process.

```text
                         DEVELOPER
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
                    ┌────────┴────────┐
                    │                 │
                   CI                CD
                    │                 │
             ┌──────┴──────┐          │
             │             │          │
           Tests         Build        │
             │             │          │
             └──────┬──────┘          │
                    │                 │
                    ▼                 ▼
                  PASS          Docker Image
                                      │
                                      ▼
                              Container Registry
                                      │
                                      ▼
                                Production
```

## CI — Continuous Integration

CI is primarily concerned with:

> Is this code safe to integrate?

For example:

```text
Pull Request
     ↓
Install dependencies
     ↓
Lint
     ↓
Run tests
     ↓
Build
     ↓
Docker build
```

## CD — Continuous Delivery / Deployment

CD is primarily concerned with:

> How do we get approved code into the target environment?

Eventually:

```text
main
 ↓
Build Docker image
 ↓
Push image
 ↓
Production server
 ↓
Pull new image
 ↓
Restart/update containers
 ↓
Health check
```

CI and CD should be understood as separate concepts even though they can be implemented through the same GitHub Actions system.

---

# 5. Complete End-to-End Picture

The target architecture is:

```text
                         ┌───────────────┐
                         │   Developer   │
                         └───────┬───────┘
                                 │
                              Git Push
                                 │
                                 ▼
                         ┌───────────────┐
                         │    GitHub     │
                         └───────┬───────┘
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   GitHub Actions    │
                      │                     │
                      │  Lint              │
                      │  Test              │
                      │  Build             │
                      │  Docker Build      │
                      └──────────┬──────────┘
                                 │
                              CI PASS
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │ Container Registry  │
                      │                     │
                      │ Frontend Image      │
                      │ Backend Image       │
                      └──────────┬──────────┘
                                 │
                              Deploy
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Linux Server        │
                    │                         │
                    │        NGINX            │
                    │           │             │
                    │    ┌──────┴──────┐      │
                    │    ▼             ▼      │
                    │ Frontend       Backend  │
                    │ Container      Container│
                    │                   │      │
                    │                   ▼      │
                    │                MongoDB   │
                    │                Container │
                    └─────────────────────────┘
                                 │
                                 ▼
                              USER
```

This is the **target architecture**, not something that will be implemented all at once.

---

# 6. Environments

We should think in terms of three environments.

## Local

```text
Developer
   ↓
Docker Compose
   ↓
Frontend + Backend + MongoDB
```

Used for development and learning.

## CI

```text
GitHub Actions
   ↓
Tests
Build
Docker validation
```

Used to automatically verify changes.

## Production

```text
Linux Server
   ↓
Docker
   ↓
Application
```

Used by real users.

The overall idea is:

```text
LOCAL  →  CI  →  PRODUCTION
```

One of the main goals of this project is to understand how code moves through these environments.

---

# 7. What We Are NOT Deciding Yet

At this stage, do **not** finalize:

- Exact cloud provider
- Exact server configuration
- Exact ports
- Nginx configuration
- Dockerfile implementation
- Docker Compose implementation
- GitHub Actions YAML
- MongoDB credentials
- Secrets management
- Deployment scripts
- Monitoring stack
- Exact folder structure

These decisions will be made in later steps.

The purpose of this stage is to understand the architecture before implementation.

---

# 8. The Three Flows We Will Document

We will eventually create three important diagrams for this project.

## A. Architecture Diagram

Answers:

> What components exist?

```text
Browser
 ↓
React
 ↓
Express
 ↓
MongoDB
```

---

## B. Request Lifecycle

Answers:

> How does data travel through the application?

For example, when adding an expense:

```text
User
 ↓
React Form
 ↓
POST /expenses
 ↓
Express Route
 ↓
Controller
 ↓
MongoDB
 ↓
Response
 ↓
React
 ↓
Updated UI
```

This will be documented in detail in a later step.

---

## C. Deployment / Development Flow

Answers:

> How does my code get from my laptop to production?

```text
Code
 ↓
Git
 ↓
GitHub
 ↓
GitHub Actions
 ↓
Tests
 ↓
Docker Build
 ↓
Container Registry
 ↓
Production Server
 ↓
Docker
 ↓
Running Application
```

This flow is especially important for the end-to-end developer goal.

---

# 9. Current Project Scope

## Application

**Expense Tracker**

## Frontend

- React
- TypeScript

## Backend

- Node.js
- Express
- TypeScript

## Database

- MongoDB

## DevOps / Infrastructure Learning

- Git
- GitHub
- Docker
- Docker Compose
- GitHub Actions
- Container Registry
- Linux Server
- Nginx
- Health Checks
- Logging
- Rollbacks

## Application Features

Only three initial features:

1. Add an expense
2. View expenses
3. Delete an expense

Example expense:

```text
Amount:       €25
Category:     Food
Description:  Lunch
Date:         18 Sep 2026
```

No authentication, budgets, charts, recurring expenses, exports, notifications, or other feature expansion unless there is a clear learning reason to add them.

---

# 10. Learning Philosophy

For every infrastructure technology we introduce, we should understand three things:

### 1. What is it?

Example:

> What does Docker Compose actually do?

### 2. Why do we need it?

Example:

> Why can't we just run `npm start`?

### 3. What happens underneath?

Example:

> When I run `docker compose up`, what actually happens?

The third question is especially important.

The objective is not to memorize deployment commands. The objective is to understand the system well enough to explain and troubleshoot it.

---

# 11. Planned Learning Sequence

We will follow this sequence:

```text
Project Scope
      ↓
High-Level Architecture
      ↓
Request Lifecycle
      ↓
Deployment Lifecycle
      ↓
Project Structure
      ↓
Feature Specifications
      ↓
Claude Code Implementation
      ↓
Docker
      ↓
Docker Compose
      ↓
CI
      ↓
Container Registry
      ↓
CD
      ↓
Production Server
      ↓
Nginx
      ↓
Health Checks
      ↓
Logging
      ↓
Rollback
```

We should avoid jumping ahead unnecessarily.

---

# Current Status

**Completed:**

- Project selected
- Minimal feature scope defined
- High-level application architecture defined
- Development architecture defined
- Target production architecture defined
- CI/CD position in the system defined
- Three major system flows identified

**Next step:**

> **Request Lifecycle + Deployment Lifecycle**

We will trace exactly what happens when the user clicks **Add Expense**, and separately what happens when code is pushed to GitHub and eventually reaches production.
