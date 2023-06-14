# Ettersendelse av dokumentasjon til en søknad.

Testversjonen av løsningen er tilgjengelig på https://fyllut-ettersending.intern.dev.nav.no

## Utvikling

### Installere pakker lokalt 

_(Hentet fra https://github.com/navikt/frontend#installere-pakker-lokalt)_

For å installere npm pakker med @navikt-scope trenger du en `.npmrc`-fil med følgende:

```
//npm.pkg.github.com/:_authToken=TOKEN
@navikt:registry=https://npm.pkg.github.com
```

Token genererer du under [developer settings på Github](https://github.com/settings/tokens). Den trenger kun `read:packages`. Husk å enable SSO for navikt-orgen!

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
