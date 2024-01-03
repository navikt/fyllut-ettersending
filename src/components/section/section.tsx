import { ReactNode } from 'react';
import styles from './section.module.css';

interface Props {
  children: ReactNode;
  dataCy?: string;
}

const Section = ({ children, dataCy }: Props) => {
  return (
    <div className={styles.section} data-cy={dataCy}>
      {children}
    </div>
  );
};

export default Section;
