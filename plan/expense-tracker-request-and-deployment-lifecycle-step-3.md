# Expense Tracker — Step 3: Request Lifecycle + Deployment Lifecycle

Now we move from **"what components exist?"** to **"what actually happens?"**

There are two flows we need to understand:

1. **Request lifecycle** — what happens when a user interacts with the application.
2. **Deployment lifecycle** — what happens when you change code and push it toward production.

These two flows are the core of understanding an end-to-end application.

---

# Part A — Request Lifecycle

Let's take the most important operation:

> User adds an expense.

Suppose the user enters:

```text
Amount:       €25
Category:     Food
Description:  Lunch
Date:         18 Sep 2026
```

and clicks **Add Expense**.

The complete flow is:

```text
User
 │
 │  Click "Add Expense"
 ▼
React Frontend
 │
 │  HTTP POST /api/expenses
 ▼
Express Backend
 │
 │  Route
 ▼
Controller
 │
 │  Validate data
 ▼
Service / Business Logic
 │
 │  Save expense
 ▼
MongoDB
 │
 │  Insert document
 ▼
Backend
 │
 │  HTTP Response
 ▼
React Frontend
 │
 │  Update UI
 ▼
User
```

Let's break that down.

---

## 1. User Interaction

The user fills out the form:

```text
Amount       → 25
Category     → Food
Description  → Lunch
Date         → 18 Sep 2026
```

Then:

```text
[ Add Expense ]
```

The browser doesn't directly communicate with MongoDB.

Instead, React sends a request to our backend.

---

# 2. React Frontend

The React application collects the form data.

Conceptually:

```text
Form
 │
 ▼
React Event Handler
 │
 ▼
API Request
```

The frontend sends something like:

```http
POST /api/expenses
Content-Type: application/json
```

with:

```json
{
  "amount": 25,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-09-18"
}
```

The important concept:

> **The frontend should not directly access MongoDB.**

The backend is responsible for communicating with the database.

---

# 3. Request Reaches Express

The request reaches our Node.js/Express backend.

Conceptually:

```text
POST /api/expenses
        │
        ▼
Express Router
```

The router determines:

> "This request belongs to the create-expense endpoint."

For example:

```text
/api/expenses
```

could be connected to a controller responsible for creating expenses.

---

# 4. Controller

The controller receives the request.

Conceptually:

```text
Request
  ↓
Controller
```

The controller extracts the submitted data:

```text
amount
category
description
date
```

It also participates in request validation.

For example:

```text
Is amount present?
Is amount a valid number?
Is category present?
Is date valid?
```

If the request is invalid:

```text
Request
  ↓
Validation
  ↓
❌ Invalid
  ↓
400 Bad Request
```

The request doesn't continue to MongoDB.

---

# 5. Business Logic

For this deliberately small project, we may or may not need a separate service layer.

This is something we'll decide when defining the detailed architecture.

The important concept is:

```text
HTTP request
     ↓
Application logic
     ↓
Database operation
```

We shouldn't blindly create:

```text
Controller
Service
Repository
Factory
Adapter
Manager
Helper
```

just because that's what some enterprise architecture diagram shows.

This is a small application.

We'll introduce abstractions when they provide a learning or maintainability benefit.

---

# 6. MongoDB

Eventually the backend sends the data to MongoDB.

Conceptually:

```text
Backend
   │
   │ MongoDB Driver / ODM
   ▼
MongoDB
   │
   ▼
expenses collection
```

A document could look roughly like:

```json
{
  "_id": "...",
  "amount": 25,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-09-18"
}
```

MongoDB stores the expense.

---

# 7. MongoDB Responds

MongoDB confirms that the operation succeeded.

The response travels back:

```text
MongoDB
   │
   ▼
Backend
```

The backend then creates an HTTP response.

For example:

```http
201 Created
```

with the newly created expense.

---

# 8. React Receives the Response

The frontend receives:

```text
HTTP Response
     ↓
React
```

React can then update its state.

Conceptually:

```text
API Response
     ↓
Update React State
     ↓
Re-render
     ↓
Expense appears in UI
```

The user now sees:

```text
18 Sep | Food | Lunch | €25
```

---

# 9. Complete Add-Expense Lifecycle

