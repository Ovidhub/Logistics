POSALFAST LOGISTICS — UPLOAD GUIDE
================================
Everything in this bundle is ready to deploy to cPanel / Hostinger shared hosting.
There is no build step: these are the compiled production files.

FILES IN THIS PACKAGE
---------------------
posalfast-website.zip   -> upload to public_html (the React site: index.html, assets/, images/)
posalfast-database.sql  -> import into a MySQL database (tables + admin accounts, no sample data)
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

If you host the API on a different domain, add VITE_API_URL before building the
frontend, or edit the API base URL in the built bundle.

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
Tracking says "The API is not reachable at /api"
  -> Step 3 was skipped, or public_html/api/ is in the wrong place.
Login fails with a 401 straight after a successful sign-in
  -> api/.htaccess is missing (it carries the Authorization header).
404 on every /api/... request
  -> mod_rewrite is off, or api/.htaccess did not upload.
500 errors
  -> Wrong database credentials in api/config.php, or the SQL import failed.
No sample shipment to test with
  -> Create one at /#/admin/login; the tracking number is generated automatically.
