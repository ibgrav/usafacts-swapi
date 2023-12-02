import { cachedFetchJson } from "../lib/cached-fetch-json";
import { SWAPI_URL } from "../lib/constants";
import { defineHandler } from "../lib/handler";
import { SwapiFilmResponse, SwapiStarshipResponse } from "../types/swapi";

export type FilmHandlerBody = {
  films: Array<FilmHandlerFilm>;
};

export type FilmHandlerFilm = {
  title: string;
  episode_id: number;
  starships: Array<FilmHandlerStarship>;
};

export type FilmHandlerStarship = {
  name: string;
  cost_in_credits: number;
};

export const filmsHandler = defineHandler<FilmHandlerBody>(async () => {
  const response = await cachedFetchJson<SwapiFilmResponse>(`${SWAPI_URL}/films`);

  // the additional ship data could be fetched on the frontend, but since the requirements of this API
  // are known (and it's an internal microservice), my preference is to keep logic in the backend
  const pendingFilmPromises = response.results.map(async (film) => {
    // map through each starship url and fetch the data to calculate the cost
    const pendingSharshipPromises = film.starships.map(async (shipUrl) => {
      // if an error is thrown here, it will be caught by the handler wrapper
      // and converted into a 500 response - we want all fetches to return ok
      const ship = await cachedFetchJson<SwapiStarshipResponse>(shipUrl);

      return {
        name: ship.name,
        // NaN filtered out below
        cost_in_credits: Number(ship.cost_in_credits)
      } satisfies FilmHandlerStarship;
    });

    // remove starships that do not have a cost, or cost is not valid number
    const starships = (await Promise.all(pendingSharshipPromises)).filter(
      (ship) => ship.cost_in_credits && !isNaN(ship.cost_in_credits)
    );

    return {
      title: film.title,
      // used for sorting on the frontend
      episode_id: film.episode_id,
      starships
    } satisfies FilmHandlerFilm;
  });

  const body = {
    films: await Promise.all(pendingFilmPromises)
  } satisfies FilmHandlerBody;

  return {
    body,
    status: 200,
    headers: {
      // cache for one hour - this data doesn't change often
      "Cache-Control": "max-age=3600"
    }
  };
});
