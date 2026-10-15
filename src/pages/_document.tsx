import {
  DecoratorComponentsReact,
  DecoratorFetchProps,
  DecoratorLocale,
  fetchDecoratorReact,
} from '@navikt/nav-dekoratoren-moduler/ssr';
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';

type MyDocumentInitialProps = DocumentInitialProps & { Decorator: DecoratorComponentsReact };

class _Document extends Document<{ Decorator: DecoratorComponentsReact }> {
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
    const { HeadAssets, Scripts, Header, Footer } = this.props.Decorator;

    return (
      <Html lang={this.props.locale}>
        <Head>
          <meta name="description" content="Ettersend dokumentasjon" />
          <link rel="icon" href="/favicon.ico" />
          <HeadAssets />
        </Head>
        <body>
          <Header />
          <main className="main">
            <Main />
          </main>
          <Footer />
          <Scripts />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default _Document;
