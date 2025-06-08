import { PinoLogger } from "hono-pino";
import { auth } from "./auth";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};
