const Paths = {
  base: '/',
  details: (id: string) => '/' + id,
  downloadPage: (id: string) => `/${id}/last-ned`,
  otherDocumentation: '/lospost',
  formDocumentation: '/ettersendelse',
  submissionType: (id: string) => `/${id}/innsendingsvalg`,
};

export { Paths };
