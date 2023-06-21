import { DecoratorComponents, fetchDecoratorReact, DecoratorFetchProps } from "@navikt/nav-dekoratoren-moduler/ssr";
import { DocumentContext, DocumentInitialProps } from "next/dist/pages/_document";
import Document, { Head, Html, Main, NextScript } from "next/document";

const decoratorProps: DecoratorFetchProps = {
  env: process.env.NODE_ENV === "production" ? "prod" : "dev",
  params: {
    simple: true,
  },
};

type MyDocumentInitialProps = DocumentInitialProps & {Decorator: DecoratorComponents}

class _Document extends Document<{ Decorator: DecoratorComponents }> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    let Decorator;
    if (!!process.env.MOCK || process.env.NODE_ENV === "test") {
      Decorator = {
        Styles: () => <></>,
        Scripts: () => <></>,
        Header: () => <></>,
        Footer: () => <></>,
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
