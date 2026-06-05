# AGENTS.md

## Project Overview

EzClassPay Frontend is a Next.js application for the EzClassPay product.
This repository currently contains the frontend application only.

EzClassPay is a web application designed to reduce the chaos of collecting shared money, such as classroom funds, trip funds, or office shared expenses. The product focuses on transparency, clear payment status, and records that can be checked later.

- Frontend: Next.js 16 App Router, React 19, TypeScript
- Styling: Tailwind CSS 4 and Ant Design
- Data fetching: SWR
- Client/global state: Zustand when global state is required
- Backend contract: REST API provided by a separate service, expected to be Go Fiber
- Database: PostgreSQL, accessed only by the backend
- Deployment/local runtime: Docker Compose

Main roles:

- `manager`: A room manager who creates collection rooms, configures payment rules, invites/removes members, reviews slips, and approves or rejects payments. Managers are the paid subscription users for long-term usage.
- `member`: A room participant who joins rooms, checks outstanding balances, transfers money, and uploads payment slips. Members use the system for free.
- `admin`: A platform administrator who manages users, rooms, subscriptions, and system-level settings.

Core product areas:

- Room Management System: Managers create rooms, name them, set payment goals, choose payment patterns such as one-time or monthly collection, and invite members through links or QR codes.
- Role & Access System: Permissions are scoped by room. Managers control room operations, members handle their own payments, and admins oversee platform-level operations.
- Payment & Verification Flow: Members pay mainly through PromptPay, upload payment slips, wait in `pending` status, and managers approve or reject the payment. Approved payments update the member's payment status in real time.

## Architecture

Frontend (Next.js)
-> REST API
-> Backend controller
-> Service layer
-> Repository layer
-> PostgreSQL

Follow this architecture strictly.

- The frontend must never access PostgreSQL directly.
- Components must not contain database logic.
- API integration must go through service/helper modules.
- Backend/database rules in this file describe the expected API contract even though this repo is frontend-only.

## Setup Commands

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Run with Docker Compose:

```bash
docker compose up -d
docker compose down
```

## Project Structure

