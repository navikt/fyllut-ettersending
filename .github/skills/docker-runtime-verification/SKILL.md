---
name: docker-runtime-verification
description: Verify this repository's Docker image build and runtime behavior with deterministic checks for standalone Next.js deployments. Use when changing Dockerfile/.dockerignore, Next/i18n config, startup scripts, or debugging Kubernetes startup and Internal Server Error issues.
---

# Docker runtime verification

## Quick start

```bash
yarn build
bash .github/skills/docker-runtime-verification/scripts/verify-docker-runtime.sh
```

## What this verifies

- Docker image builds from current repo state.
- Container starts and serves on mapped port.
- `/app/next-i18next.config.js` exists in runtime image.
- Readiness endpoint returns `200`: `/fyllut-ettersending/api/internal/isready`.
- Logs do not contain known failure: `next-i18next was unable to find a user config`.
- `/fyllut-ettersending/lospost` responds with `200`.

## Repo-specific checks

- Confirms `.dockerignore` allows `next-i18next.config.js`.
- Confirms `Dockerfile` copies `next-i18next.config.js` into `/app`.

## Typical fixes when it fails

- Add missing allowlist entry in `.dockerignore`.
- Add missing `COPY` for runtime config in `Dockerfile`.
- Rebuild app (`yarn build`) so `.next/standalone` is fresh.
- Inspect emitted container logs printed by the script on failure.
