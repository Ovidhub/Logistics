# SwiftTrack — PHP + MySQL Backend Design

**Date:** 2026-06-04
**Status:** Approved (design), pending spec review
**Target host:** Hostinger shared hosting (hPanel, PHP + MySQL, no Node.js)

## Goal

Replace the front-end-only prototype (all data in `localStorage`, hardcoded
client-side credentials) with a real backend: a PHP REST API backed by MySQL,
with token-based authentication. The result must deploy to a Hostinger shared
hosting account on the user's own domain.

## Non-goals (YAGNI)

- No public user signup. Accounts are seeded, not self-registered.
- No multi-admin management UI. Exactly two fixed roles.
- No real-time updates, websockets, or notifications.
- No third-party geocoding integration (the existing approximate geocoder stays
  for map rendering; this is a known limitation, not in scope here).
- No ORM or heavy framework. Plain PHP with PDO.
- No Composer dependencies (avoids shared-hosting friction). JWT is hand-rolled
  with `hash_hmac`.

## Architecture & deployment layout

Everything is served from one domain, so there is no cross-origin (CORS) problem.

```
public_html/
├── index.html, assets/      ← built React frontend (static)
├── .htaccess                ← rewrites /api/* → api/index.php; SPA fallback
└── api/
    ├── index.php            ← front controller / router
    ├── config.php           ← DB creds + JWT secret (NOT committed)
    ├── config.example.php   ← template (committed)
    ├── schema.sql           ← table definitions + seed data (committed)
    └── src/
        ├── db.php           ← PDO connection helper
        ├── auth.php         ← JWT encode/verify, role guards
        ├── response.php     ← JSON response + error helpers
        └── routes/          ← one file per resource (auth, shipments, settings, track)
```

- Frontend calls `/api/...` (same origin as the site).
- MySQL database is created in hPanel; `schema.sql` is imported via phpMyAdmin.
- `config.php` holds the DB host/name/user/password and the JWT secret, and is
  gitignored. Deployment copies `config.example.php` → `config.php` and fills it in.

## Database schema (MySQL / InnoDB, utf8mb4)

### users
| column | type | notes |
|---|---|---|
| id | INT PK AUTO_INCREMENT | |
| username | VARCHAR(50) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt via PHP `password_hash()` |
| role | ENUM('admin','superadmin') | |
| created_at | DATETIME | |

Seeded: one `admin` and one `superadmin`. Seed passwords are placeholders that
the deployer changes (documented in DEPLOY.md).

### shipments
| column | type | notes |
|---|---|---|
| id | VARCHAR(16) PK | app-generated id (keeps current id style) |
| tracking_number | VARCHAR(20) UNIQUE | |
| sender_name, sender_address, sender_phone | VARCHAR | |
| receiver_name, receiver_address, receiver_phone | VARCHAR | |
| item_description | VARCHAR(255) | |
| weight | DECIMAL(10,2) | |
| origin, destination | VARCHAR(120) | |
| status | ENUM(pending, picked_up, in_transit, out_for_delivery, delivered, returned, cancelled) | |
| estimated_delivery | DATE | |
| created_at | DATETIME | |

### tracking_events
| column | type | notes |
|---|---|---|
| id | VARCHAR(16) PK | |
| shipment_id | VARCHAR(16) FK → shipments.id ON DELETE CASCADE | |
| status | VARCHAR(50) | human label, e.g. "In Transit" |
| location | VARCHAR(120) | |
| timestamp | DATETIME | |
| description | VARCHAR(255) | |

### settings
| column | type | notes |
|---|---|---|
| id | TINYINT PK (always 1) | single-row table |
| data | JSON / LONGTEXT | the full `SiteSettings` object |

Seed data mirrors the current demo shipments and `DEFAULT_SETTINGS` so the
deployed site is populated on first load.

## API endpoints

