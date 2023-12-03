import { cachedFetchJson } from "../lib/cached-fetch-json";
import { SWAPI_URL } from "../lib/constants";
import { defineHandler } from "../lib/handler";
import { SwapiFilmResponse, SwapiStarshipResponse } from "../../types/swapi";

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

  // set of unique starship URLs - many films contain the same ships, don't want to fetch twice
  const shipUrls: Set<string> = new Set();

  response.results.forEach((film) => {
    film.starships.forEach((shipUrl) => {
      // duplicate ship URLs will be filtered out by the Set
      shipUrls.add(shipUrl);
    });
  });

  const pendingSharshipPromises = Array.from(shipUrls).map((shipUrl) => {
    // the additional ship data could be fetched on the frontend, but since the requirements of this API
    // are known (and it's an internal microservice), my preference is to keep logic in the backend
    return cachedFetchJson<SwapiStarshipResponse>(shipUrl);
  });

  // wait for all starship data to be fetched in parallel
  const shipData = await Promise.all(pendingSharshipPromises);

  const films = response.results.map((film) => {
    const starships: FilmHandlerStarship[] = [];

    shipData.forEach((ship) => {
      const cost = Number(ship.cost_in_credits);
      // filter out ships that do not have a cost, or cost is not valid number, or this film does not contain the ship
      if (cost && !isNaN(cost) && film.starships.includes(ship.url)) {
        starships.push({ name: ship.name, cost_in_credits: cost });
      }
    });

    return {
      title: film.title,
      // used for sorting on the frontend
      episode_id: film.episode_id,
      starships
    } satisfies FilmHandlerFilm;
  });

  return {
    body: { films },
    status: 200,
    headers: {
      // cache for one month - this data doesn't change (would need to be confirmed with the API owner)
      "Cache-Control": "max-age=2592000"
    }
  };
});
