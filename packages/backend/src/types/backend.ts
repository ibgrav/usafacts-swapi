import { IncomingMessage, ServerResponse } from "node:http";

// Basic function that accept request and response object - expected to call res.end() from within.
export type ServerRoute = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;

// Instead of ServerRoute, Handler requires returning a custom response object,
// allowing for better testing, error handling, and developer experience.
export type Handler<T = void> = (event: RequestEvent) => Promise<HandlerResponse<T>>;

// Custom event object is passed for much easier mock testing.
// Could be extended in the future with additional request context.
export type RequestEvent = {
  url: URL;
};

export type HandlerResponse<T> = {
  headers?: Record<string, string>;
  status: number;
  body: T;
};

export type ErrorResponse = {
  error: string;
};

// primarily used in the frontend to type the api fetch responses
export type HandlerResult<T> = T | ErrorResponse;
