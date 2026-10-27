#!/usr/bin/env bash
# Build the upload-ready bundles in download/.
#
#   bash scripts/build-release.sh
#
# Produces:
#   download/atrans-website.zip  – compiled frontend (index.html, assets/, images/)
#   download/atrans-api.zip      – PHP API (no tests, no config.php)
#   download/atrans-database.sql – copy of api/schema.sql (tables + accounts)
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Installing dependencies"
npm install --no-audit --no-fund

echo "==> Building frontend"
npm run build

mkdir -p download

echo "==> Packaging frontend"
rm -f download/atrans-website.zip
(cd dist && zip -qr ../download/atrans-website.zip index.html assets images)

echo "==> Packaging API"
rm -f download/atrans-api.zip
zip -qr download/atrans-api.zip api -x "api/tests/*" -x "api/config.php" -x "api/*.sqlite"

echo "==> Copying database schema"
cp api/schema.sql download/atrans-database.sql

echo "==> Done"
ls -lh download
