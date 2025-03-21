const Paths = {
  base: '/',
  details: (id: string) => '/' + id,
  downloadPage: (id: string) => `/${id}/last-ned`,
  otherDocumentation: '/lospost',
  formDocumentation: '/ettersendelse',
  submissionType: (id: string) => `/${id}/innsendingsvalg`,
  navFrontPage: (locale: string) => (locale === 'en' ? 'https://nav.no/en' : 'https://nav.no'),
  navMyPage: (locale: string) => (locale === 'en' ? 'https://nav.no/minside/en' : 'https://nav.no/minside'),
  navContactUsPage: (locale: string) =>
    locale === 'en' ? 'https://nav.no/kontaktoss/en' : 'https://nav.no/kontaktoss',
  navReportBugPage: (locale: string) =>
    `https://www.nav.no/person/kontakt-oss/${locale}/tilbakemeldinger/feil-og-mangler`,
};

export { Paths };
