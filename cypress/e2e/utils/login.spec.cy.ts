import { IncomingHttpHeaders } from 'node:http';
import { FOR_TEST } from '../../../src/utils/login';

describe('utils/login', () => {
  it('Creates redirect url', () => {
    const referer = 'https://www.nav.no/fyllut-ettersending/lospost';
    const resolvedUrl = '/lospost/digital';
    const headers: IncomingHttpHeaders = { referer };
    const locale = undefined;
    const redirectUrl = FOR_TEST.createRedirect(resolvedUrl, headers, locale);
    expect(redirectUrl).to.eq(`/fyllut-ettersending/lospost/digital?referrer=${referer}`);
  });

  it('Excludes query params from referer header', () => {
    const referer = 'https://www.nav.no/fyllut-ettersending/lospost?tema=SYK';
    const resolvedUrl = '/lospost/digital?tema=SYK';
    const headers: IncomingHttpHeaders = { referer };
    const locale = undefined;
    const redirectUrl = FOR_TEST.createRedirect(resolvedUrl, headers, locale);
    expect(redirectUrl).to.eq(
      `/fyllut-ettersending/lospost/digital?tema=SYK&referrer=https://www.nav.no/fyllut-ettersending/lospost`,
    );
  });

  it('Excludes referer when no header', () => {
    const referer = undefined;
    const resolvedUrl = '/lospost/digital?tema=SYK';
    const headers: IncomingHttpHeaders = { referer };
    const locale = undefined;
    const redirectUrl = FOR_TEST.createRedirect(resolvedUrl, headers, locale);
    expect(redirectUrl).to.eq(`/fyllut-ettersending/lospost/digital?tema=SYK`);
  });

  describe('Locale', () => {
    it('Includes en', () => {
      const referer = 'https://www.nav.no/fyllut-ettersending/lospost';
      const resolvedUrl = '/lospost/digital';
      const headers: IncomingHttpHeaders = { referer };
      const locale = 'en';
      const redirectUrl = FOR_TEST.createRedirect(resolvedUrl, headers, locale);
      expect(redirectUrl).to.eq(`/fyllut-ettersending/en/lospost/digital?referrer=${referer}`);
    });

    it('Includes nn', () => {
      const referer = 'https://www.nav.no/fyllut-ettersending/lospost';
      const resolvedUrl = '/lospost/digital';
      const headers: IncomingHttpHeaders = { referer };
      const locale = 'nn';
      const redirectUrl = FOR_TEST.createRedirect(resolvedUrl, headers, locale);
      expect(redirectUrl).to.eq(`/fyllut-ettersending/nn/lospost/digital?referrer=${referer}`);
    });

    it('Excludes nb', () => {
      const referer = 'https://www.nav.no/fyllut-ettersending/lospost';
      const resolvedUrl = '/lospost/digital';
      const headers: IncomingHttpHeaders = { referer };
      const locale = 'nb';
      const redirectUrl = FOR_TEST.createRedirect(resolvedUrl, headers, locale);
      expect(redirectUrl).to.eq(`/fyllut-ettersending/lospost/digital?referrer=${referer}`);
    });
  });
});
