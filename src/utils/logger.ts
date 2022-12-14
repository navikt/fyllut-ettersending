const info = (message: string, details?: string) => {
  log("info", message, details);
};

const debug = (message: string, details?: string) => {
  log("debug", message, details);
};

const error = (message: string, details?: string) => {
  log("error", message, details);
};

// Winston logging was problematic since in nextjs sometimes logging is frontend and sometimes backend.
// Created a custom winston inspired format instead.
const log = (level: "debug" | "error" | "info", message: string, details?: string) => {
  console.log(JSON.stringify({
    "@timestamp": Date.now(),
    level,
    message,
    details,
  }));
};

const logger = {
  info,
  debug,
  error,
};

export default logger;
