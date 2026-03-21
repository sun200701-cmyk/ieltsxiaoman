#!/usr/bin/env bash

set -euo pipefail

APP_NAME="yaxiaoman"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[1/5] Entering project directory..."
cd "$APP_DIR"

echo "[2/5] Pulling latest code..."
git pull --ff-only

echo "[3/5] Installing dependencies..."
npm install

echo "[4/5] Building project..."
npm run build

echo "[5/5] Restarting PM2 app..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  pm2 start npm --name "$APP_NAME" -- start
fi

pm2 save

echo "Deploy completed successfully."
