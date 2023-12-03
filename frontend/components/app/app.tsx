import utils from "../../styles/utils.module.css";
import styles from "./app.module.css";
import { CostChart } from "../cost-chart/cost-chart";
import { Header } from "../header/header";

export function App() {
  return (
    <>
      <Header title="Starship Credit Cost vs. Episode Number" />

      <div className={utils.container}>
        <main className={styles.main}>
          <CostChart />
        </main>
      </div>
    </>
  );
}
