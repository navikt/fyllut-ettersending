import { Panel as NavPanel } from '@navikt/ds-react';
import { ReactNode } from 'react';
import styles from './panel.module.css';

interface Props {
  children: ReactNode;
}

const Panel = ({ children }: Props) => {
  return (
    <NavPanel className={styles.panel} border={true}>
      {children}
    </NavPanel>
  );
};

export default Panel;
