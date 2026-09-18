# Expense Tracker — Step 5: Detailed Application Architecture

Now we move one level deeper from the high-level architecture.

We already know:

```text
React → Express → MongoDB
```

Now we define how these three parts are organized and communicate.

The goal is to make enough decisions that our next step—creating feature specifications for Claude Code—doesn't leave important things ambiguous.

---

# 1. Application Architecture

The application has three main components:

```text
┌─────────────────────┐
│      Frontend       │
│  React + TypeScript │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│       Backend       │
│ Node + Express + TS │
└──────────┬──────────┘
           │
           │ MongoDB Driver
           ▼
┌─────────────────────┐
│      MongoDB        │
└─────────────────────┘
```

Each component has a clear responsibility.

---

# 2. Frontend Responsibility

The frontend is responsible for:

- Rendering the UI
- Collecting user input
- Client-side validation where appropriate
- Calling the backend API
- Displaying loading states
- Displaying errors
- Displaying expenses
- Updating the UI after create/delete operations

The frontend **does not communicate directly with MongoDB**.

```text
React
  │
  │ HTTP
  ▼
Backend API
```

---

# 3. Backend Responsibility

The backend is responsible for:

- Exposing the REST API
- Validating incoming requests
- Applying application/business rules
- Communicating with MongoDB
- Handling errors
- Returning consistent HTTP responses
- Providing health-check endpoints later

Conceptually:

```text
HTTP Request
     ↓
Express
     ↓
Validation
     ↓
Application Logic
     ↓
MongoDB
     ↓
HTTP Response
```

The backend is the boundary between the browser and the database.

---

# 4. Database Responsibility

MongoDB stores expense data.

We will have an `expenses` collection.

```text
MongoDB
   │
   └── expenses
          ├── Expense
          ├── Expense
          ├── Expense
          └── ...
```

An expense will contain only the information required by the application.

---

# 5. Expense Data Model

Our initial expense model is:

```text
Expense
├── id
├── amount
├── category
├── description
└── date
```

Conceptually:

```json
{
  "id": "some-id",
  "amount": 25,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-09-18"
}
```

| Field | Purpose |
|---|---|
| `id` | Unique identifier |
| `amount` | Expense amount |
| `category` | Expense category |
| `description` | Short description |
| `date` | Date of expense |

We intentionally don't add things such as:

```text
userId
currency
createdBy
updatedBy
receipt
location
paymentMethod
```

because we don't currently need them.

---

# 6. Amount Representation

We should not use floating-point arithmetic casually for monetary values.

For example:

```js
0.1 + 0.2 !== 0.3
```

For this project, we will use **integer minor units**.

For example:

```text
€25.50 → 2550
€10.00 → 1000
```

MongoDB stores:

```json
{
  "amount": 2550
}
```

The UI converts the value to normal currency formatting.

The application-level rule is:

> **Store monetary amounts as integer cents/minor units.**

---

# 7. Currency

For the initial version, we don't need multi-currency support.

We'll use one configured currency.

We should not introduce:

```text
currency conversion
exchange rates
multiple currencies
```

because they don't contribute to the Docker/CI/CD learning objective.

---

# 8. API Design

The initial API will have only three operations.

## Create Expense

```http
POST /api/expenses
```

Request:

```json
{
  "amount": 2500,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-09-18"
}
```

Response:

```http
201 Created
```

Example:

```json
{
  "id": "123",
  "amount": 2500,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-09-18"
}
```

---

# 9. Get Expenses

```http
GET /api/expenses
```

Response:

```http
200 OK
```

Example:

```json
[
  {
    "id": "123",
    "amount": 2500,
    "category": "Food",
    "description": "Lunch",
    "date": "2026-09-18"
  },
  {
    "id": "124",
    "amount": 300,
    "category": "Travel",
    "description": "Metro",
    "date": "2026-09-17"
  }
]
```

For the initial version, we don't need:

- Pagination
- Filtering
- Sorting
- Search

---

# 10. Delete Expense

```http
DELETE /api/expenses/:id
```

Example:

```http
DELETE /api/expenses/123
```

Successful response:

```http
204 No Content
```

No response body is necessary.

---

# 11. API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/expenses` | Create expense |
| `GET` | `/api/expenses` | Get expenses |
| `DELETE` | `/api/expenses/:id` | Delete expense |

