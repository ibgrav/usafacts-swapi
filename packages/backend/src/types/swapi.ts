export type SwapiPaginatedResponse<T> = {
  count: number;
  next: null | string;
  previous: null | string;
  results: Array<T>;
};

// these types are not complete, but I prefer to follow YAGNI - add as needed
export type SwapiFilmResponse = SwapiPaginatedResponse<{
  title: string;
  episode_id: number;
  starships: string[];
}>;

export type SwapiStarshipResponse = {
  name: string;
  cost_in_credits: string;
};
