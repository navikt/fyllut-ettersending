import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const validateReferrer = (ref: string) => {
  if (typeof window !== "undefined") {
    const refUrl = new URL(ref);
    console.log("val", ref, refUrl.origin === location.origin);
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
          console.log("referrerParam", referrerParam);
          return referrerParam;
        }
        if (document.referrer && validateReferrer(document.referrer)) {
          console.log("document.referrer", document.referrer);
          return document.referrer;
        }
      }
      console.log("referrerParam already set, or not exist", oldRef);
      return oldRef;
    });
  }, [referrerParam]);

  return referrerPage;
};
