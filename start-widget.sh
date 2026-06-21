#!/usr/bin/env bash
# Start CCM-HQ chatbot server so the login-page widget can load.
# Widget script src in cm-app points at http://localhost:3001 by default.
set -e

PORT=3001
cd "$(dirname "$0")"

# Free the port if something is already on it.
lsof -ti tcp:$PORT | xargs kill -9 2>/dev/null || true

echo "Starting CCM-HQ chatbot on http://localhost:$PORT ..."
exec pnpm dev -p $PORT
