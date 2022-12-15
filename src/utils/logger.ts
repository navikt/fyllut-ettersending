const info = (message: string, details?: string) => {
  console.info(createLog("info", message, details));
};

const debug = (message: string, details?: string) => {
  console.debug(createLog("debug", message, details));
};

const error = (message: string, details?: string) => {
  console.error(createLog("error", message, details));
};

const createLog = (level: "debug" | "error" | "info", message: string, details?: string) => {
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
