export interface SwapiResponse<T> {
  count: number;
  next: null | string;
  previous: null | string;
  results: Array<T>;
}

export interface SwapiFilm {
  title: string;
  episode_id: number;
  starships: string[];
}

export interface SwapiStarship {
  name: string;
  cost_in_credits: string;
}
