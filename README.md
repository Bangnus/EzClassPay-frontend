# EzClassPay Frontend

Frontend application for EzClassPay.

This repository contains the web frontend only. The backend is expected to be a separate REST API service.

EzClassPay is a web application designed to reduce the chaos of collecting shared money, such as classroom funds, trip funds, or office shared expenses. The product focuses on transparency, clear payment status, and records that can be checked later.

## Core Features

### Room Management System

Managers can create money collection rooms, set room names, define collection goals, and choose payment patterns such as one-time collection or monthly collection.

After a room is created, the system can provide an invite link or QR code so members can join from a group chat.

### Role & Access System

Each room has clear role-based access:

- Manager: manages the room, configures room settings, invites/removes members, reviews payment slips, and approves or rejects payments.
- Member: joins rooms, checks outstanding balances, transfers money, and uploads payment slips.
- Admin: manages users, rooms, subscriptions, and platform-level settings.

Managers are the paid subscription users for long-term usage. Members use the system for free.

### Payment & Verification Flow

EzClassPay primarily supports payment through PromptPay.

Basic flow:

1. Member transfers money through PromptPay.
2. Member uploads the payment slip.
3. Payment status becomes `pending`.
4. Manager reviews the amount and slip.
5. Manager approves or rejects the payment.
6. Approved payments update the member's payment status to paid in real time.

## Main Roles

- Manager: creates and manages money collection rooms.
- Member: joins rooms and submits payments.
- Admin: manages the platform.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Ant Design
- SWR
- Zustand
- Docker Compose

## Requirements

- Node.js 20 or newer
- npm
- Docker and Docker Compose, when running with containers

## Environment Variables

Create a local `.env` file:

```env
NODE_ENV=development
APP_PORT=3000
```

Do not commit real secrets or production credentials.

## Installation

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Production Start

```bash
npm run start
```

Run `npm run build` before `npm run start`.

## Lint

```bash
npm run lint
```

## Docker

Run the frontend with Docker Compose:

```bash
docker compose up -d
```

Stop the container:

```bash
docker compose down
```

The app port is controlled by `APP_PORT` in `.env`.

## Project Structure

```text
app/
components/
features/
lib/
public/
```

Recommended structure as the project grows:

```text
app/
components/
features/
hooks/
lib/
services/
store/
types/
utils/
```

## Development Rules

- Use the Next.js App Router.
- Keep TypeScript strict mode enabled.
- Use functional React components.
- Prefer Server Components when possible.
- Use Client Components only when browser/client behavior is required.
- Put reusable feature UI in `features/`.
- Put shared UI in `components/`.
- Put API calls in `services/`.
- Do not call APIs directly from presentational components.
- Use SWR for client-side server data.
- Use Zustand only for shared client state.
- Use Tailwind CSS and existing Ant Design patterns for UI.
- Avoid `any`.
- Prefer `async/await`.

## API Architecture

Expected full-stack flow:

```text
Frontend (Next.js)
-> REST API
-> Backend controller
-> Service layer
-> Repository layer
-> PostgreSQL
```

Frontend rules:

- Do not access the database directly.
- Communicate with the backend through REST API only.
- Use JWT authentication for protected API calls when required.
- Keep API base URLs and environment-specific values in environment variables.

## CI/CD Status

This repository does not currently include a CI/CD workflow.

Not present yet:

- `.github/workflows`
- Automated lint on push or pull request
- Automated build on push or pull request
- Automated deployment

Recommended first CI workflow:

- Install dependencies with `npm ci`.
- Run `npm run lint`.
- Run `npm run build`.

## Documentation for Codex

Project-specific Codex instructions are stored in:

```text
AGENTS.md
```

Update `AGENTS.md` when project rules, commands, architecture, or conventions change.

## Definition of Done

Before finishing a task:

- Run `npm run lint`.
- Run `npm run build` for build-sensitive changes.
- Verify changed UI flows manually.
- Keep secrets out of source code.
- Update documentation when setup or behavior changes.
