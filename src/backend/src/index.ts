import { createHono } from "./lib/create-hono";
import { configureOpenAPI } from "./config/open-api";
import { playlistRouter } from "./routes/playlist";

const app = createHono();

await configureOpenAPI(app);

const routes = [playlistRouter];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
