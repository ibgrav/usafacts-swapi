import { ServerRoute } from "../types/backend";
import { filmsHandler } from "./handlers/api/v1/films";

type Router = Record<string, ServerRoute>;

// assumes /api is the base path
// key = pathname, value = handler
export const apiV1Router: Router = {
  films: filmsHandler
};
