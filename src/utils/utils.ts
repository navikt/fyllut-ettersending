const isLocalDevelopment = () => {
  return process.env.APP_ENV !== 'development' && process.env.APP_ENV !== 'production';
};

export { isLocalDevelopment };
