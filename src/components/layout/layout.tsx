import "@navikt/ds-css";
import styles from "./layout.module.css";
import { ReactNode } from "react";
import { Heading, Link } from "@navikt/ds-react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { Left } from "@navikt/ds-icons";

interface Props {
  title?: string;
  children: ReactNode;
}

const Layout = ({ title, children }: Props) => {
  const router = useRouter();

  return (
    <div className={styles.layout}>
      <header className={classNames(styles.header, styles.content)}>
        <Heading size="xlarge" level="1">
          { title ?? "Ettersende dokumentasjon" }
        </Heading>
      </header>

      <hr className={styles.hr} />

      <div className={styles.content}>
        <Link href="#" onClick={(e) => {
          router.back();
          e.currentTarget.blur();
        }} className={styles.backLink}>
          <Left className={styles.backLinkIcon} aria-hidden={true} />Gå tilbake
        </Link>
        {children}
      </div>
    </div>
  );
};

export default Layout;
