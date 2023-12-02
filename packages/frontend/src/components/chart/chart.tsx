import { ResponsiveBar } from "@nivo/bar";
import { useApiFilms } from "../../hooks/use-api-fetch";
import { useMemo } from "react";
import { Loading } from "../loading/loading";

export function Chart() {
  const { loading, data } = useApiFilms();

  const chartData = useMemo(() => {
    if (data) {
      // use a set to ensure we only have unique keys
      const keys = new Set<string>();

      const records = data.films.map((film) => {
        const filmData: Record<string, string | number> = {
          filmTitle: film.title
        };

        film.starships.forEach((ship) => {
          keys.add(ship.name);
          filmData[ship.name] = ship.cost_in_credits;
        });

        return filmData;
      });

      return {
        records,
        // convert set to array for the chart
        keys: Array.from(keys)
      };
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  if (chartData) {
    console.log(chartData);
    return <ResponsiveBar indexBy="filmTitle" data={chartData.records} keys={chartData.keys} />;
  }

  // For Prod: better api error handling - fail silenty? retry api fetch?
  return <p>An error occured. Please refresh and try again.</p>;
}
