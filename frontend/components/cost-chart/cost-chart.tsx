import { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import type { FilmHandlerBody } from "../../../backend/handlers/films";

export type CostChartProps = FilmHandlerBody;

export function CostChart({ films }: CostChartProps) {
  const chartData = useMemo(() => {
    if (films) {
      // use a set to ensure we only have unique keys
      const keys = new Set<string>();

      const records = films.map((film) => {
        const filmData: Record<string, string | number> = {
          filmTitle: film.title
        };

        film.starships
          .sort((a, b) => a.cost_in_credits - b.cost_in_credits)
          .forEach((ship) => {
            keys.add(ship.name);
            filmData[ship.name] = (ship.cost_in_credits / 1_000_000).toPrecision(2);
          });

        return filmData;
      });

      return {
        records,
        // convert set to array for the chart
        keys: Array.from(keys)
      };
    }
  }, [films]);

  // TODO: better handling when there is no data - show a message?
  if (!chartData) return null;

  return (
    // the height/width could be set from the parent component if needed
    <div style={{ width: "100%", height: "600px" }}>
      <select></select>

      <ResponsiveBar
        indexBy="filmTitle"
        data={chartData.records}
        keys={chartData.keys}
        valueScale={{ type: "linear" }}
        padding={0.1}
        margin={{ top: 10, right: 10, bottom: 50, left: 120 }}
        role="application"
        ariaLabel="Bar Chart Star Wars Film Ship Cost Over Time"
        axisBottom={{
          legend: "Star Wars Film",
          legendPosition: "middle",
          legendOffset: 42
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          legend: "Total Ship Credit Cost (M)",
          legendPosition: "middle",
          legendOffset: -100
        }}
      />
    </div>
  );
}