Current repository structure:

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
public/
```

Folder responsibilities:

- `app/`: Next.js App Router routes, layouts, route-level loading/error files, and metadata.
- `components/`: Shared reusable UI components used across multiple features.
- `features/`: Feature-specific UI, templates, and logic. Use `features/<feature-name>/` for each product area.
- `hooks/`: Reusable React hooks, especially hooks shared by multiple features.
- `lib/`: Shared library code, configuration helpers, constants, and framework integrations.
- `services/`: API clients and external service calls. Components should not call APIs directly.
- `store/`: Zustand stores and shared client-side state.
- `types/`: Shared TypeScript interfaces/types, especially API contracts and common domain models.
- `utils/`: Small pure utility functions that are framework-independent.
- `public/`: Static assets served by Next.js.

Keep feature-owned code inside its feature folder when it is not reused elsewhere. Move code into shared folders only when at least two features need it or when it is clearly project-wide infrastructure.

## Frontend Rules

### Next.js

- Use the App Router only.
- Keep TypeScript strict mode enabled.
- Prefer Server Components when possible.
- Use Client Components only for browser APIs, event handlers, local interactive state, or client-side libraries.
- Create reusable functional React components.
- Keep pages and layouts thin; move feature UI into `features/`.

### Data Fetching and API Calls

- Put REST API calls in `services/`.
- Do not call APIs directly from presentational components.
- Use SWR for client-side remote data when caching/revalidation is useful.
- Keep API response/request types in `types/` or near the related feature.
- Handle loading, empty, and error states for user-facing data.

### State Management

- Use local component state for UI-only interactions.
- Use Zustand only for shared client state that crosses features or routes.
- Do not introduce Redux Toolkit unless the project explicitly adopts it.
- Keep server data in SWR or server-side fetching instead of duplicating it in global state.

### UI Rules

- Use Tailwind CSS for layout and utility styling.
- Use Ant Design components when they fit existing UI patterns.
- Build mobile-first responsive layouts.
- Reuse existing components before creating new ones.
- Avoid duplicated UI code.
- Keep accessible labels, semantic HTML, and keyboard behavior in mind.

## API Rules

- Frontend communicates with the backend through REST API only.
- Use JWT authentication for protected API calls when authentication is required.
- Store tokens securely according to the app's auth design; do not expose secrets to the browser.
- Keep base URLs and public runtime config in environment variables.
- Validate and narrow unknown API responses before relying on them in UI code.
- Use consistent API response handling:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

```json
{
  "success": false,
  "message": "Validation failed"
}
```

## Backend Contract Rules

When working with or documenting backend expectations:

- Backend should use Go Fiber.
- Controllers should handle HTTP requests only.
- Business logic belongs in services.
- Database access belongs in repositories.
- Never query the database directly from controllers.
- Validate all request inputs.
- Return proper HTTP status codes.
- Protect private routes with authentication middleware.

## Database Rules

- PostgreSQL only.
- Use migrations for schema changes.
- Never modify production data directly.
- Use transactions for critical multi-step operations.
- Avoid raw SQL unless necessary; parameterize queries when raw SQL is used.

## Docker Rules

- Use Docker Compose for local containerized runs.
- Keep Dockerfiles production-ready and easy to understand.
- Test container-related changes with Docker Compose before finishing when Docker files are touched.
- Do not hardcode container ports or secrets; use environment variables.

## Environment Variables

Never hardcode:

- API keys
- JWT secrets
- Database credentials
- Third-party credentials
- Backend API base URLs that change by environment

Use `.env` files for local development and documented environment variables for deployment. Only expose variables to the browser when they are intentionally public.

## Code Style

### TypeScript

- Avoid `any`; prefer specific types, `unknown`, or generics.
- Prefer interfaces for API contracts and object shapes that are extended.
- Use async/await over Promise chains.
- Use proper error handling for async work.
- Keep imports using the `@/` alias when referencing project-root modules.

### Naming

- Components: `PascalCase`
- Hooks: `useSomething`
- Services: `somethingService`
- Variables and functions: `camelCase`
- Constants: `UPPER_CASE`
- Files for components: `PascalCase.tsx` or existing local convention
- Files for services/hooks/utils: `camelCase.ts`

Examples:

```text
UserCard.tsx
useAuth.ts
userService.ts
```

## Development Rules

- Create reusable components for repeated UI.
- Do not duplicate code across features.
- Keep components focused on rendering and interaction.
- Keep business/data transformation logic outside JSX-heavy components.
- Update related documentation when behavior or setup changes.
- Preserve existing functionality unless the task explicitly changes it.
- Ask before adding new production dependencies.

## Security

- Never expose secrets in source code, logs, or client bundles.
- Validate all API inputs on the backend.
- Sanitize rendered user-generated content.
- Protect against SQL injection in backend queries.
- Protect against XSS in frontend rendering.
- Protect against CSRF when cookie-based auth is used.
- Do not commit real credentials or production `.env` values.

## Testing and Verification

Before finishing frontend work:

- Run `npm run lint`.
- Run `npm run build` for changes that can affect compilation, routing, rendering, config, or dependencies.
- Run relevant tests if tests are added later.
- Verify important UI flows manually when UI behavior changes.

Before finishing Docker-related work:

- Run `docker compose up -d` when feasible.
- Confirm the frontend starts and serves correctly.
- Run `docker compose down` after verification if no long-running environment is needed.

## Pull Request Checklist

Before opening or finishing a pull request:

- Lint passes.
- Build succeeds.
- Tests pass when available.
- No TypeScript errors.
- No browser console errors for changed UI flows.
- API calls are placed in `services/`.
- Components do not directly access backend/database internals.
- Related documentation is updated.
- Existing functionality remains unaffected.

## Definition of Done

A task is complete only when:

- The requested behavior is implemented.
- Code compiles successfully.
- Lint passes, or any lint failure is clearly reported.
- Build passes for build-sensitive changes, or any build failure is clearly reported.
- Security-sensitive values remain in environment variables.
- Documentation is updated when required.
