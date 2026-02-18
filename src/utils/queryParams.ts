export type FyllutEttersendingQueryParams = {
  tema?: string;
  gjelder?: string;
  sub?: string;
};

export const normalizeQueryValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export const mergeQueryString = (path: string, params: Record<string, string | undefined>) => {
  if (!path) {
    return path;
  }
  const cleaned = Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
  const [base, query = ''] = path.split('?');
  const merged = new URLSearchParams(query);
  Object.entries(cleaned).forEach(([key, value]) => {
    merged.set(key, value);
  });
  const qs = merged.toString();
  return qs ? `${base}?${qs}` : base;
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
