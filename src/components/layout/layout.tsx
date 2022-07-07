import styles from './layout.module.css';
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  );
}

export default Layout;