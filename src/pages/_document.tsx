import { Components, fetchDecoratorReact, Props } from "@navikt/nav-dekoratoren-moduler/ssr";
import { DocumentContext } from "next/dist/pages/_document";
import Document, { Head, Html, Main, NextScript } from "next/document";

const decoratorProps: Props = {
  env: process.env.NODE_ENV === "production" ? "prod" : "dev",
  simple: true,
};

class _Document extends Document<{ Decorator: Components }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    let Decorator;
    if (!!process.env.MOCK || process.env.NODE_ENV === "test") {
      Decorator = {
        Styles: () => {},
        Scripts: () => {},
        Header: () => {},
        Footer: () => {},
      };
    } else {
      Decorator = await fetchDecoratorReact(decoratorProps);
    }

    return { ...initialProps, Decorator };
  }

  render() {
    const { Styles, Scripts, Header, Footer } = this.props.Decorator;

    return (
      <Html lang="no">
        <Head>
          <meta name="description" content="Ettersending dokumentasjon" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Styles />
        <Scripts />
        <body>
          <Header />
          <main className="main">
            <Main />
          </main>
          <Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default _Document;
