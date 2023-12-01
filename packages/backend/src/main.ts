import { createServer } from "node:http";
import { type Handler } from "./types/backend";
import { PORT } from "./lib/constants";
import { handlerFilms } from "./handlers/films";
import { jsonResponse } from "./lib/response";

const routes: Record<string, Handler> = {
  films: handlerFilms
};

const server = createServer(async (req, res) => {
  // For Production: Update this to allow CORS requests only from the frontend addresses
  res.setHeader("Access-Control-Allow-Origin", "*");

  const url = new URL(req.url || "", `http://localhost:${PORT}`);

  // slice of the leading slash
  const handler = routes[url.pathname.slice(1)];

  if (handler) {
    await handler(req, res);
  }

  if (!res.headersSent) {
    res.statusCode = 404;
    jsonResponse(res, { error: "not found" });
  }

  // For Production: Invest in a good logging library, like pino or winston
  console.info("GET", url.href, res.statusCode);
});

// listen on 0.0.0.0 to expose the server to the outside container (Docker) network
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening http://127.0.0.1:${PORT}`);
});

// For Production: Test to ensure server is shut down gracefully
const exitServer = () => {
  server.close(() => {
    console.log(" Backend server closed");
  });
};

process.on("SIGINT", exitServer);
process.on("SIGTERM", exitServer);