Putting everything together:

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ Click Add Expense
       ▼
┌──────────────┐
│    React     │
│   Frontend   │
└──────┬───────┘
       │
       │ POST /api/expenses
       ▼
┌──────────────┐
│   Express    │
│    Router    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller  │
└──────┬───────┘
       │
       │ Validate / process
       ▼
┌──────────────┐
│ Application  │
│    Logic     │
└──────┬───────┘
       │
       │ Insert
       ▼
┌──────────────┐
│   MongoDB    │
└──────┬───────┘
       │
       │ Result
       ▼
┌──────────────┐
│    Backend   │
└──────┬───────┘
       │
       │ 201 Created
       ▼
┌──────────────┐
│    React     │
└──────┬───────┘
       │
       │ Update state
       ▼
┌──────────────┐
│ Updated UI   │
└──────────────┘
```

That's our **request lifecycle**.

---

# Part B — What Happens When Viewing Expenses?

The read operation is simpler.

```text
User opens application
        ↓
React
        ↓
GET /api/expenses
        ↓
Express
        ↓
Controller
        ↓
MongoDB
        ↓
Expenses returned
        ↓
Express response
        ↓
React
        ↓
Display expenses
```

More visually:

```text
Browser
   │
   │ GET /api/expenses
   ▼
React → Express → MongoDB
                    │
                    ▼
                 Expenses
                    │
                    ▼
React ← Express ← MongoDB
   │
   ▼
Display list
```

---

# Part C — Delete Lifecycle

Delete follows a similar pattern:

```text
User
 │
 │ Click Delete
 ▼
React
 │
 │ DELETE /api/expenses/:id
 ▼
Express
 │
 ▼
Controller
 │
 ▼
MongoDB
 │
 │ Delete document
 ▼
Backend
 │
 │ Success response
 ▼
React
 │
 │ Remove/update state
 ▼
Updated UI
```

So our application has three fundamental request flows:

```text
CREATE
POST   /api/expenses

READ
GET    /api/expenses

DELETE
DELETE /api/expenses/:id
```

This will be enough application functionality for our initial project.

---

# Part D — Deployment Lifecycle

Now we move to the more important part for your goal.

Imagine you have changed the application.

You modify some React code and want that change to reach production.

What happens?

---

## 1. Developer Changes Code

You make a change locally:

```text
Developer
    │
    ▼
Source Code
```

You test it locally.

Eventually:

```bash
git add .
git commit
git push
```

---

# 2. GitHub Receives the Code

```text
Your Computer
      │
      │ git push
      ▼
   GitHub
```

GitHub now contains the new version of your code.

But we **don't immediately trust it**.

This is where CI begins.

---

# 3. GitHub Actions Starts CI

GitHub Actions detects the relevant event.

For example:

```text
Push / Pull Request
        ↓
GitHub Actions
```

The workflow might perform:

```text
Install dependencies
        ↓
Lint
        ↓
Run tests
        ↓
Build frontend
        ↓
Build backend
```

Potentially:

```text
Docker build
```

as well.

---

# 4. CI Result

If something fails:

```text
Code
 ↓
CI
 ↓
❌ FAILED
```

For example:

```text
Tests
  ↓
2 failed
```

We don't want that version deployed.

If everything passes:

```text
Code
 ↓
CI
 ↓
✅ PASSED
```

Now we're allowed to continue toward deployment.

---

# 5. Build Docker Images

Now Docker becomes important.

We create container images.

Conceptually:

```text
Source Code
    │
    ▼
Dockerfile
    │
    ▼
Docker Build
    │
    ├──────────────┐
    ▼              ▼
Frontend Image   Backend Image
```

For example:

```text
expense-tracker-frontend:version
expense-tracker-backend:version
```

The exact naming convention is **TBD**.

---

# 6. Push Images to Container Registry

The images need somewhere to live.

So:

```text
GitHub Actions
      │
      ▼
Docker Images
      │
      ▼
Container Registry
```

We'll likely learn **GitHub Container Registry (GHCR)** as part of this project.

The important concept is:

> A container registry stores container images so that servers can pull specific versions of those images.

---

# 7. Production Server

Our production server then needs to get the new image.

Conceptually:

```text
Container Registry
        │
        │ pull
        ▼
