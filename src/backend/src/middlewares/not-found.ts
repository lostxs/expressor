import type { NotFoundHandler } from "hono";

import { HttpStatus } from "../constants/http-status";

export const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${"NOT FOUND"} - ${c.req.path}`,
    },
    HttpStatus.NOT_FOUND
  );
};
