import styles from "./loading.module.css";

export function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loading} role="alert" aria-label="loading"></div>
    </div>
  );
}
