# SwiftTrack Logistics

A logistics / shipment-tracking single-page web application built with React, Vite, TypeScript and Tailwind CSS. It includes a public marketing site, a shipment tracking page, an admin portal for managing shipments, and a super-admin portal for editing site-wide content and settings.

> **Status:** full-stack app. The React frontend talks to a PHP + MySQL REST API (in `api/`) with JWT authentication. See [DEPLOY.md](DEPLOY.md) for Hostinger deployment.

## Tech stack

- **React 19** + **TypeScript**
- **Vite 7** (standard multi-file production build)
- **PHP 8 + MySQL** REST API (in `api/`) with JWT auth
- **Tailwind CSS 4**
- **React Router 7** (HashRouter — works on any static host)
- **Leaflet / react-leaflet** for route maps
- **framer-motion** for animation
- **jsPDF / html2canvas** for PDF shipment receipts

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # produce a production build in dist/
npm run preview  # preview the production build locally
```

## Admin accounts

Two roles, stored in the `users` table with bcrypt-hashed passwords. There are
no hardcoded credentials — passwords are set at deploy time (see [DEPLOY.md](DEPLOY.md)).

| Portal       | URL              | Username (seed) |
|--------------|------------------|-----------------|
| Admin        | `/#/admin`       | `admin`         |
| Super Admin  | `/#/super-admin` | `superadmin`    |

## Deployment

`npm run build` outputs a static `dist/` (`index.html` + `assets/`). The app needs the PHP + MySQL backend in `api/` to function. For full step-by-step deployment to Hostinger (database, API config, upload), see **[DEPLOY.md](DEPLOY.md)**. Because the app uses `HashRouter`, the static frontend needs no server-side route rewriting of its own.

## Backend

The API lives in [`api/`](api/) — plain PHP (no framework) with PDO + MySQL.

- Run the API test suite: `php api/tests/run.php`
- Endpoints: `POST /api/auth/login`, `GET /api/track/{n}`, `GET|PUT /api/settings`,
  `GET|POST /api/shipments`, `PUT|DELETE /api/shipments/{id}`,
  `POST /api/shipments/{id}/status`.
- Deployment: see [DEPLOY.md](DEPLOY.md).

## Remaining known limitations

- **Geocoding** (`src/utils/geocode.ts`) is still an approximate hard-coded
  table; integrate a real geocoding API for accurate maps.
- No automated frontend test suite (the API has one).
