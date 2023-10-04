const info = (message: string, details?: string | Error) => {
  console.info(createLog(message, details));
};

const debug = (message: string, details?: string | Error) => {
  console.debug(createLog(message, details));
};

const error = (message: string, details?: string | Error) => {
  console.error(createLog(message, details));
};

const createLog = (message: string, details?: string | Error) => {
  if (details instanceof Error) {
    return JSON.stringify({
      message,
      details: {
        name: details.name,
        message: details.message,
        stack: details.stack,
      },
    });
  }

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
