import utils from "../../styles/utils.module.css";
import styles from "./main.module.css";
import { Chart } from "../chart/chart";
import { cn } from "../../lib/cn";

export function Main() {
  return (
    <main className={cn(utils.container, styles.main)}>
      <Chart />
    </main>
  );
}
