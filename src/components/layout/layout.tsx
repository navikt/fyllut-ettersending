import "@navikt/ds-css";
import styles from "./layout.module.css";
import { ReactNode } from "react";
import { Heading, Link as NavLink } from "@navikt/ds-react";
import classNames from "classnames";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import Link from "next/link";

interface Props {
  title?: string;
  children: ReactNode;
  backUrl?: string;
}

const Layout = ({ title, children, backUrl }: Props) => {
  // Only show back link if we are not on the front page
  const backLink = () => {
    if (backUrl) {
      return (
        <Link href={backUrl} passHref legacyBehavior>
          <NavLink className={styles.backLink}>
            <ArrowLeftIcon className={styles.backLinkIcon} aria-hidden={true} />
            Gå tilbake
          </NavLink>
        </Link>
      );
    }
  };

  return (
    <div className={styles.layout}>
      <header className={classNames(styles.header, styles.content)}>
        <Heading size="xlarge" level="1">
          {title ?? "Ettersende dokumentasjon"}
        </Heading>
      </header>

      <hr className={styles.hr} />
      <div className={styles.content}>
        {backLink()}
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
