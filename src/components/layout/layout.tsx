import "@navikt/ds-css";
import styles from "./layout.module.css";
import { ReactNode } from "react";
import { Heading, Link } from "@navikt/ds-react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useTranslation } from "next-i18next";

interface Props {
  title?: string;
  children: ReactNode;
  showBackLink?: boolean;
}

const Layout = ({ title, children, showBackLink = true }: Props) => {
  const router = useRouter();
  const {t} = useTranslation("common");

  // Only show back link if we are not on the front page
  const backLink = () => {
    if (router.route !== "/" && showBackLink) {
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
          {t("button.previous")}
        </Link>
      );
    }
  };

  return (
    <div className={styles.layout}>
      <header className={classNames(styles.header, styles.content)}>
        <Heading size="xlarge" level="1">
          {title ?? t("heading.default-title")}
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