Base path `/api`. All requests/responses are JSON. Protected routes require
`Authorization: Bearer <jwt>`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/login` | public | validate credentials, return `{ token, role }` |
| GET | `/track/{trackingNumber}` | public | return a single shipment + events for public tracking |
| GET | `/settings` | public | return site content for rendering |
| GET | `/shipments` | admin | list all shipments (with events) |
| POST | `/shipments` | admin | create shipment (server generates id, tracking number, first event) |
| PUT | `/shipments/{id}` | admin | update shipment fields |
| DELETE | `/shipments/{id}` | admin | delete shipment (cascade events) |
| POST | `/shipments/{id}/status` | admin | set new status + append a tracking event |
| PUT | `/settings` | superadmin | replace site content |

Error model: non-2xx responses return `{ "error": "message" }` with an
appropriate HTTP status (400 validation, 401 unauthenticated, 403 wrong role,
404 not found, 500 server). Tracking lookups for unknown numbers return 404.

## Authentication

- `POST /auth/login` looks up the user, verifies the password with
  `password_verify()` against the bcrypt hash.
- On success, issues a **JWT** (header.payload.signature, HS256) signed with the
  secret from `config.php` using `hash_hmac('sha256', ...)`. Payload carries
  `sub` (username), `role`, and `exp` (e.g. 12h expiry).
- No external JWT library — encode/verify is ~40 lines in `auth.php`, using
  base64url + `hash_hmac` + `hash_equals` for constant-time comparison.
- Frontend stores the token in `localStorage` and attaches it to protected
  requests. On app load it reads the token, so **auth survives a page refresh**
  (fixing the current `useState`-only behavior). Expired/invalid tokens → user
  is returned to the login page.
- The demo-credentials box is removed from both login pages.

## Frontend changes

- New `src/utils/api.ts`: a thin fetch wrapper. Base URL from
  `import.meta.env.VITE_API_URL` (default `/api`). Injects the auth header,
  parses JSON, throws on non-2xx, and clears the token + redirects on 401.
- `src/hooks/useShipments.ts`: rewritten to call the API. Same public function
  names (`addShipment`, `updateShipment`, `deleteShipment`,
  `getShipmentByTracking`, `updateShipmentStatus`) so page components change
  minimally. Now async, exposing `loading` and `error`. `getShipmentByTracking`
  becomes an async call to `/track/{n}` (TrackPage updated accordingly).
- `src/hooks/useSettings.tsx`: `SettingsProvider` loads settings from
  `GET /settings` on mount; `updateSettings`/`resetSettings` call
  `PUT /settings` (superadmin). Falls back to `DEFAULT_SETTINGS` while loading.
- `src/App.tsx`: auth state initialized from the stored token (with role), not
  hardcoded `false`. Login handlers store the token; logout clears it.
- `AdminLogin.tsx` / `SuperAdminLogin.tsx`: submit to `POST /auth/login`, handle
  server errors, store token on success, remove the demo-credentials display.
- Build config (`vite.config.ts`): drop `vite-plugin-singlefile` in favor of a
  standard multi-file build (`dist/index.html` + `dist/assets/`) for proper
  browser caching. `HashRouter` stays, so the static frontend needs no server
  rewrite rules of its own.

## Secrets & configuration

- `api/config.php` (DB credentials + JWT secret) is gitignored.
- `api/config.example.php` is committed as a template.
- `.gitignore` updated to exclude `api/config.php` and any local `.env`.
- Frontend `VITE_API_URL` documented; default `/api` works for the same-domain
  layout, so no env file is required for the standard deploy.

## Deployment (DEPLOY.md)

Step-by-step for Hostinger:
1. In hPanel, create a MySQL database + user; note host/name/user/password.
2. Import `api/schema.sql` via phpMyAdmin.
3. Copy `config.example.php` → `config.php`; fill in DB creds + a long random
   JWT secret. Change the seeded admin/superadmin passwords (documented method).
4. `npm install && npm run build` locally.
5. Upload `dist/*` to `public_html/`, upload the `api/` folder to
   `public_html/api/`, and the `.htaccess` to `public_html/`.
6. Point the domain at the hosting (if not already) and verify:
   - public tracking, admin login, shipment CRUD, settings editing.

## Testing strategy

- **API:** a lightweight PHP test script (runnable via CLI with a local
  MySQL/MariaDB, or against the seeded DB) that exercises each endpoint: login
  success/failure, token-protected access, shipment create/read/update/delete,
  status update, public track (found/not-found), settings get/update with role
  enforcement.
- **Frontend:** manual verification checklist in DEPLOY.md covering the same
  flows in the browser. (No frontend test harness exists today; adding one is
  out of scope for this change.)
- Verification before claiming done: API tests pass against a real MySQL, and a
  local `npm run build` succeeds.

## Risks & mitigations

- **Hostinger may differ from assumptions (e.g. VPS, or PHP version).** Target
  PHP 8.0+ (PDO, `password_hash`, JSON all standard). If the user is on a VPS,
  the same schema/API ports to Node later.
- **`.htaccess` rewrite quirks on shared hosting.** Keep rules minimal and
  documented; provide a fallback note if `/api` routing misbehaves.
- **Secret management.** JWT secret and DB creds never committed; enforced by
  `.gitignore` + example template.
```
