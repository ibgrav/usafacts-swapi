import styles from "./cost-chart.module.css";
import { lazy, useMemo, Suspense, useState, ComponentPropsWithoutRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useApiFilms } from "../../hooks/use-api-fetch";
import { Loading } from "../loading/loading";

// since the charts library is so large (250+ kB), only load when needed
// also demonstrate how to lazy load components
const ResponsiveBar = lazy(() => import("@nivo/bar").then((m) => ({ default: m.ResponsiveBar })));

type ResponsiveBarProps = ComponentPropsWithoutRef<typeof ResponsiveBar>;
// extracted since the types are not exported from the library
type ValueScale = Exclude<ResponsiveBarProps["valueScale"], undefined>["type"];
// included to ensure the select options are typesafe
const valueScales: ValueScale[] = ["linear", "log", "symlog", "point", "band", "time"];

export function CostChart() {
  const [maxCredit, setMaxCredit] = useState<number>(0);
  const [valueScale, setValueScale] = useState<ValueScale>("symlog");

  const { loading, data, error } = useApiFilms();

  // use memo so that we are only looping thruogh the data when it changes
  const chartData = useMemo(() => {
    // need to better handle what is shown when api does not return data
    if (data?.films) {
      // use a set to ensure we only have unique keys
      const keys = new Set<string>();

      // want the data in chronological order
      data.films.sort((a, b) => a.episode_id - b.episode_id);

      const records = data.films.map((film) => {
        const filmData: Record<string, string | number> = {
          filmTitle: `${film.episode_id}. ${film.title}`
        };

        film.starships
          // sort by cost ascending
          // for some reason the chart does not always show the correct order - am thinging it's a config issue
          .sort((a, b) => a.cost_in_credits - b.cost_in_credits)
          .forEach((ship) => {
            const cost = (ship.cost_in_credits / 1_000_000).toPrecision(2);
            // filter out ships that cost more than the max credit if set
            if (!maxCredit || Number(cost) <= maxCredit) {
              keys.add(ship.name);
              // show cost in per million, since numbers are SO large
              filmData[ship.name] = (ship.cost_in_credits / 1_000_000).toPrecision(2);
            }
          });

        return filmData;
      });

      return {
        records,
        // convert set to array for the chart
        keys: Array.from(keys)
      };
    }
  }, [data, maxCredit]);

  return (
    <>
      {loading && <Loading />}

      {/* For Prod: better api error handling - fail silenty? retry api fetch? */}
      {error && (
        // not sure if aria-errormessage is appropriate here
        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-errormessage
        <p role="alert" aria-label="data error">
          An error occured. Please refresh and try again.
        </p>
      )}

      {chartData && (
        <>
          <p>
            The chart below shows the total cost of starships for each Star Wars film, in millions of credits, listed
            chronologically by the episode number (not the release date). We can observe that cost of starships peaked
            significantly in episode 4, A New Hope, due to the overwhelming cost of the Death Star (1,000,000,000,000 credits).
            In conclusion, spending on starships has not gone down over time.
          </p>

          <div className={styles["form-box"]}>
            <form className={styles.form}>
              <label htmlFor="chart-valuescale-select">Value Scale</label>
              {/* 
                  added a select to demonstrate a controled form element in React
                  but also because I truly don't know the best way to visualize this data
               */}
              <select
                id="chart-valuescale-select"
                value={valueScale}
                onChange={(e) => setValueScale(e.target.value as ValueScale)}
              >
                {valueScales.map((scale) => (
                  <option key={scale}>{scale}</option>
                ))}
              </select>
            </form>
            {/* setting a max credit to avoid the death star helps to see the rest of the data */}
            <form className={styles.form}>
              <label htmlFor="chart-max-credit">Max Credits (M)</label>
              <input
                id="chart-max-credit"
                type="number"
                value={maxCredit}
                onChange={(e) => setMaxCredit(Number(e.target.value))}
              />
            </form>
          </div>

          {/* the height/width could be set from the parent component if needed */}
          <div className={styles["chart-box"]}>
            <div style={{ width: "900px", height: "600px" }}>
              <ErrorBoundary fallbackRender={Loading}>
                <Suspense>
                  {/* todo for prod: this chart isn't super mobile-friendly.
                      ideally figure out a better way to display data on small screens than just scroll
                  */}
                  <ResponsiveBar
                    indexBy="filmTitle"
                    data={chartData.records}
                    keys={chartData.keys}
                    valueScale={{ type: valueScale }}
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
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </>
      )}
    </>
  );
}
