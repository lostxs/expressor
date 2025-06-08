import { createRoute, z } from "@hono/zod-openapi";
import { createRouter } from "../lib/create-hono";
import { HttpStatus } from "../constants/http-status";

export const playlistRouter = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatus.OK]: {
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
        description: "API Index",
      },
    },
  }),
  (c) => {
    return c.json(
      {
        message: "api response",
      },
      HttpStatus.OK
    );
  }
);
