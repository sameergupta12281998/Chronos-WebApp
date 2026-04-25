# Chronos-WebApp
# Chronos UI

A production-style React + TypeScript front-end for the Chronos job-scheduling platform. It implements registration, authentication, job lifecycle management, execution tracking, and notifications against the Chronos REST API gateway.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler / Dev Server**: Vite 8
- **Routing**: react-router-dom v7 (`createBrowserRouter`)
- **Server State**: @tanstack/react-query v5
- **Client State**: Zustand (auth session, persisted to `localStorage`)
- **Forms**: react-hook-form + zod (`@hookform/resolvers`)
- **HTTP**: axios with JWT injection + idempotency-key support

## Features

- User registration and JWT-based login
- Auth-guarded routes (auto-redirect unauthenticated users to `/login`)
- Dashboard KPIs scoped to the current user (total / active / failed)
- Create one-time and recurring jobs (EMAIL / WEBHOOK), with payload validation
- Filter jobs by status (`SCHEDULED`, `EXECUTING`, `COMPLETED`, `FAILED`, `CANCELLED`)
- Job details view with reschedule and cancel actions
- Executions list with auto-refresh while a job is active
- Notifications feed page
- Gateway health badge in the header

## Project Structure

```
src/
  app/                    # Providers + router setup
  api/                    # Typed API client modules (axios)
  components/             # Layout + shared UI (StatusBadge, ErrorBanner, EmptyState)
  features/
    auth/                 # Auth store, login/register pages, AuthGuard
    dashboard/            # Dashboard page + KPI cards
    jobs/                 # Jobs list, create form, details, reschedule modal
    executions/           # Execution list + details panel
    notifications/        # Notifications feed
  lib/                    # Constants, date helpers, enums
  types/                  # API DTO types
```

## Getting Started

### Prerequisites

- Node.js 20+ (tested on 23.x)
- npm 10+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

App is served at `http://localhost:5173/`.

### Build for production

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

### Lint

```bash
npm run lint
```

## Backend Configuration

The dev server proxies `/api/*` to the Chronos gateway (configured in [vite.config.ts](vite.config.ts)), so requests stay same-origin in development and avoid CORS.

To point at a different backend, create `.env.local`:

```
VITE_API_BASE_URL=https://your-gateway.example.com
```

When `VITE_API_BASE_URL` is unset, requests go through the dev proxy.

The gateway and endpoints are documented in [../VM_API_REFERENCE.md](../VM_API_REFERENCE.md).

## Auth Flow

1. `POST /api/v1/auth/register` creates the user.
2. `POST /api/v1/auth/login` returns a JWT (`accessToken`).
3. The token + user info are persisted via Zustand (`localStorage` key: `chronos.auth`).
4. axios attaches `Authorization: Bearer <token>` to every request.
5. On `401`, the session is cleared and the user is redirected to `/login`.

## Notable Implementation Details

- **Date handling** — the backend returns timestamps as numeric epoch seconds (e.g. `1777523400.0`). The formatter in [src/lib/date.ts](src/lib/date.ts) detects numeric values and converts them to milliseconds before formatting; types in [src/types/api.ts](src/types/api.ts) accept `string | number` for date fields.
- **Idempotency keys** — `createJob` automatically attaches a generated `Idempotency-Key` header so retries do not duplicate jobs.
- **Auth scope** — there is no global "all jobs" endpoint in the API contract; the jobs list is always scoped to the authenticated user.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with backend proxy |
| `npm run build` | Type-check (`tsc -b`) and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the codebase |
