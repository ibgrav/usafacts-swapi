import { createServer as createHttpServer } from "node:http";

import type { ServerRoute } from "../types/backend";
import { PORT } from "./lib/constants";
import { error404Handler } from "./handlers/error-404";
import { assetsHandler } from "./handlers/assets";
import { apiV1Router } from "./router";

export function createServer() {
  /*
    Using the raw node http Server, as opposed to a framework such as fastify or express,
    is mostly to demonstrate my understanding of the underlying http concepts.
    In a production environment, I would most likely rely on the documentation, stability,
    plugins, and standards set by a framework community.
  */
  const server = createHttpServer((req, res) => {
    // first serve any static assets, then go on to api responses, and finally 404
    assetsHandler(req, res, async () => {
      const method = req.method?.toUpperCase() || "GET";
      // since this is mostly used to extract the pathname and query, localhost is fine
      const url = new URL(req.url || "/", `http://localhost:${PORT}`);
      // slice off the leading slash
      const [base, version, ...paths] = url.pathname.slice(1).split("/");
      // build the api path to match router
      const pathname = paths.join("/");

      const timestamp = performance.now();
      // For Prod: Invest in a good logging library, like pino or winston
      console.info("REQUEST GET", url.href);

      // only accept GET /api responses
      if (method === "GET" && base === "api") {
        let handler: ServerRoute | undefined = undefined;

        // version the API to allow for breaking changes
        if (version === "v1") {
          handler = apiV1Router[pathname];
        }

        if (handler) {
          await handler(req, res);
        }
      }

      // if the headers have not been sent, then no handler was found (or an unknown error occured)
      if (!res.headersSent) {
        await error404Handler(req, res);
      }

      const timing = ((performance.now() - timestamp) / 1000).toFixed(2);
      console.info("RESPONSE GET", `${timing}s`, res.statusCode, url.href);
    });
  });

  return { server };
}
