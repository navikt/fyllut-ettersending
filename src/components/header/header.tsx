import styles from "./header.module.css";
import { Heading } from "@navikt/ds-react";


const Header = () => {
  return (
    <header className={styles.header}>
      <div className="header-content">
        <Heading size="xlarge" level="1">
          Ettersende dokumentasjon
        </Heading>
        <Heading size="small">SKJEMA OG SØKNAD</Heading>
      </div>
    </header>
  );
};

export default Header;
