# SwiftTrack Logistics

A logistics / shipment-tracking single-page web application built with React, Vite, TypeScript and Tailwind CSS. It includes a public marketing site, a shipment tracking page, an admin portal for managing shipments, and a super-admin portal for editing site-wide content and settings.

> ⚠️ **Status: front-end prototype / demo.** All data lives in the browser's `localStorage` and authentication uses hard-coded demo credentials. It deploys cleanly as a static site, but is **not** production-ready as a real tracking system without a backend. See [Production checklist](#production-checklist).

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

## Production checklist

This prototype needs the following before it can be used as a real logistics platform:

- [ ] **Backend + database** — shipments and settings are currently stored per-browser in `localStorage`, so an admin's data is not visible to customers tracking on another device.
- [ ] **Real authentication** — replace the hard-coded client-side credentials with server-side auth (sessions/JWT, hashed passwords) and remove the visible demo credentials.
- [ ] **Real geocoding** — `src/utils/geocode.ts` uses a small hard-coded city table and falls back to pseudo-random coordinates; integrate a real geocoding API.
- [ ] **Tests & CI** — no automated tests or lint/CI pipeline currently exist.
