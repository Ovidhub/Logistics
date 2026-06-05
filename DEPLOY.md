# Deploying SwiftTrack to Hostinger

The app has two parts that both live under one domain:

- **Frontend** — the built React site (static files) in `public_html/`
- **Backend** — the PHP API in `public_html/api/`, using a MySQL database

## 1. Create the MySQL database (hPanel)

1. hPanel → **Databases → MySQL Databases**.
2. Create a database and a user, and assign the user to the database.
3. Note the **database name**, **username**, **password**, and **host** (usually `localhost`).

## 2. Import the schema

1. hPanel → **phpMyAdmin**, open your database.
2. **Import** tab → upload `api/schema.sql` → **Go**.
3. This creates the tables and seeds demo shipments, a settings row, and two placeholder admin accounts.

## 3. Set the admin passwords

The seeded password hashes in `schema.sql` are placeholders. Generate real ones:

    php api/tools/make_hash.php "your-admin-password"
    php api/tools/make_hash.php "your-superadmin-password"

In phpMyAdmin, edit the `users` table and paste each hash into the `password_hash` column for `admin` and `superadmin` respectively.

## 4. Configure the API

1. Copy `api/config.example.php` to `api/config.php`.
2. Fill in the DB name/user/password from step 1.
3. Set `jwt_secret` to a long random string:

    php -r "echo bin2hex(random_bytes(32));"

> `api/config.php` is gitignored — it is never committed.

## 5. Build the frontend

    npm install
    npm run build

This produces `dist/index.html` and `dist/assets/`. Because the app uses `HashRouter`, no SPA rewrite rules are needed.

## 6. Upload

Using hPanel **File Manager** or FTP:

- Upload the **contents** of `dist/` into `public_html/`.
- Upload the `api/` folder (including `.htaccess` and your `config.php`) into `public_html/api/`.

Final layout:

    public_html/
    ├── index.html
    ├── assets/
    └── api/
        ├── .htaccess
        ├── index.php
        ├── config.php
        ├── src/...
        └── tools/...

## 7. Verify

- Visit `https://yourdomain.com/` — the site loads with demo shipments.
- Track `STX7B9K2M4P1` on the Track page.
- `https://yourdomain.com/#/admin/login` — log in with your admin password, create/edit/delete a shipment.
- `https://yourdomain.com/#/super-admin/login` — log in with your superadmin password, change site settings, confirm they persist after refresh.

## Updating the live site (after the first deploy)

Once the database and `config.php` exist on the server, pushing code changes is a
single command:

```bash
npm run deploy
```

It rebuilds the frontend and uploads `dist/` + the `api/` code over SSH. It does
**not** touch the server's `config.php`, the database, or admin passwords. It reads
server details from `.deploy.json` (gitignored — copy `.deploy.example.json` to
`.deploy.json` and fill it in; needs the deploy SSH key from setup).

Schema or admin-password changes are separate one-off steps (re-import `schema.sql`,
or run `php api/tools/seed_local.php "newAdminPass" "newSuperPass"` on the server).

### Troubleshooting

- **401 on every admin action / login fails immediately after success:** the `Authorization` header may be stripped. Confirm `api/.htaccess` was uploaded.
- **404 on all `/api/...` calls:** confirm `mod_rewrite` is active (default on Hostinger) and `api/.htaccess` is present.
- **500 errors:** check the DB credentials in `api/config.php` and that the schema imported without errors.
