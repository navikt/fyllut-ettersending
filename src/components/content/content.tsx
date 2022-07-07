import styles from './content.module.css';
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Content = ({children}: Props) => {
  return (
    <main className={styles.content}>
      {children}
    </main>
  );
}

export default Content;