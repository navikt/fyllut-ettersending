import logger from '../utils/logger';

const texasConfig = {
  exchange_endpoint: process.env.NAIS_TOKEN_EXCHANGE_ENDPOINT!,
};

type TexasExchangeResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export const getTokenxToken = async (subject_token: string, audience: string) => {
  const response = await fetch(texasConfig.exchange_endpoint, {
    body: JSON.stringify({
      identity_provider: 'tokenx',
      target: audience,
      user_token: subject_token,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    logger.warn('TokenX exchange failed', { status: response.status, body: await response.text() });
    throw new Error(`TokenX exchange failed: ${response.statusText}`);
  }
  const responseBody: TexasExchangeResponse = await response.json();
  return responseBody.access_token;
};
