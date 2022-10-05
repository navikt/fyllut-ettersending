import styles from "./section.module.css";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Section = ({children}: Props) => {

  return (
    <div className={styles.section}>
      <main>
        {children}
      </main>
    </div>
  );
}

export default Section;