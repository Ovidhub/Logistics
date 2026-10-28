#!/usr/bin/env bash
# Build the upload-ready bundles in download/.
#
#   bash scripts/build-release.sh
#
# Produces:
#   download/posalfast-website.zip  – compiled frontend (index.html, assets/, images/)
#   download/posalfast-api.zip      – PHP API (no tests, no config.php)
#   download/posalfast-database.sql – copy of api/schema.sql (tables + accounts)
#   download/posalfast-database.zip – same SQL in a zip, so a browser downloads it
#                                     instead of displaying it as plain text
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Installing dependencies"
npm install --no-audit --no-fund

echo "==> Building frontend"
npm run build

mkdir -p download

echo "==> Packaging frontend"
rm -f download/posalfast-website.zip
(cd dist && zip -qr ../download/posalfast-website.zip index.html assets images)

echo "==> Packaging API"
rm -f download/posalfast-api.zip
zip -qr download/posalfast-api.zip api -x "api/tests/*" -x "api/config.php" -x "api/*.sqlite"

echo "==> Copying database schema"
cp api/schema.sql download/posalfast-database.sql

# GitHub (and several browsers) render a .sql file as text instead of
# downloading it. Ship the same file zipped as well, so "click to download"
# behaves the way people expect.
echo "==> Zipping database schema"
rm -f download/posalfast-database.zip
(cd download && zip -q posalfast-database.zip posalfast-database.sql)

echo "==> Done"
ls -lh download
