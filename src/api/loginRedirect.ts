import { verifyIdportenAccessToken } from "src/auth/verifyIdPortenToken";
import logger from "../utils/logger";
import { GetServerSidePropsContext } from "next/types";
import { getTokenxToken } from "src/auth/getTokenXToken";

const isDevelopment = () => {
  return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
};

const shouldRedirectToLogin = async (context: GetServerSidePropsContext) => {
  console.log(process.env.NODE_ENV);

  let tokenxToken: string | undefined = "";
  const sub = context.query?.sub as string | undefined;
  const authHeader = context.req.headers.authorization;

  if (isDevelopment()) {
    logger.info("Mocking idporten jwt and pid");
  } else if (authHeader) {
    let idportenToken: string;
    try {
      idportenToken = authHeader.split(" ")[1];
      await verifyIdportenAccessToken(idportenToken);
    } catch (e) {
      logger.info("kunne ikke validere idportentoken i beskyttetApi");
      return true;
    }
    tokenxToken = await getTokenxToken(idportenToken, process.env.INNSENDING_API_AUDIENCE ?? "");
    logger.info("tokenxToken", tokenxToken);
  } else if (sub === "digital") {
    logger.info("Missing jwt");
    return true;
  }

  return false;
};

export { shouldRedirectToLogin };
