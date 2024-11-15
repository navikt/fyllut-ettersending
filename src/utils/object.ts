export const excludeKeysEmpty = (obj: Record<string, string | undefined>) => {
  return Object.keys(obj).reduce((result, currentKey) => {
    return obj[currentKey] ? { ...result, [currentKey]: obj[currentKey] } : result;
  }, {});
};
