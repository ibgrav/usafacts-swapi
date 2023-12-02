import { ErrorResponse, Handler, ServerRoute } from "../types/backend";
import { PORT } from "./constants";

export function defineHandler<T>(handler: Handler<T>): ServerRoute {
  return async (req, res) => {
    try {
      // For Prod: could add protocol and host to URL
      const url = new URL(req.url || "", `http://localhost:${PORT}`);

      const { status, headers, body } = await handler({ url });

      res.statusCode = status;

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }

      // in the event that other body types need to be supported, such as streams, a custom ServerRouter could be created
      // or the defineHandler function could be extended
      if (typeof body === "string") res.end(body);
      if (typeof body === "number") res.end(body.toString());

      if (typeof body === "object") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      }
    } catch (error) {
      console.error("handler error", error);

      const message: ErrorResponse = { error: "internal server error" };

      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(message));
      }
    }
  };
}
