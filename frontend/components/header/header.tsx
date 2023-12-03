import { cn } from "../../lib/cn";
import utils from "../../styles/utils.module.css";
import styles from "./header.module.css";

export interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <div className={styles.wrapper}>
      <header className={cn(utils.container, styles.header)}>
        <h1 className={styles.title}>{title}</h1>
      </header>
    </div>
  );
}
