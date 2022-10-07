import styles from "./section.module.css";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Section = ({children}: Props) => {

  return (
    <div className={styles.section}>
        {children}
    </div>
  );
}

export default Section;