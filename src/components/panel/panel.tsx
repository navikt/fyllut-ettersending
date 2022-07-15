import styles from "./panel.module.css";
import { ReactNode } from "react";
import { Panel as NavPanel} from "@navikt/ds-react";

interface Props {
  children: ReactNode;
}

const Panel = ({children}: Props) => {
  return (
    <NavPanel className={styles.panel} border={true}>
      {children}
    </NavPanel>
  );
}

export default Panel;