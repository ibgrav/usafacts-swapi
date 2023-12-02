import utils from "../../styles/utils.module.css";
import styles from "./main.module.css";
import { CostChart } from "../cost-chart/cost-chart";
import { cn } from "../../lib/cn";
import { useApiFilms } from "../../hooks/use-api-fetch";
import { Loading } from "../loading/loading";

export function Main() {
  const { loading, data, error } = useApiFilms();

  return (
    <main className={cn(utils.container, styles.main)}>
      {loading && <Loading />}
      {data && <CostChart {...data} />}
      {/* For Prod: better api error handling - fail silenty? retry api fetch? */}
      {error && <p>An error occured. Please refresh and try again.</p>}
    </main>
  );
}
