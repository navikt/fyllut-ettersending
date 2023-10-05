import util from 'util';
import winston from 'winston';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoggingArgs = any[];

export const rawLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info', //Sett til 'debug', hvis debug-meldinger skal vises
      format: winston.format.json(),
    }),
  ],
});

// Etterlingner console.log - Støtter melding over flere parametere
const debug = (...msg: LoggingArgs) => rawLogger.debug(util.format(...msg));
const info = (...msg: LoggingArgs) => rawLogger.info(util.format(...msg));
const warn = (...msg: LoggingArgs) => rawLogger.warn(util.format(...msg));
const error = (...msg: LoggingArgs) => rawLogger.error(util.format(...msg));

const logger = {
  debug,
  info,
  warn,
  error,
};

export default logger;
