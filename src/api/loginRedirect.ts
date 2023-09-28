import { verifyIdportenAccessToken } from "src/auth/verifyIdPortenToken";
import logger from "../utils/logger";
import { GetServerSidePropsContext } from "next/types";
import { UnauthenticatedError } from "src/data/domain";
import { isLocalDevelopment } from "src/utils/utils";

const getIdPortenToken = async (context: GetServerSidePropsContext) => {
  const authHeader = context.req.headers.authorization;

  if (isLocalDevelopment()) {
    logger.info("Mocking idporten jwt and pid");
    return "mock-idporten-token";
  } else if (authHeader) {
    const [, idportenToken] = authHeader.split(" ");
    try {
      await verifyIdportenAccessToken(idportenToken);
    } catch (e) {
      logger.info("Could not validate idporten token");
      throw new UnauthenticatedError("Could not validate idporten token");
    }
    return idportenToken;
  } else {
    logger.info("Missing jwt for digital submission");
    throw new UnauthenticatedError("Missing jwt for digital submission");
  }
};

export { getIdPortenToken };
