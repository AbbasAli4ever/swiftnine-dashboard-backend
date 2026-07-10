#!/usr/bin/env bash
# Template: run this ON the EC2 instance, from inside the repo directory,
# to pull the latest commit and redeploy under PM2.
#
# Fill in PROCESS_NAME and HEALTH_URL for your setup, then:
#   chmod +x scripts/deploy-ec2.sh
#   ./scripts/deploy-ec2.sh

set -euo pipefail

PROCESS_NAME="focushub-api"                          # <-- pm2 process name (see: pm2 list)
HEALTH_URL="http://localhost:3000/api/v1/health"      # <-- adjust port if different

echo "==> Checking working tree is clean"
if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree has uncommitted changes. Aborting." >&2
  git status --short
  exit 1
fi

echo "==> Pulling latest commit"
git pull origin main

echo "==> Installing dependencies"
npm ci

echo "==> Generating Prisma client and applying migrations"
npm run db:generate
npm run db:migrate:prod

echo "==> Building"
npm run build

echo "==> Restarting PM2 process: $PROCESS_NAME"
pm2 restart "$PROCESS_NAME"

echo "==> Health check"
sleep 2
curl -sf "$HEALTH_URL" || { echo "Health check failed" >&2; exit 1; }
echo ""
echo "==> Deploy complete. Recent logs:"
pm2 logs "$PROCESS_NAME" --lines 30 --nostream
