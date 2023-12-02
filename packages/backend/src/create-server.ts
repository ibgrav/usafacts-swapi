import { createServer as createHttpServer } from "node:http";

import type { ServerRoute } from "./types/backend";
import { PORT } from "./lib/constants";
import { filmsHandler } from "./handlers/films";
import { error404Handler } from "./handlers/error-404";
import { assetsHandler } from "./handlers/assets";

type Router = Record<string, ServerRoute>;

// key = pathname, value = handler
const v1Routes: Router = {
  films: filmsHandler
};

export function createServer() {
  const server = createHttpServer((req, res) => {
    // first serve any static assets, then go on to api responses, and finally 404
    assetsHandler(req, res, async () => {
      // For Prod: Update this to allow CORS requests only from the frontend addresses
      res.setHeader("Access-Control-Allow-Origin", "*");

      const method = req.method?.toUpperCase() || "GET";
      // since this is mostly used to extract the pathname and query, localhost is fine
      const url = new URL(req.url || "/", `http://localhost:${PORT}`);
      // slice off the leading slash
      const [base, version, ...paths] = url.pathname.slice(1).split("/");
      // build the api path to match router
      const pathname = paths.join("/");

      // only accept GET /api responses
      if (method === "GET" && base === "api") {
        let handler: ServerRoute | undefined = undefined;

        // version the API to allow for breaking changes
        if (version === "v1") {
          handler = v1Routes[pathname];
        }

        if (handler) {
          await handler(req, res);
        }
      }

      // if the headers have not been sent, then no handler was found (or an unknown error occured)
      if (!res.headersSent) {
        await error404Handler(req, res);
      }

      // For Prod: Invest in a good logging library, like pino or winston
      console.info("GET", url.href, res.statusCode);
    });
  });

  return { server };
}
