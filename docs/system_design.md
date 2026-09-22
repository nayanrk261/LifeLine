# Lifeline — System Design

## 1. Problem Statement

Developers often monitor deployed applications using separate tools for uptime, performance, incidents, and deployment information. This can make it harder to understand when a reliability problem started, how severe it was, and what changed around the same time.

**Lifeline** is a developer-focused application reliability and incident intelligence platform that monitors deployed applications, measures reliability, detects incidents, and provides context from recent GitHub changes.

## 2. Goals

Lifeline will:
- Monitor deployed applications periodically.
- Record health-check results and historical performance.
- Calculate availability, latency, and error rate.
- Define and evaluate SLOs and error budgets.
- Detect, track, and resolve incidents.
- Maintain an incident timeline.
- Connect applications with GitHub repositories.
- Show recent changes/deployments around incidents.
- Provide a dashboard for reliability information.

### V1 Non-Goals

The first version will not start with distributed tracing, complex machine learning, microservices, or AI-based root-cause analysis. These can be added later after the core monitoring system is stable.

## 3. Architecture

Lifeline will use a **modular monolith architecture**.

```text
User
  |
  v
React Frontend (Vercel)
  |
  | HTTPS / REST
  v
Node + Express Backend (Render)
  |
  +-- Authentication
  +-- Applications
  +-- Scheduler
  +-- Health Check Engine
  +-- Reliability Engine
  +-- Incident Engine
  +-- GitHub Service
  |
  +------> MongoDB Atlas
  +------> GitHub API
```

### Component Responsibilities

- **Frontend:** dashboard and user interaction.
- **Backend:** APIs and business logic.
- **Scheduler:** determines when checks are due.
- **Health Check Engine:** performs HTTP health checks.
- **Reliability Engine:** calculates availability, latency, and error rate.
- **Incident Engine:** detects, tracks, and resolves incidents.
- **GitHub Service:** retrieves repository and recent change information.
- **MongoDB:** stores application and monitoring data.

## 4. Data Model

```text
User
 |
 +-- owns --> Application
                |
                +--> CheckResult
                +--> SLO
                +--> Incident
                       |
                       +--> IncidentEvent
```

### User

```text
User
├── name
├── email
├── passwordHash
└── createdAt
```

### Application

```text
Application
├── name
├── url
├── repositoryUrl
├── ownerId
├── status
├── checkInterval
├── createdAt
└── updatedAt
```

`status` represents the monitoring state: `active` or `inactive`.

### CheckResult

```text
CheckResult
├── applicationId
├── timestamp
├── success
├── statusCode
├── responseTime
├── checkType
└── error
```

For V1, the primary check type is HTTP.

### SLO

```text
SLO
├── applicationId
├── metric
├── target
├── window
└── createdAt
```

### Incident

```text
Incident
├── applicationId
├── status
├── startedAt
├── resolvedAt
├── reason
└── createdAt
```

### IncidentEvent

```text
IncidentEvent
├── incidentId
├── type
├── message
└── timestamp
```

## 5. Monitoring Flow

```text
Scheduler
   |
   v
Is application check due?
   |
   v
Health Check Engine
   |
   v
HTTP Request
   |
   +----------------------+
   |                      |
 Success              Failure/Timeout
   |                      |
   +----------+-----------+
              |
              v
        CheckResult
              |
              v
           Database
              |
              v
     Reliability Engine
              |
      +-------+--------+
      |       |        |
 Availability Latency Error Rate
              |
              v
       Incident Engine
```

Every check produces a result, including failures and timeouts. Historical results are retained so Lifeline can calculate reliability over time.

Each application has its own `checkInterval`; the scheduler determines which applications are due and triggers their checks.

## 6. Reliability and SLO

### Availability

```text
Availability = successful checks / total eligible checks × 100
```

### Error Rate

```text
Error Rate = failed checks / total eligible checks × 100
```

### Latency

Each health check records response time. Lifeline can analyze latency history and show average and percentile latency.

### SLO

An SLO defines the desired reliability target, for example 99.5% availability over 30 days.

### Error Budget

```text
Error Budget = 100% - SLO target
```

For a 99.5% availability target, the allowed failure budget is 0.5%.

## 7. Incident Management

Lifeline should not create an incident for every individual failed check. For V1, an example detection rule is:

```text
3 consecutive failed checks -> Create Incident
```

A continuous outage should remain one incident. Additional events during that outage are stored as IncidentEvents.

```text
NORMAL -> DETECTED -> ONGOING -> RESOLVED
```

## 8. GitHub Integration

For V1, Lifeline primarily needs repository information, recent commits, and deployment information when available.

When an incident starts, Lifeline can inspect recent changes and add relevant information to the incident timeline.

Lifeline should describe a recent deployment as **temporally correlated** with an incident rather than claiming that the deployment caused the incident based only on timing.

## 9. API Design

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Applications

```text
POST   /api/applications
GET    /api/applications
GET    /api/applications/:id
PATCH  /api/applications/:id
DELETE /api/applications/:id
```

### Monitoring

```text
POST /api/applications/:id/checks
GET  /api/applications/:id/checks
POST /api/checks/:id/run
```

### Reliability

```text
GET  /api/applications/:id/metrics
GET  /api/applications/:id/slo
POST /api/applications/:id/slo
```

### Incidents

```text
GET  /api/incidents
GET  /api/incidents/:id
POST /api/incidents/:id/resolve
```

### GitHub

```text
GET /api/applications/:id/changes
GET /api/applications/:id/deployments
```

## 10. Security Design

- Password hashing using bcrypt.
- JWT-based authentication.
- Protected backend routes.
- Input validation.
- Rate limiting.
- Environment variables for secrets.
- HTTPS in production.
- SSRF protection for user-provided monitoring URLs.
- Timeouts for health checks.
- Failure isolation between monitored applications.

Monitoring URLs must be validated and private/internal network addresses must be blocked.

## 11. Deployment Architecture

```text
User
  |
  v
Vercel (React Frontend)
  |
  | HTTPS
  v
Render (Express API + Scheduler)
  |
  +------> MongoDB Atlas
  |
  +------> GitHub API
```

The backend remains a modular monolith. Monitoring, reliability, incident management, authentication, and GitHub functionality are modules within the same Node.js/Express application.

## 12. Failure Handling

- **Target timeout:** record a failed check and continue.
- **Target returns HTTP 500:** record a failed check.
- **GitHub API failure:** keep Lifeline running and mark GitHub information as unavailable.
- **Database failure:** log the failure and prevent one error from crashing the monitoring process.
- **One monitored application fails:** other applications must continue being checked.

> One failed application or one failed health check must not bring down the entire Lifeline monitoring system.

## 13. Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts

### Backend
- Node.js
- Express
- Mongoose
- JWT
- bcrypt
- node-cron

### Database
- MongoDB Atlas

### External Integration
- GitHub REST API

### Testing
- Jest
- Supertest
- Vitest

### Deployment
- Vercel
- Render
- MongoDB Atlas

## 14. V1 Scope Boundary

```text
Authentication
      ↓
Application Registry
      ↓
HTTP Health Checks
      ↓
Scheduler
      ↓
Check History
      ↓
Reliability Metrics
      ↓
SLO + Error Budget
      ↓
Incident Detection
      ↓
Incident Timeline
      ↓
GitHub Change Correlation
      ↓
Dashboard
```

Advanced features such as statistical anomaly detection, notifications, logs, OpenTelemetry, distributed tracing, and evidence-based AI investigation should be added only after the V1 monitoring pipeline is working and tested.