Production Server
```

The server downloads the required image.

---

# 8. Docker Runs the New Version

The production server uses Docker to run the containers.

Conceptually:

```text
Production Server

Docker
 │
 ├── Frontend Container
 │
 ├── Backend Container
 │
 └── MongoDB Container
```

When a new version is deployed:

```text
Old Backend Container
        ↓
New Backend Image
        ↓
New Backend Container
```

The exact update strategy will be decided later.

---

# 9. Health Check

We don't want to assume:

> "The container started, therefore the application works."

Instead, we can eventually have health checks.

Conceptually:

```text
Deploy
  ↓
Container starts
  ↓
Health check
  ↓
Is application responding?
  │
  ├── YES → Deployment successful
  │
  └── NO  → Deployment failed
```

This becomes particularly useful when we learn rollback strategies.

---

# 10. Complete Deployment Lifecycle

Putting everything together:

```text
                    Developer
                        │
                        │ Code
                        ▼
                    Local Git
                        │
                        │ git push
                        ▼
                     GitHub
                        │
                        ▼
                 GitHub Actions
                        │
                 ┌──────┴──────┐
                 │             │
                 ▼             ▼
              Lint/Test      Build
                 │             │
                 └──────┬──────┘
                        │
                     CI PASS
                        │
                        ▼
                  Docker Build
                        │
                  ┌─────┴─────┐
                  ▼           ▼
             Frontend      Backend
               Image         Image
                  │           │
                  └─────┬─────┘
                        │
                        ▼
               Container Registry
                        │
                        │ Pull
                        ▼
                Production Server
                        │
                        ▼
                      Docker
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
         Frontend    Backend    MongoDB
         Container   Container  Container
                        │
                        ▼
                   Health Check
                        │
                        ▼
                   Application
```

---

# Part E — The Critical Distinction

There are actually **two completely different flows** happening in our project.

## Runtime flow

This happens when the application is already running:

```text
USER
 ↓
FRONTEND
 ↓
BACKEND
 ↓
DATABASE
 ↓
BACKEND
 ↓
FRONTEND
 ↓
USER
```

## Deployment flow

This happens when we're delivering a new version:

```text
DEVELOPER
 ↓
GITHUB
 ↓
CI
 ↓
DOCKER BUILD
 ↓
CONTAINER REGISTRY
 ↓
SERVER
 ↓
DOCKER
 ↓
APPLICATION
```

Don't mix these two.

That's one of the most common sources of confusion when people start learning DevOps.

---

# Part F — Where Docker Fits

Notice something important.

Docker isn't the entire deployment process.

Docker is one component:

```text
                    CI/CD
                      │
          ┌───────────┴───────────┐
          │                       │
         CI                      CD
          │                       │
       Tests                  Deployment
          │                       │
          └───────────┬───────────┘
                      │
                    Docker
                      │
            Containerized App
```

Docker solves the problem of **packaging and running applications consistently**.

GitHub Actions solves the problem of **automating workflows**.

A container registry solves the problem of **storing and distributing container images**.

A Linux server provides the **machine/environment where the application runs**.

Nginx can act as the **web server/reverse proxy and entry point**.

Each piece has a different responsibility.

---

# Step 3 — What We Have Learned

We now have two complete mental models.

### Application

```text
Browser
   ↓
React
   ↓
Express
   ↓
MongoDB
```

### Delivery

```text
Developer
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Docker
   ↓
Container Registry
   ↓
Production Server
   ↓
Docker Containers
```

And the eventual system combines them:

```text
                     DELIVERY
                        │
Developer → GitHub → CI/CD → Docker → Server
                                      │
                                      ▼
                                  APPLICATION
                                      │
                              ┌───────┴───────┐
                              ▼               ▼
                           React           Express
                                              │
                                              ▼
                                           MongoDB
```

## Next: Step 4 — Project Structure

Now that we understand **what the system does and how information/code moves**, we can design the repository.

We'll decide:

- Monorepo structure
- `frontend/`
- `backend/`
- Docker-related files
- GitHub Actions location
- Environment configuration
- Documentation/context files
- Where feature specs will live
- What Claude Code is allowed to modify

**Only after that will we start writing the feature specifications for Claude Code.**
