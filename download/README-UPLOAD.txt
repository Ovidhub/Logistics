POSALFAST LOGISTICS — UPLOAD GUIDE
================================
Everything in this bundle is ready to deploy to cPanel / Hostinger shared hosting.
There is no build step: these are the compiled production files.

FILES IN THIS PACKAGE
---------------------
posalfast-website.zip   -> upload to public_html (the React site: index.html, assets/, images/)
posalfast-database.sql  -> import into a MySQL database (tables + admin accounts, no sample data)
posalfast-database.zip  -> the same SQL in a zip. Use this one if your browser opens the
                           .sql as text instead of saving it; unzip, then import the .sql
posalfast-api.zip       -> optional: the PHP API. Upload as public_html/api/ for live tracking/admin.

STEP 1 — CREATE THE DATABASE
----------------------------
1. hPanel -> Databases -> MySQL Databases.
2. Create a database and a user; assign the user to the database.
3. Write down: database name, username, password, host (usually localhost).
4. hPanel -> phpMyAdmin -> open that database -> Import -> choose posalfast-database.sql -> Go.

You now have four tables: users, shipments, tracking_events, settings.
shipments is intentionally empty — no demo consignments ship with this build.

STEP 2 — UPLOAD THE WEBSITE
---------------------------
1. hPanel -> File Manager -> public_html.
2. Upload posalfast-website.zip and extract it there.
3. Confirm you end up with:
     public_html/index.html
     public_html/assets/...
     public_html/images/...
4. Delete the zip afterwards.

STEP 3 (OPTIONAL) — CONNECT THE PHP API
---------------------------------------
Tracking, the admin portal and the super-admin portal need the API and database.

1. Upload + extract posalfast-api.zip so it sits at public_html/api/
   (that is: public_html/api/index.php, public_html/api/src/, public_html/api/vendor/ ...).
2. Copy public_html/api/config.example.php to public_html/api/config.php
3. Fill in the database details from step 1 and set a long random jwt_secret:
     php -r "echo bin2hex(random_bytes(32));"
4. Confirm public_html/api/.htaccess exists (it ships in the zip). It is required
   for routing and for the Authorization header used by the portals.

IF THE WEBSITE IS ON A STATIC HOST (Vercel / Netlify) AND THE API IS NOT
-----------------------------------------------------------------------
Vercel cannot run PHP, so the API must live on this PHP hosting instead. Put the
API on a subdomain of its own and point the frontend at it:

1. cPanel -> Domains -> Create A New Domain -> "api.yourdomain.com"
   Document root: public_html/api   (so index.php sits at the subdomain root)
2. Upload + extract posalfast-api.zip into that document root.
3. Visit https://api.yourdomain.com/settings — you should get JSON, not HTML.
4. Rebuild the frontend with the API address baked in, then redeploy:
     VITE_API_URL=https://api.yourdomain.com npm run build
   (no trailing /api unless the files really live in an /api folder)
5. In api/config.php leave 'cors_origin' => '*' , or set it to
   'https://posalfast.com'. Do not remove it: without CORS headers the browser
   blocks the login before it reaches PHP.

A wrong database password now returns a JSON 503 ("Database connection failed")
instead of a blank page, so check api/config.php if you see that message.

STEP 4 — SIGN IN
----------------
Admin portal:        https://yourdomain.com/#/admin/login
  username: admin
  password: Posalfast#Admin2026

Super admin portal:  https://yourdomain.com/#/super-admin/login
  username: superadmin
  password: Posalfast#Super2026

CHANGE BOTH PASSWORDS IMMEDIATELY AFTER THE FIRST LOGIN.
Generate new bcrypt hashes on the server:
    php api/tools/make_hash.php "your-new-password"
Then paste each hash into users.password_hash (phpMyAdmin -> users -> Edit).

STEP 5 — EDIT THE SITE CONTENT
------------------------------
Super admin -> Site Settings covers:
  Branding (site name, accent letter, tagline, logo)
  Contact info, social links, business hours
  Homepage hero title / subtitle / button text
  About section copy
  Statistics counters
  Theme colour
Changes are stored in the settings table and appear for every visitor.
The Google Map on the last section of every page follows the address you set here.

TROUBLESHOOTING
---------------
Tracking or login says "The API is not reachable at /api"
  -> Step 3 was skipped, or public_html/api/ is in the wrong place.

Login says "Request failed (405)" (or 404)
  -> The site is being served by a static host (Vercel, Netlify, GitHub Pages)
     that has no PHP runtime, so the POST to /api/auth/login is refused before
     it reaches any PHP code. This is NOT a wrong username or password.
     Fix: host the api/ folder on PHP hosting (e.g. a subdomain such as
     api.yourdomain.com pointing at your cPanel IP), then rebuild the frontend
     with VITE_API_URL=https://api.yourdomain.com/api so it calls that address.
Login fails with a 401 straight after a successful sign-in
  -> api/.htaccess is missing (it carries the Authorization header).
404 on every /api/... request
  -> mod_rewrite is off, or api/.htaccess did not upload.
500 errors
  -> Wrong database credentials in api/config.php, or the SQL import failed.
No sample shipment to test with
  -> Create one at /#/admin/login; the tracking number is generated automatically.
