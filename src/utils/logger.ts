import ecsFormat from "@elastic/ecs-winston-format";
import { createLogger, transports } from "winston";

export const logger = createLogger({
  level: process.env.LOGLEVEL || "info",
  silent: process.env.NODE_ENV === "test",
  format: ecsFormat({ apmIntegration: false }),
  transports: [new transports.Console()],
});
