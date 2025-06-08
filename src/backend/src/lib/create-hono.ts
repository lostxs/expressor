import { OpenAPIHono } from "@hono/zod-openapi";

import { auth } from "../config/auth";
import { logger } from "../middlewares/logger";
import { notFound } from "../middlewares/not-found";
import { onError } from "../middlewares/on-error";
import { AppBindings } from "../config/types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
  });
}

export function createHono() {
  const app = createRouter();

  app.use(logger());
  app.notFound(notFound);
  app.onError(onError);

  app.on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

  return app;
}
