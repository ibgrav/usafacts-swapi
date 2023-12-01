import { IncomingMessage, ServerResponse } from "http";

export type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export type ErrorResponse = {
  error: string;
};

export function defineHandler(handler: Handler): Handler {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);

      if (!res.headersSent) {
        const message: ErrorResponse = { error: "internal server error" };

        res.statusCode = 500;
        res.end(JSON.stringify(message));
      }
    }
  };
}
