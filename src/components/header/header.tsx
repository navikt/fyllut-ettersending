import styles from './header.module.css';
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Header = ({children}: Props) => {
  return (
    <header className={styles.header}>
      {children}
    </header>
  );
}

export default Header;