import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const referrerParam = searchParams.get('referrer');
  const [referrerPage, setReferrerPage] = useState('');
  useEffect(() => {
    setReferrerPage((oldRef) => {
      if (!oldRef) {
        if (referrerParam && validateReferrer(referrerParam)) {
          return referrerParam;
        }
        if (document.referrer && validateReferrer(document.referrer)) {
          return document.referrer;
        }
      }
      return oldRef;
    });
  }, [referrerParam]);

  return referrerPage;
};
