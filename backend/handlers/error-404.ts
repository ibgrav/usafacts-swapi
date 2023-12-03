import { defineHandler } from "../lib/handler";
import { ErrorResponse } from "../../types/backend";

export const error404Handler = defineHandler<ErrorResponse>(async () => {
  return {
    status: 404,
    body: { error: "not found" }
  };
});
