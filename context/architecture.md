# Expense Tracker — Architecture

## High-Level Architecture

```text
Browser
   ↓
React + TypeScript + Vite
   ↓ HTTP / REST
Node.js + Express + TypeScript
   ↓
Mongoose
   ↓
MongoDB
```

## Components

### Frontend

Responsible for:

- rendering the UI
- collecting user input
- client-side validation for user experience
- calling backend APIs
- displaying loading, success, empty, and error states
- maintaining the current UI state

### Backend

Responsible for:

- exposing REST APIs
- validating incoming requests
- applying application rules
- communicating with MongoDB
- returning appropriate HTTP responses
- exposing a health endpoint

### Database

MongoDB stores expenses.

Mongoose is used as the ODM between the Node.js application and MongoDB.

## Expense Data

```text
Expense
├── id
├── amount
├── category
├── description
└── date
```

Money is stored as integer minor units.

Example:

```text
€25.50 → 2550
```

Avoid floating-point storage for monetary values.

## API

```text
POST   /api/expenses
GET    /api/expenses
DELETE /api/expenses/:id
GET    /api/health
```

## Runtime Request Flow

### Create

```text
Browser
 ↓
React form
 ↓
POST /api/expenses
 ↓
Express route
 ↓
Backend validation / logic
 ↓
Mongoose
 ↓
MongoDB
 ↓
Backend response
 ↓
React state update
 ↓
Updated UI
```

### Read

```text
React
 ↓
GET /api/expenses
 ↓
Express
 ↓
Mongoose
 ↓
MongoDB
 ↓
Response
 ↓
React
 ↓
Expense list
```

### Delete

```text
React
 ↓
DELETE /api/expenses/:id
 ↓
Express
 ↓
Mongoose
 ↓
MongoDB
 ↓
204 No Content
 ↓
React removes item
```

## Development Environment

Local development runs in three containers on one Compose network:

```text
[ frontend ]  Vite dev server, source bind-mounted, /api proxied to backend
     ↓
[ backend  ]  Express, hot reload, MONGODB_URI=mongodb://mongo:27017/expense_tracker
     ↓
[ mongo    ]  pinned image, named volume for data
```

Notes that matter:

- Services address each other by service name. `localhost` inside a container is
  that container.
- `node_modules` lives in the image, with an anonymous volume preventing the host
  bind mount from shadowing it.
- Both Dockerfiles have a `dev` target (watchers, source mounted) and a `prod`
  target (compiled output, no source, non-root). They are different enough that a
  change working in one must be checked in the other.
- The Vite `/api` proxy exists only in `dev`. Production routing is a separate
  decision, recorded below once feature 05 makes it.

## Production Routing Decision

> Recorded in feature 05. Either a reverse-proxy rule in the frontend's static
> server, or a build-time API base URL inlined by Vite. State which, and why.

## Production Database Decision

> Recorded in feature 06. The Compose `mongo` service is local development only.

## Deployment Flow

Runtime architecture and deployment architecture are different concepts.

Deployment lifecycle:

```text
Developer
 ↓
Git
 ↓
GitHub
 ↓
GitHub Actions
 ↓
Lint / Test / Build / Docker validation
 ↓
Container Registry
 ↓
Render
 ↓
Running application
```

Do not assume the production architecture is identical to local Docker Compose.

Local MongoDB may run in Docker for learning. Production database hosting is a separate deployment decision.

Do not assume a VPS or manually managed Nginx server. Render is the current production target.

## Design Principle

Prefer the simplest architecture that satisfies the requirements.

Do not introduce extra services, queues, caches, state-management systems, or abstraction layers unless there is a concrete requirement.
