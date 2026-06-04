# SwiftTrack Logistics

A logistics / shipment-tracking single-page web application built with React, Vite, TypeScript and Tailwind CSS. It includes a public marketing site, a shipment tracking page, an admin portal for managing shipments, and a super-admin portal for editing site-wide content and settings.

> **Status:** full-stack app. The React frontend talks to a PHP + MySQL REST API (in `api/`) with JWT authentication. See [DEPLOY.md](DEPLOY.md) for Hostinger deployment.

## Tech stack

- **React 19** + **TypeScript**
- **Vite 7** (build tooling, bundled to a single HTML file via `vite-plugin-singlefile`)
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

## Demo credentials

| Portal       | URL              | Username     | Password    |
|--------------|------------------|--------------|-------------|
| Admin        | `/#/admin`       | `admin`      | `admin123`  |
| Super Admin  | `/#/super-admin` | `superadmin` | `super123`  |

## Deployment

The build outputs a self-contained `dist/index.html`. Because the app uses `HashRouter`, no server-side route rewriting is required — host the contents of `dist/` on any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, etc.).

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
