import { ReactNode } from 'react';
import styles from './section.module.css';

interface Props {
  children: ReactNode;
}

const Section = ({ children }: Props) => {
  return <div className={styles.section}>{children}</div>;
};

export default Section;
