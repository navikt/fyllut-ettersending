import { verifyIdportenAccessToken } from "src/auth/verifyIdPortenToken";
import logger from "../utils/logger";
import { GetServerSidePropsContext } from "next/types";
import { getTokenxToken } from "src/auth/getTokenXToken";
import { UnauthenticatedError } from "src/data/domain";

const isDevelopment = () => {
  return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
};

const fetchEttersendinger = async (context: GetServerSidePropsContext) => {
  const sub = context.query?.sub as string | undefined;
  const id = context.params?.id as string;
  const authHeader = context.req.headers.authorization;

  if (isDevelopment()) {
    logger.info("Mocking idporten jwt and pid");
  } else if (authHeader) {
    const [, idportenToken] = authHeader.split(" ");
    try {
      await verifyIdportenAccessToken(idportenToken);
    } catch (e) {
      logger.info("Could not validate idporten token");
      throw new UnauthenticatedError("Could not validate idporten token");
    }

    const tokenxToken = await getTokenxToken(
      idportenToken,
      process.env.INNSENDING_API_AUDIENCE ?? "dev-gcp:team-soknad:innsending-api"
    );

    logger.info(`Fetching ettersendinger for ${id}`);
    const response = await fetch(
      `${process.env.INNSENDING_API_URL}/frontend/v1/skjema/${id}/soknader?soknadstyper=ettersendelse`,
      { headers: { Authorization: `Bearer ${tokenxToken}` } }
    );

    return response.json();
  } else if (sub === "digital") {
    logger.info("Missing jwt");
    throw new UnauthenticatedError("Missing jwt");
  }

  return [];
};

export { fetchEttersendinger };
