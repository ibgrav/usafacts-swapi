import { Header } from "../header/header";
import { Main } from "../main/main";
import styles from "./app.module.css";

export function App() {
  return (
    <div className={styles.layout}>
      <Header title="Star Wars Ship Cost Over Time" />
      <Main />
    </div>
  );
}
