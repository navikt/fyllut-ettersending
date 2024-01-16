import { GetServerSidePropsContext } from 'next/types';
import { verifyIdportenAccessToken } from 'src/auth/verifyIdPortenToken';
import { SubmissionType, UnauthenticatedError } from 'src/data/domain';
import { isLocalDevelopment } from 'src/utils/utils';
import logger from '../utils/logger';

const getIdPortenTokenFromContext = async (context: GetServerSidePropsContext) => {
  const sub = context.query?.sub;
  const authHeader = context.req.headers.authorization ?? (context.req.headers.Authorization as string);

  return getIdPortenToken(authHeader, sub);
};

const getIdPortenToken = async (authHeader?: string, sub?: string | string[] | undefined) => {
  if (isLocalDevelopment()) {
    logger.info('Mocking idporten jwt and pid');
    return 'mock-idporten-token';
  } else if (authHeader) {
    const [, idportenToken] = authHeader.split(' ');
    try {
      await verifyIdportenAccessToken(idportenToken);
    } catch (e) {
      logger.warn('Could not validate idporten token', e);
      throw new UnauthenticatedError('Could not validate idporten token');
    }
    return idportenToken;
  } else if (sub === SubmissionType.digital) {
    logger.info('Missing jwt for digital submission');
    throw new UnauthenticatedError('Missing jwt for digital submission');
  }
};

export { getIdPortenToken, getIdPortenTokenFromContext };
