import { rest } from "msw";
import { mockFilmHandlerBody } from "../mock/api/v1/films/film-handler-body";
import { apiUrlPath } from "../frontend/hooks/use-api-fetch";
import { MswParameters } from "msw-storybook-addon";

// extract the api paths for reuse elsewhere (like overriding the default msw handler)
export const mswApiPaths = {
  films: `${apiUrlPath}/films`
};

export const mswParameters: MswParameters = {
  msw: {
    handlers: [
      rest.get(mswApiPaths.films, async (_req, res, ctx) => {
        return res(ctx.json(mockFilmHandlerBody));
      })
    ]
  }
};
