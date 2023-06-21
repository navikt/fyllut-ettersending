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

### Lokal server

```bash
yarn dev
```

Serveren kjører på http://localhost:3002.
