import utils from "../../styles/utils.module.css";
import styles from "./main.module.css";

import { cn } from "../../lib/cn";
import { useApiFilms } from "../../hooks/use-api-fetch";
import { Loading } from "../loading/loading";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";

// since the charts library is so large (250+ kB), only load when needed
const CostChart = lazy(() => import("../cost-chart/cost-chart").then((m) => ({ default: m.CostChart })));

export function Main() {
  const { loading, data, error } = useApiFilms();

  return (
    <main className={cn(utils.container, styles.main)}>
      {loading && <Loading />}

      {data && (
        <ErrorBoundary fallbackRender={Loading}>
          <Suspense>
            <CostChart {...data} />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* For Prod: better api error handling - fail silenty? retry api fetch? */}
      {error && <p>An error occured. Please refresh and try again.</p>}
    </main>
  );
}
