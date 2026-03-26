import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const validateReferrer = (referrer: string) => {
  if (typeof window !== 'undefined') {
    // Matches the root domain (eg nav.no, or localhost:3000), not including subdomains (www.nav.no would result in this match: nav.no)
    const rootDomainRegex = /(?=[^.]+\.)?[^.]+$/;
    const [rootDomain] = location.host.match(rootDomainRegex) || [];
    return !!rootDomain && referrer.includes(rootDomain);
  }
  return false;
};

export const useReffererPage = () => {
  // Referrer query param is used when the client is redirected to authentication page (idporten), since document.referrer will refer to the auth page
  const { query, isReady } = useRouter();
  const [referrerPage, setReferrerPage] = useState('');

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') {
      return;
    }

    const referrerValue = query.referrer;
    const referrerParam = typeof referrerValue === 'string' ? referrerValue : referrerValue?.[0];

    setReferrerPage((oldReferrer) => {
      if (oldReferrer) {
        return oldReferrer;
      }

      if (referrerParam && validateReferrer(referrerParam)) {
        return referrerParam;
      }

      if (document.referrer && validateReferrer(document.referrer)) {
        return document.referrer;
      }

      return oldReferrer;
    });
  }, [isReady, query.referrer]);

  return referrerPage;
};
