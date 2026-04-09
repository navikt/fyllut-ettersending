---
name: cypress-mocks-workflow
description: >-
    Run and troubleshoot this repository's Cypress E2E flow with the local mocks server, correct startup order, and 
    readiness checks. Use when working on Cypress tests, mocks-server setup, local CI-like validation, or startup 
    failures around ports 3002/3200.
---

# Cypress + Mocks workflow

## Quick start (local development)

1. Copy test env values: `cp .env.test .env`
2. Start mocks server: `yarn mocks:no-cli` (expects port `3200`)
3. Start app: `yarn dev:test` (expects port `3002`)
4. Run tests: `yarn cypress`

Use this when iterating on test failures in `cypress/e2e/**`.

## CI-like local verification

```bash
yarn install --frozen-lockfile
yarn lint
cp .env.test .env
yarn build
yarn mocks:no-cli &
yarn start &
yarn cypress
```

## Repo-specific facts

- Cypress base URL is `http://localhost:3002/fyllut-ettersending`
- Readiness endpoint is `/fyllut-ettersending/api/internal/isready`
- Cypress mock target env values point to `http://127.0.0.1:3200`

## Fast troubleshooting

- If you see Turbopack/webpack mismatch errors, run repo scripts (`yarn dev`, `yarn dev:test`) instead of raw `next dev`.
- If Cypress cannot connect, verify both ports are listening (`3002` for app, `3200` for mocks).
- If startup hangs after a crash, stop stale processes on `3002/3200`; if needed, remove stale `.next/lock`.

## Useful focused commands

- Single spec: `yarn cypress --spec cypress/e2e/<spec>.cy.ts`
- Upgrade smoke gate: `yarn cypress --spec cypress/e2e/upgrade-smoke.spec.cy.ts`
