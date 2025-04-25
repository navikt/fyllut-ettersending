import logger from '../utils/logger';

const texasConfig = {
  introspection_endpoint: process.env.NAIS_TOKEN_INTROSPECTION_ENDPOINT!,
};

type ValidToken = {
  active: true;
  client_id: string;
  acr: string;
};

type TexasIntrospectionResponse = { active: false } | ValidToken;

export async function verifyIdportenAccessToken(token?: string) {
  if (!token) {
    throw new Error('IdPortenToken is undefined');
  }
  const response = await fetch(texasConfig.introspection_endpoint, {
    body: JSON.stringify({
      identity_provider: 'idporten',
      token,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    logger.warn('Token introspection failed', { status: response.status, body: await response.text() });
    throw new Error(`Token introspection failed: ${response.statusText}`);
  }
  const validatedToken: TexasIntrospectionResponse = await response.json();
  if (!validatedToken.active) {
    throw new Error('IdPortenToken is expired');
  }

  const { client_id, acr } = validatedToken;

  if (client_id !== process.env.IDPORTEN_CLIENT_ID) {
    throw new Error('client_id matcher ikke min client ID');
  }

  if (acr !== 'Level4' && acr !== 'idporten-loa-high') {
    throw new Error('For lavt sikkerhetsnivå - acr: ' + acr);
  }
  return validatedToken;
}
