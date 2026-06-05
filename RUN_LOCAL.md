# Running SwiftTrack locally

Two ways to run the full app (frontend + PHP API) on your machine. The frontend
dev server proxies `/api` to the PHP API, so it behaves like production
(same-origin, no CORS).

---

## Option A — Quick start with SQLite (no MySQL needed)

Good for clicking through the app fast. Uses a local SQLite file as the database.

1. **Config** — `api/config.php` already points at SQLite by default (it is
   gitignored). If it's missing, copy `api/config.example.php` to
   `api/config.php` and set the dsn to:
   ```php
   'dsn' => 'sqlite:' . __DIR__ . '/local.sqlite', 'user' => '', 'pass' => '',
   ```
2. **Seed the database** (creates tables + demo shipments + admin accounts):
   ```bash
   php api/tools/seed_local.php
   ```
   Default logins: `admin / admin123`, `superadmin / super123`.
3. **Start both servers with one command:**
   ```bash
   npm run dev:all
   ```
   This launches the PHP API (port 8765) **and** the Vite frontend together.
   Open the printed URL (http://localhost:5173); the Vite proxy forwards `/api/*`
   to the PHP API. Stop both with Ctrl+C.

   > Both servers must run. If only the frontend is up, logins fail with
   > "Cannot reach the server" — that means the PHP API isn't running.

   Prefer separate terminals (or a different API port)? Run them individually:
   ```bash
   npm run dev:api                                   # PHP API on :8765
   npm run dev                                        # Vite frontend on :5173
   # custom API port: php -S 127.0.0.1:9000 -t api api/index.php
   #                  VITE_API_TARGET=http://127.0.0.1:9000 npm run dev
   ```

---

## Option B — Mirror production with XAMPP / Laragon (Apache + MySQL)

Closest to the real Hostinger setup.

1. **Create the database** in phpMyAdmin (e.g. `swifttrack`), then **Import**
   `api/schema.sql`. This creates the tables and demo data.
2. **Point the config at MySQL** — in `api/config.php`:
   ```php
   'dsn'  => 'mysql:host=127.0.0.1;dbname=swifttrack;charset=utf8mb4',
   'user' => 'root',
   'pass' => '',           // XAMPP default; set your Laragon/MySQL password
   ```
3. **Set the admin passwords** (the seed hashes in `schema.sql` are placeholders):
   ```bash
   php api/tools/seed_local.php "your-admin-pass" "your-superadmin-pass"
   ```
   (Against MySQL this only upserts the two admin users; it leaves your data.)
4. **Run it.** Either:
   - **Apache:** copy `npm run build` output (`dist/*`) and the `api/` folder
     under your web root and browse to the vhost root, **or**
   - **Dev servers (simplest):** `php -S 127.0.0.1:8765 -t api api/index.php`
     in one terminal and `npm run dev` in another — same as Option A steps 3-5,
     just backed by MySQL instead of SQLite.

> Serving the built site from a **subfolder** (e.g. `http://localhost/swifttrack/`)
> breaks the absolute `/api` and `/assets` paths. Use a Laragon/Apache vhost
> root (e.g. `http://swifttrack.test/`) or the dev-server approach above.

---

## Notes

- `api/config.php` and `*.sqlite` are gitignored — your local DB and secrets are
  never committed.
- The API test suite (no server needed): `php api/tests/run.php`.
- For real deployment to Hostinger, see [DEPLOY.md](DEPLOY.md).
