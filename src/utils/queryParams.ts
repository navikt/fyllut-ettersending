export type FyllutEttersendingQueryParams = {
  tema?: string;
  gjelder?: string;
  sub?: string;
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
