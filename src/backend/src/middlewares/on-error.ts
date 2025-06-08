import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { env } from "~/env";
import { HttpStatus } from "../constants/http-status";

export const onError: ErrorHandler = (err, c) => {
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;

  const statusCode =
    currentStatus !== HttpStatus.OK
      ? (currentStatus as ContentfulStatusCode)
      : HttpStatus.INTERNAL_SERVER_ERROR;

  return c.json(
    {
      message: err.message,

      stack: env.NODE_ENV === "production" ? undefined : err.stack,
    },
    statusCode
  );
};
