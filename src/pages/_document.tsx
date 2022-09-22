import Document, { DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";
import { DocumentContext } from "next/dist/pages/_document";
import { Components, fetchDecoratorReact, Props } from "@navikt/nav-dekoratoren-moduler/ssr";

const decoratorParams: Props = {
  env: process.env.NODE_ENV === "production" ? "prod" : "dev",
  simple: true,
};

class _Document extends Document<{ Decorator: Components }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const Decorator = await fetchDecoratorReact(decoratorParams);
    return { ...initialProps, Decorator };
  }

  render() {
    const { Styles, Scripts, Header, Footer } = this.props.Decorator;

    return (
      <Html>
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
