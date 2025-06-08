import { pinoLogger } from "hono-pino";
import { nanoid } from "nanoid";
import pino from "pino";
import { env } from "~/env";

export function logger() {
  return pinoLogger({
    pino: pino({
      level: env.HONO_LOG_LEVEL,
    }),
    http: {
      reqId: () => nanoid(),
    },
  });
}