---

# 12. Health Check API

We will eventually have:

```http
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

This is primarily an infrastructure feature.

Later Docker and deployment systems can use it to determine whether the backend is responding.

```text
Docker
  ↓
Health Check
  ↓
GET /api/health
  ↓
Backend
  ↓
Healthy?
```

---

# 13. HTTP Error Handling

The backend should use appropriate HTTP status codes.

| Status | Meaning |
|---|---|
| `201` | Resource created |
| `200` | Request successful |
| `204` | Resource deleted successfully |
| `400` | Invalid request |
| `404` | Resource not found |
| `500` | Unexpected server error |

We should also establish a consistent error response format.

For example:

```json
{
  "error": {
    "message": "Invalid expense data"
  }
}
```

The exact error schema can be finalized in the feature specifications.

---

# 14. Validation

Validation should happen on the backend even if the frontend also validates.

For example:

```text
amount
  ↓
Must exist
  ↓
Must be a positive integer
```

Category:

```text
Must be one of the supported categories
```

Description:

```text
Must satisfy defined length constraints
```

Date:

```text
Must be a valid date
```

Important principle:

> **Frontend validation improves user experience. Backend validation protects the API.**

We should never rely exclusively on frontend validation.

---

# 15. Categories

We need a small predefined category set.

Initial candidates:

```text
Food
Transport
Bills
Shopping
Entertainment
Other
```

We don't need a category-management feature.

The exact list will be finalized in the feature specification.

---

# 16. Frontend State

The frontend needs to represent a few basic states.

For the expense list:

```text
Loading
Success
Error
```

Conceptually:

```text
              API Request
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       Loading   Success   Error
```

For creating an expense:

```text
Idle
 ↓
Submitting
 ↓
Success / Error
```

We should not use Redux simply because Redux is familiar.

This application is small.

A local state solution or lightweight data-fetching approach may be sufficient.

The exact choice will be made based on actual complexity.

---

# 17. Frontend ↔ Backend Communication

The frontend communicates with the backend through HTTP.

```text
React
 │
 │ HTTP Request
 ▼
Express API
 │
 │ HTTP Response
 ▼
React
```

API calls should be separated from UI components where practical.

Conceptually:

```text
Component
    ↓
API function
    ↓
HTTP request
```

This prevents components from becoming full of networking logic.

The exact frontend service structure will be defined in the feature specifications.

---

# 18. Development Environment

Our local environment will eventually contain:

```text
┌───────────────────────────────────┐
│          Developer Machine        │
│                                   │
│       Docker Compose              │
│                                   │
│  ┌──────────┐ ┌──────────┐        │
│  │ Frontend │ │ Backend  │        │
│  │Container │ │Container │        │
│  └──────────┘ └─────┬────┘        │
│                     │             │
│                ┌────▼─────┐       │
│                │ MongoDB  │       │
│                │Container │       │
│                └──────────┘       │
└───────────────────────────────────┘
```

Exact ports and networking will be decided during the Docker phase.

---

# 19. Production Environment

Target production architecture:

```text
                       Internet
                           │
                           ▼
                        Nginx
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
            Frontend             Backend
            Container            Container
                                      │
                                      ▼
                                  MongoDB
                                  Container
```

Still TBD:

- Server provider
- Networking
- TLS/HTTPS
- Domain
- Secrets
- MongoDB persistence
- Deployment strategy

---

# 20. Data Persistence

Containers themselves are disposable.

If MongoDB runs inside a container, its data must survive container recreation.

Conceptually:

```text
MongoDB Container
       │
       ▼
Docker Volume
       │
       ▼
Persistent Data
```

This will be an important Docker learning exercise.

---

# 21. Frontend and Backend Containers

Eventually we will have separate images:

```text
Frontend Image
       │
       ▼
Frontend Container
```

and:

```text
Backend Image
       │
       ▼
Backend Container
```

MongoDB will use its own container/image during the appropriate environment.

The runtime relationship becomes:

```text
Frontend Container
        │
        │ Network
        ▼
Backend Container
        │
        │ Network
        ▼
MongoDB Container
```

---

# 22. Configuration and Environment Variables

Application configuration should not be hardcoded.

Conceptually:

```text
Environment
    │
    ├── API URL
    ├── Database URL
    └── Other configuration
