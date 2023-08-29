import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const validateReferrer = (ref: string) => {
  if (typeof window !== "undefined") {
    const refUrl = new URL(ref);
    return refUrl.origin === location.origin;
  }
  return false;
};

export const useReffererPage = () => {
  const searchParams = useSearchParams();
  const referrerParam = searchParams.get("referrer");
  const [referrerPage, setReferrerPage] = useState("");
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
