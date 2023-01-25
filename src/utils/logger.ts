const info = (message: string, details?: string) => {
  console.info(createLog(message, details));
};

const debug = (message: string, details?: string) => {
  console.debug(createLog(message, details));
};

const error = (message: string, details?: string) => {
  console.error(createLog(message, details));
};

const createLog = (message: string, details?: string) => {
  return JSON.stringify({
    message,
    details,
  });
};

const logger = {
  info,
  debug,
  error,
};

export default logger;