```

Different environments can have different values:

```text
Development
     ↓
Development configuration

CI
     ↓
CI configuration

Production
     ↓
Production configuration
```

Secrets must not be committed to Git.

The exact environment-variable strategy will be finalized later.

---

# 23. Architecture Boundaries

The architecture should maintain these boundaries:

```text
┌──────────────────────────────┐
│          FRONTEND            │
│                              │
│ UI + user interaction        │
└──────────────┬───────────────┘
               │
             HTTP
               │
               ▼
┌──────────────────────────────┐
│           BACKEND            │
│                              │
│ API + validation + logic     │
└──────────────┬───────────────┘
               │
          Database API
               │
               ▼
┌──────────────────────────────┐
│           DATABASE           │
│                              │
│ Persistent expense data      │
└──────────────────────────────┘
```

Rules:

- Frontend must not bypass the backend.
- Backend must not expose database credentials to the frontend.
- Database should not be directly exposed to the public internet.

---

# 24. Final Application Architecture

```text
                           USER
                             │
                             ▼
                      ┌─────────────┐
                      │   Browser   │
                      └──────┬──────┘
                             │
                             ▼
                  ┌────────────────────┐
                  │ React + TypeScript │
                  │     Frontend       │
                  └─────────┬──────────┘
                            │
                       HTTP / REST
                            │
                            ▼
                  ┌────────────────────┐
                  │ Node + Express + TS│
                  │      Backend       │
                  └─────────┬──────────┘
                            │
                       MongoDB Driver
                            │
                            ▼
                  ┌────────────────────┐
                  │      MongoDB       │
                  │     expenses       │
                  └────────────────────┘
```

---

# 25. Application Scope

The application remains intentionally small.

### Create

```text
POST /api/expenses
```

### Read

```text
GET /api/expenses
```

### Delete

```text
DELETE /api/expenses/:id
```

### Infrastructure

```text
GET /api/health
```

No initial:

- Authentication
- User accounts
- Budgets
- Charts
- Reports
- Category CRUD
- Search
- Pagination
- File uploads
- Email
- Notifications

unless a later learning requirement justifies adding one.

---

# 26. What Is Now Decided

### Application

- React + TypeScript
- Node.js + Express + TypeScript
- MongoDB
- REST API
- Three user-facing operations
- Health-check endpoint
- Backend validation
- Frontend validation for UX
- Integer minor units for monetary values
- Predefined expense categories
- No authentication initially
- No unnecessary state-management library

### API

```text
POST   /api/expenses
GET    /api/expenses
DELETE /api/expenses/:id
GET    /api/health
```

### Architecture

```text
Browser
  ↓
Frontend
  ↓
Backend
  ↓
MongoDB
```

---

# 27. What Is Still TBD

- Exact React project setup
- Exact backend folder structure
- Exact API response format
- Exact MongoDB schema implementation
- Validation library, if any
- HTTP client
- Testing libraries/setup
- Exact API error schema
- Exact category values
- Exact UI design
- Docker development configuration
- Docker production configuration
- Container networking
- Ports
- Image naming/tagging
- Container Registry
- Production server
- Nginx configuration
- HTTPS
- Secrets management
- Deployment strategy
- Rollback strategy
- Monitoring

These will be decided at the appropriate stages.

---

# Step 5 — Summary

We have now moved from:

```text
High-Level Architecture
```

to:

```text
Detailed Application Architecture
```

Our core application is:

```text
React
  ↓
REST API
  ↓
Express
  ↓
MongoDB
```

with:

```text
POST   /api/expenses
GET    /api/expenses
DELETE /api/expenses/:id
GET    /api/health
```

The architecture is deliberately simple.

The **application is small**.

The **development lifecycle is the complex part**.

---

# Next Step — Step 6

Before generating the individual feature specs, we need to lock down the development and tooling decisions:

1. React project setup
2. Node/Express setup
3. MongoDB library/ODM
4. Testing stack
5. Linting/formatting
6. Package manager
7. Git branching strategy
8. Commit conventions
9. Local development commands
10. Claude Code workflow

After Step 6, we can create:

```text
specs/
├── 01-add-expense.md
├── 02-view-expenses.md
└── 03-delete-expense.md
```

and give Claude Code precise instructions feature by feature.
