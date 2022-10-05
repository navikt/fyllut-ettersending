import { Params } from "@navikt/nav-dekoratoren-moduler";
import { injectDecoratorServerSide } from "@navikt/nav-dekoratoren-moduler/ssr/index.js";

export type Props = Params & (
  | { env: "prod" | "dev" }
  | { env: "localhost"; port: number; }
  );

const getDecorator = async (env: "prod" | "dev", filePath: string) => {
  injectDecoratorServerSide({
    env: env,
    filePath: filePath,
    simple: true,
    urlLookupTable: false,
    chatbot: false
  });
}

export { getDecorator };