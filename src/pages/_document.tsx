import {
  DecoratorComponents,
  DecoratorFetchProps,
  DecoratorLocale,
  fetchDecoratorReact,
} from '@navikt/nav-dekoratoren-moduler/ssr';
import { DocumentContext, DocumentInitialProps } from 'next/dist/pages/_document';
import Document, { Head, Html, Main, NextScript } from 'next/document';

type MyDocumentInitialProps = DocumentInitialProps & { Decorator: DecoratorComponents };

class _Document extends Document<{ Decorator: DecoratorComponents }> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    const { locale } = ctx;
    const language = locale === 'no' ? 'nb' : locale;

    const decoratorProps: DecoratorFetchProps = {
      env: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
      params: {
        simple: true,
        language: (language as DecoratorLocale) || 'nb',
        logoutWarning: true,
      },
    };
    const Decorator = await fetchDecoratorReact(decoratorProps);

    return { ...initialProps, Decorator };
  }

  render() {
    const { Styles, Scripts, Header, Footer } = this.props.Decorator;

    return (
      <Html lang={this.props.locale}>
        <Head>
          <meta name="description" content="Ettersend dokumentasjon" />
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
