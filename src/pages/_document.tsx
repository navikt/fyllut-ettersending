import Document, { DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";
import { DocumentContext } from "next/dist/pages/_document";
import { fetchDecoratorReact } from "@navikt/nav-dekoratoren-moduler/ssr";

class _Document extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    const Decorator = await fetchDecoratorReact({
      env: process.env.NODE_ENV === "production" ? "prod" : "dev",
      simple: true,
      chatbot: false
    });

    return {...initialProps, Decorator};
  }

  render() {
    const {Styles, Scripts, Header, Footer} = this.props.Decorator;

    return (
      <Html>
        <Head>
          <meta name="description" content="Ettersending dokumentasjon"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>
        <Styles/>
        <Scripts/>
        <body>
          <Header/>
          <Main/>
          <Footer/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default _Document;
