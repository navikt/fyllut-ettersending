import { IncomingHttpHeaders } from 'http';
import { GetServerSidePropsContext } from 'next/types';

const getRefererWithoutQueryParams = (headers: IncomingHttpHeaders) => {
  if (headers.referer) {
    return headers.referer.split('?')[0] || '';
  }
  return '';
};

function createRedirect(resolvedUrl: string, headers: IncomingHttpHeaders, locale: string | undefined) {
  const refererQuerySeparator = resolvedUrl.includes('?') ? '&' : '?';
  const referer = getRefererWithoutQueryParams(headers);
  const referrerQuery = referer ? `${refererQuerySeparator}referrer=${referer}` : '';
  const locale2 = locale && locale !== 'nb' ? `/${locale}` : '';
  return `/fyllut-ettersending${locale2}` + resolvedUrl + referrerQuery;
}

export const getLoginRedirect = (context: GetServerSidePropsContext): string => {
  const { resolvedUrl, locale, req } = context;
  const { headers } = req;

  return createRedirect(resolvedUrl, headers, locale);
};

export const FOR_TEST = {
  createRedirect,
};
