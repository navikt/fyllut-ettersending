import { DecoratorComponents, fetchDecoratorReact, DecoratorFetchProps, DecoratorLocale } from "@navikt/nav-dekoratoren-moduler/ssr";
import { DocumentContext, DocumentInitialProps } from "next/dist/pages/_document";
import Document, { Head, Html, Main, NextScript } from "next/document";

type MyDocumentInitialProps = DocumentInitialProps & {Decorator: DecoratorComponents}

class _Document extends Document<{ Decorator: DecoratorComponents }> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    let Decorator;
    if (process.env.SKIP_DECORATOR === "true") {
      Decorator = {
        Styles: () => <></>,
        Scripts: () => <></>,
        Header: () => <></>,
        Footer: () => <></>,
      };
    } else {
      const { locale} = ctx;
      const decoratorProps: DecoratorFetchProps = {
        env: process.env.NODE_ENV === "production" ? "prod" : "dev",
        params: {
          simple: true,
          language: locale as DecoratorLocale || "nb",
          logoutWarning: true,
        },
      };
      Decorator = await fetchDecoratorReact(decoratorProps);
    }

    return { ...initialProps, Decorator };
  }

  render() {
    const { Styles, Scripts, Header, Footer } = this.props.Decorator;

    return (
      <Html lang={this.props.locale}>
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
