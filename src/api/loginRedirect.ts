import { verifyIdportenAccessToken } from "src/auth/verifyIdPortenToken";
import logger from "../utils/logger";
import { GetServerSidePropsContext } from "next/types";
import { getTokenxToken } from "src/auth/getTokenXToken";
import { SubmissionType, UnauthenticatedError } from "src/data/domain";

const isDevelopment = () => {
  return process.env.APP_ENV !== "development" && process.env.APP_ENV !== "production";
};

const getIdPortenToken = async (context: GetServerSidePropsContext) => {
  const sub = context.query?.sub;
  const authHeader = context.req.headers.authorization;

  if (isDevelopment()) {
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
  } else if (sub === SubmissionType.digital) {
    logger.info("Missing jwt for digital submission");
    throw new UnauthenticatedError("Missing jwt for digital submission");
  }
};

const fetchEttersendinger = async (idportenToken: string, id: string) => {
  try {
    let tokenxToken = "mock-tokenx-token";
    if (!isDevelopment()) {
      tokenxToken = (await getTokenxToken(
        idportenToken,
        process.env.INNSENDING_API_AUDIENCE ?? "dev-gcp:team-soknad:innsending-api"
      )) as string;
    }

    const response = await fetch(
      `${process.env.INNSENDING_API_URL}/frontend/v1/skjema/${id}/soknader?soknadstyper=ettersendelse`,
      { headers: { Authorization: `Bearer ${tokenxToken}` } }
    );

    return await response.json();
  } catch (ex: any) {
    logger.error("Could not fetch ettersendinger", ex);
    return [];
  }
};

export { getIdPortenToken, fetchEttersendinger };
