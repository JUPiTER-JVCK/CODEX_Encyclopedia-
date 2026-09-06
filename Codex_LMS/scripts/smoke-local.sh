#!/usr/bin/env bash
#
# Start the preview server, wait until it is actually listening, run the smoke
# test against it, and clean the server up on the way out.
#
# This exists so the wait logic lives in exactly one place. It was previously
# duplicated across lms.yml and two READMEs, and had already drifted: CI
# bounded its wait and failed with a message, while the documented loop was
# `until curl ...; do sleep 1; done` and would hang forever on a port conflict
# or a failed build, with nothing printed to say why.
#
#   PORT=4173 TIMEOUT=30 bash scripts/smoke-local.sh
#
set -euo pipefail

PORT="${PORT:-4173}"
TIMEOUT="${TIMEOUT:-30}"
URL="http://localhost:${PORT}/"

cd "$(dirname "$0")/.."

# A server already on the port would answer the readiness check immediately and
# the smoke test would pass against whatever that server is serving — a stale
# bundle, or another project entirely. Refuse rather than report a false green.
if curl -sf -o /dev/null "$URL"; then
  echo "something is already listening on ${URL}" >&2
  echo "stop it, or set PORT to a free port, before running the smoke test" >&2
  exit 1
fi

LOG="$(mktemp -t codex-preview.XXXXXX)"

# Job control puts the background job in its own process group, so the trap can
# kill the whole tree. `npm run preview` forks vite as a child: killing only the
# npm pid leaves vite running, reparented and still holding the port.
set -m
# --strictPort so vite fails loudly on a busy port instead of quietly moving to
# the next one, which would leave us probing a server we did not start.
npm run preview -- --port "$PORT" --strictPort > "$LOG" 2>&1 &
PREVIEW_PID=$!
set +m

cleanup() {
  kill -- -"$PREVIEW_PID" 2>/dev/null || kill "$PREVIEW_PID" 2>/dev/null || true
  rm -f "$LOG"
}
trap cleanup EXIT

for _ in $(seq "$TIMEOUT"); do
  if curl -sf -o /dev/null "$URL"; then
    break
  fi
  # If the server died outright, waiting the full timeout tells us nothing.
  if ! kill -0 "$PREVIEW_PID" 2>/dev/null; then
    echo "preview server exited before it began listening" >&2
    cat "$LOG" >&2
    exit 1
  fi
  sleep 1
done

if ! curl -sf -o /dev/null "$URL"; then
  # Distinguish "nothing is listening" from "listening, but not serving the
  # app". vite preview binds and 404s when dist/ is missing, so reporting that
  # as "never came up" sends people looking in the wrong place.
  code="$(curl -s -o /dev/null -w '%{http_code}' "$URL" || true)"
  if [ "$code" = "000" ]; then
    echo "preview server never began listening on ${URL} after ${TIMEOUT}s" >&2
  else
    echo "preview server is listening on ${URL} but returned HTTP ${code}" >&2
    echo "a missing or stale dist/ is the usual cause — run 'npm run build'" >&2
  fi
  echo "--- preview output ---" >&2
  cat "$LOG" >&2
  exit 1
fi

node test/smoke.mjs "$URL"
