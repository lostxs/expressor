import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings } from "./types";
import packageJson from "../../../../package.json";
import { Scalar } from "@scalar/hono-api-reference";

export async function configureOpenAPI(app: OpenAPIHono<AppBindings>) {
  app.doc31("/reference.json", {
    openapi: "3.1.1",
    info: {
      title: "DEN4 API",
      version: packageJson.version,
      description: "DEN4 API Documentation",
    },
  });

  app.get(
    "/reference",
    Scalar({
      _integration: "hono",
      // Next route handle prefix
      url: "/api/reference.json",
      pageTitle: "DEN4 API Reference",
      theme: "deepSpace",
      layout: "modern",
    })
  );
}
