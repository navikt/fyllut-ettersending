#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
IMAGE_TAG="${IMAGE_TAG:-fyllut-ettersending:local-verify}"
CONTAINER_NAME="${CONTAINER_NAME:-fyllut-ettersending-verify}"
HOST_PORT="${HOST_PORT:-3902}"
BASE_URL="http://127.0.0.1:${HOST_PORT}/fyllut-ettersending"

cleanup() {
  docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

cd "${REPO_ROOT}"

echo "[verify] Checking required files..."
test -f Dockerfile
test -f .dockerignore
test -f next-i18next.config.js
test -f .next/standalone/server.js

echo "[verify] Checking .dockerignore allowlist..."
grep -q '^!/next-i18next\.config\.js$' .dockerignore || {
  echo "[verify][error] .dockerignore does not allow next-i18next.config.js"
  exit 1
}

echo "[verify] Checking Dockerfile copy step..."
grep -q '^COPY \./next-i18next\.config\.js \.$' Dockerfile || {
  echo "[verify][error] Dockerfile does not copy next-i18next.config.js"
  exit 1
}

echo "[verify] Building image ${IMAGE_TAG}..."
docker build -t "${IMAGE_TAG}" .

echo "[verify] Starting container ${CONTAINER_NAME} on port ${HOST_PORT}..."
docker run --rm -d --name "${CONTAINER_NAME}" -p "${HOST_PORT}:3002" "${IMAGE_TAG}" >/dev/null

echo "[verify] Waiting for readiness..."
for _ in $(seq 1 30); do
  code="$(curl -s -o /tmp/fyllut-ready-body.txt -w "%{http_code}" "${BASE_URL}/api/internal/isready" || true)"
  if [[ "${code}" == "200" ]]; then
    break
  fi
  sleep 1
done

if [[ "${code:-}" != "200" ]]; then
  echo "[verify][error] Readiness failed with status ${code:-N/A}"
  docker logs "${CONTAINER_NAME}" 2>&1 | tail -n 120
  exit 1
fi

echo "[verify] Checking runtime i18n config presence..."
docker exec "${CONTAINER_NAME}" test -f /app/next-i18next.config.js || {
  echo "[verify][error] /app/next-i18next.config.js missing in container"
  docker logs "${CONTAINER_NAME}" 2>&1 | tail -n 120
  exit 1
}

echo "[verify] Checking /lospost page response..."
page_code="$(curl -s -o /tmp/fyllut-lospost-body.txt -w "%{http_code}" "${BASE_URL}/lospost" || true)"
if [[ "${page_code}" != "200" ]]; then
  echo "[verify][error] /lospost failed with status ${page_code}"
  head -c 240 /tmp/fyllut-lospost-body.txt || true
  echo
  docker logs "${CONTAINER_NAME}" 2>&1 | tail -n 120
  exit 1
fi

echo "[verify] Checking for known next-i18next runtime error..."
if docker logs "${CONTAINER_NAME}" 2>&1 | grep -q "next-i18next was unable to find a user config"; then
  echo "[verify][error] Found next-i18next missing-config error in logs"
  docker logs "${CONTAINER_NAME}" 2>&1 | tail -n 120
  exit 1
fi

echo "[verify] SUCCESS: Docker runtime verification passed."
