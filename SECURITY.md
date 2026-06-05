# Security Policy

EzClassPay handles money collection rooms, user roles, payment status, and payment slip records.
Security decisions must protect user identity, room privacy, payment evidence, and approval history.

This document defines the minimum security baseline for the project.

## Supported Scope

This repository currently contains the frontend application.

Security rules in this document apply to:

- Frontend code in this repository.
- Backend API contracts consumed by the frontend.
- Authentication and authorization behavior expected from the backend.
- Payment slip upload and verification workflows.
- Deployment, CI/CD, and operational practices when added.

## Reporting Security Issues

Do not disclose security issues publicly until they have been reviewed and fixed.

If a vulnerability is found, report it privately to the project owner or maintainers.

Include:

- A clear summary of the issue.
- Steps to reproduce.
- Impact and affected users/roles.
- Screenshots, logs, or proof of concept if available.
- Suggested fix, if known.

Do not include real user credentials, real payment slips, production secrets, or private personal data in reports.

## Security Severity

Use this severity guide when triaging issues.

### Critical

- Authentication bypass.
- Admin or Manager privilege escalation.
- Unauthorized access to payment slips or private room data.
- Production secret exposure.
- Remote code execution.
- Ability to mark payments as paid without authorization.

### High

- Cross-room data access.
- Broken object-level authorization.
- Stored XSS.
- SQL injection in backend endpoints.
- JWT/session theft.
- Upload bypass that allows dangerous files.

### Medium

- Reflected XSS.
- Missing rate limits on sensitive actions.
- Insecure direct object references with limited impact.
- Missing audit events for approve/reject actions.
- Weak password or token handling.

### Low

- Missing security headers.
- Non-sensitive information disclosure.
- Minor dependency vulnerabilities without a practical exploit path.

## Security Principles

- Backend authorization is mandatory. Frontend checks are for UI only.
- Never trust client input.
- Deny by default when role or permission is missing.
- Keep role checks room-scoped.
- Keep payment verification actions auditable.
- Minimize sensitive data exposure in UI, logs, and API responses.
- Store secrets only in environment variables or approved secret managers.
- Prefer explicit allowlists over blocklists.

## Role-Based Access Control

EzClassPay uses three primary roles:

- `manager`: manages a room, reviews slips, and approves or rejects payments.
- `member`: joins rooms and submits their own payments.
- `admin`: manages platform-level users, rooms, subscriptions, and settings.

Rules:

- A user can be a Manager in one room and a Member in another room.
- Permissions must be checked per room, not only by global role name.
- Members must not view other members' private payment slip details unless explicitly allowed by product policy.
- Managers must only manage rooms they own or are assigned to.
- Admin access must be separated from normal user flows.
- Frontend route guards must not be treated as security enforcement.

## Authentication

Expected baseline:

- Use secure authentication tokens, such as JWTs or secure sessions.
- Short-lived access tokens are preferred.
- Refresh tokens, if used, must be stored securely and rotated.
- Passwords must be hashed on the backend using a strong password hashing algorithm.
- Private routes must require authentication.
- Admin routes must require explicit admin authorization.
- Logout must invalidate or remove usable client credentials.

Token handling rules:

- Do not store sensitive tokens in plain local storage if a safer architecture is available.
- Do not log tokens.
- Do not place tokens in URLs.
- Do not expose tokens through error messages.

## Authorization

Every backend endpoint must verify:

- The user is authenticated.
- The user has access to the target room.
- The user has permission for the requested action.
- The target resource belongs to the expected room/user context.

Sensitive actions:

- Creating rooms.
- Editing room payment rules.
- Inviting or removing members.
- Uploading payment slips.
- Viewing payment slips.
- Approving payments.
- Rejecting payments.
- Managing subscriptions.
- Accessing admin screens.

## Payment Slip Security

Payment slips may contain sensitive personal or financial information.

Rules:

- Treat uploaded slips as private sensitive files.
- Validate file type and size before upload.
- Allow only expected image formats unless product requirements change.
- Store uploaded files outside public unrestricted paths.
- Use signed/private URLs for file access when possible.
- Do not expose slip URLs to users outside the room permission scope.
- Strip or ignore untrusted metadata when feasible.
- Scan uploads for malicious content if infrastructure supports it.
- Never trust slip content as proof of payment without Manager approval or trusted verification.

## Payment Verification Integrity

Approval and rejection are high-trust actions.

Required audit fields:

- Payment ID.
- Room ID.
- Member/user ID.
- Submitted amount.
- Submitted slip reference.
- Reviewer Manager ID.
- Review action: `approved` or `rejected`.
- Review timestamp.
- Rejection reason, when rejected.

Rules:

