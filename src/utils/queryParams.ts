export type FyllutEttersendingQueryParams = {
  tema?: string;
  gjelder?: string;
  sub?: string;
};

export const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, value);
    }
  });
  return searchParams.toString();
};

export const addParamsToReferrer = (referrerPage: string, params: Record<string, string | undefined>): string => {
  try {
    const url = new URL(referrerPage);
    Object.entries(params).forEach(([key, value]) => {
      if (value && !url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  } catch {
    return referrerPage;
  }
};

type ValidationResult = {
  success: boolean;
};

export const validateQueryParams = (params: FyllutEttersendingQueryParams): ValidationResult => {
  const { tema, gjelder, sub } = params;

  if (tema !== undefined && !/^[A-Z]{3}$/.test(tema)) {
    return { success: false };
  }

  if (gjelder !== undefined && !/^[0-9a-zA-ZøæåØÆÅ\s]+$/.test(gjelder)) {
    return { success: false };
  }

  if (sub !== undefined && !['digital', 'paper'].includes(sub)) {
    return { success: false };
  }

  return { success: true };
};
