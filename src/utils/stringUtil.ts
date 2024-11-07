const uncapitalize = (text?: string) => {
  if (!text) {
    return '';
  }
  return text.charAt(0).toLowerCase() + text.slice(1);
};

export { uncapitalize };