- Members must not approve or reject payments.
- Managers must not approve payments for rooms they do not manage.
- Payment status changes must be transactional on the backend.
- Approved payment records should not be silently editable.
- Reversals or corrections must create audit records.

## Frontend Security

Frontend code must:

- Keep API calls in `services/`.
- Avoid rendering raw HTML from user input.
- Sanitize or safely encode user-generated content.
- Avoid exposing secrets in bundled code.
- Use environment variables only for intentionally public frontend config.
- Handle authorization errors clearly without exposing internal details.
- Keep sensitive UI hidden from unauthorized users, while relying on backend enforcement.
- Avoid logging personal data, tokens, payment slip URLs, or API secrets.

XSS prevention:

- Do not use `dangerouslySetInnerHTML` unless there is a strong reason and sanitization is enforced.
- Treat room names, user names, notes, rejection reasons, and uploaded file names as untrusted input.

## API Security

Backend APIs should:

- Validate all request bodies, params, and query strings.
- Return proper HTTP status codes.
- Use consistent error response shapes.
- Avoid leaking stack traces or internal details.
- Enforce rate limits on authentication, invitation, upload, and approval endpoints.
- Use CORS allowlists for production.
- Require HTTPS in production.
- Use CSRF protection when cookie-based authentication is used.

Recommended response shape:

```json
{
  "success": false,
  "message": "Validation failed"
}
```

## Database Security

Expected backend database: PostgreSQL.

Rules:

- Use migrations for schema changes.
- Use least-privilege database users.
- Never modify production data directly without an approved operation plan.
- Parameterize SQL queries.
- Use transactions for payment status changes and audit writes.
- Keep backups encrypted and access-controlled.
- Do not expose database credentials to the frontend.

## Secrets Management

Never commit:

- API keys.
- JWT secrets.
- Database credentials.
- PromptPay/payment provider credentials.
- Admin credentials.
- Production `.env` values.
- Private certificates or keys.

Rules:

- Use `.env` only for local development.
- Use a secret manager or CI/CD encrypted secrets for deployed environments.
- Rotate exposed secrets immediately.
- Keep `.env.example` safe and free from real credentials.

## Dependency Security

Rules:

- Prefer minimal dependencies.
- Review new production dependencies before adding them.
- Keep dependencies updated.
- Use lockfiles.
- Run dependency audits regularly.
- Remove unused dependencies.

Recommended checks:

```bash
npm audit
npm run lint
npm run build
```

## CI/CD Security

This repository does not currently include CI/CD.

When CI/CD is added, it should:

- Run `npm ci`.
- Run `npm run lint`.
- Run `npm run build`.
- Run dependency audits or vulnerability scanning.
- Use protected branches for production deployments.
- Store secrets in encrypted CI/CD secrets.
- Avoid printing secrets in logs.
- Use least-privilege deployment credentials.
- Require review before production deployment.

## Docker and Deployment Security

Rules:

- Do not bake secrets into Docker images.
- Use environment variables or secret mounts.
- Keep Docker images minimal.
- Avoid running production containers as root when possible.
- Expose only required ports.
- Use HTTPS in production.
- Keep production and development configs separate.

## Logging and Privacy

Do not log:

- Passwords.
- Tokens.
- Full payment slip URLs.
- Sensitive payment details.
- Production secrets.
- Personal data unless required for auditing.

Logs should capture:

- Authentication failures without secrets.
- Permission denial events.
- Payment approve/reject actions.
- Admin changes.
- Upload failures.

Audit logs should be access-controlled.

## Incident Response

When a security incident is suspected:

1. Stop the exposure if possible.
2. Preserve evidence and logs.
3. Identify affected users, rooms, slips, and payment records.
4. Rotate exposed secrets.
5. Patch the vulnerability.
6. Review audit logs for unauthorized actions.
7. Notify affected users when required.
8. Document the root cause and prevention plan.

## Security Checklist Before Release

- No secrets are committed.
- `npm run lint` passes.
- `npm run build` passes.
- Authenticated routes require authentication.
- Role-based UI matches backend permissions.
- Backend endpoints enforce room-scoped authorization.
- Payment slip uploads validate file type and size.
- Payment approve/reject actions are audited.
- Sensitive files are not publicly accessible.
- Production uses HTTPS.
- Error messages do not expose internal details.
- Admin flows are separated and protected.

## Open Security Questions

These decisions should be finalized before production:

- Will authentication use JWT, secure sessions, or a hybrid model?
- Where will payment slips be stored?
- Will uploaded slips use signed URLs?
- Will PromptPay QR generation happen on the backend or frontend?
- Will slip validation be manual only, OCR-assisted, or bank-verified?
- What are the exact Manager subscription limits?
- Can a room have multiple Managers?
- What data can Members see about other Members?
- What audit logs must Admins be able to view?
