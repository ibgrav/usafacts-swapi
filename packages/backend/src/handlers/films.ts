import { cachedFetchJson } from "../lib/cached-fetch-json";
import { SWAPI_URL } from "../lib/constants";
import { defineHandler } from "../lib/handler";
import { jsonResponse } from "../lib/response";

export const handlerFilms = defineHandler(async (_, res) => {
  const data = await cachedFetchJson(`${SWAPI_URL}/films`);

  res.statusCode = 200;

  jsonResponse(res, data);
});
