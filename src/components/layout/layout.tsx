import "@navikt/ds-css";
import styles from "./layout.module.css";
import { ReactNode } from "react";
import { Heading, Link } from "@navikt/ds-react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { ArrowLeftIcon } from "@navikt/aksel-icons";

interface Props {
  title?: string;
  children: ReactNode;
}

const Layout = ({ title, children }: Props) => {
  const router = useRouter();

  // Only show back link if we are not on the front page
  const backLink = () => {
    if (router.route !== "/") {
      return (
        <Link
          href="#"
          onClick={(e) => {
            router.back();
            e.currentTarget.blur();
          }}
          className={styles.backLink}
        >
          <ArrowLeftIcon className={styles.backLinkIcon} aria-hidden={true} />
          Gå tilbake
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
