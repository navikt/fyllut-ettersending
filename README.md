# Ettersendelse av dokumentasjon til en søknad.

Testversjonen av løsningen er tilgjengelig på https://fyllut-ettersending.intern.dev.nav.no/fyllut-ettersending

## Utvikling

### Installere pakker lokalt

For å installere npm-pakker med @navikt-scope må man autentisere seg for registry `npm.pkg.github.com`,
så hvis man får `401 Unauthorized` ved installering må man kjøre følgende kommando:

    npm login --scope=@navikt --registry=https://npm.pkg.github.com

Logg på med github-brukernavn, og passordet man skal oppgi er et personlig access token (classic) som kan
genereres under [developer settings på GitHub](https://github.com/settings/tokens).
Token trenger kun `read:packages`. Husk å enable SSO for navikt-orgen!

_(Les mer om bruk av Github npm registry i NAV her: https://github.com/navikt/frontend#github-npm-registry)_

### Konfigurasjon

Man kan lage en lokal konfigurasjonsfil på `.env.local`:

```
FYLLUT_BASE_URL=https://fyllut-preprod.intern.dev.nav.no/fyllut
```

Merk: Når man går videre til `send-inn-frontend` for digital innsending hentes skjema fra Sanity. Mange av dev-skjemaene finnes ikke i Sanity og vil få 404.

### Lokal server

```bash
yarn dev
```

Serveren kjører på http://localhost:3002.

### Mocks Server

Man kan utvikle lokalt uten å være avhengig av eksterne api'er ved å kjøre opp en Mocks Server.

URLer i `.env.local` må peke til mock:

    INNSENDING_API_URL=http://127.0.0.1:3200
    SEND_INN_FRONTEND_URL=http://127.0.0.1:3200/send-inn-frontend
    MIN_SIDE_FRONTEND_URL=http://127.0.0.1:3200/min-side-frontend
    FYLLUT_BASE_URL=http://127.0.0.1:3200/fyllut

Start Mocks Server:

    yarn mocks

Start fyllut-ettersending på vanlig måte:

    yarn dev

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-fyllut-sendinn
