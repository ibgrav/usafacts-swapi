import { ServerResponse } from "http";

export function jsonResponse<T>(res: ServerResponse, data: T) {
  res.setHeader("Content-Type", "application/json");
  // Could throw error if data is not serializable - will bubble up to defineHandler
  res.end(JSON.stringify(data));
}
