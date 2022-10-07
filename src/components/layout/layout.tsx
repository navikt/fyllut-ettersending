import styles from "./layout.module.css";
import { ReactNode } from "react";
import { Heading, Link } from "@navikt/ds-react";
import { useRouter } from "next/router";
import classNames from "classnames";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();

  return (
    <div className={styles.layout}>
      <header className={classNames(styles.header, styles.content)}>
        <Heading size="xlarge" level="1">
          Ettersende dokumentasjon
        </Heading>
      </header>

      <hr className={styles.hr} />

      <div className={styles.content}>
        <Link href="#" onClick={() => router.back()} className={styles.backLink}>
          Tilbake
        </Link>
        {children}
      </div>
    </div>
  );
};

export default Layout;
