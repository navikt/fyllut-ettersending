export const distinct = <T>(values: T[]): T[] => {
  return Array.from(new Set(values));
};
