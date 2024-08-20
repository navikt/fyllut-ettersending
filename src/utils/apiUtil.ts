import { NextApiRequest } from 'next';
import { EnvQualifierType } from '../data/domain';

const getEnvQualifier = (req: NextApiRequest): EnvQualifierType | undefined => {
  const host = req.headers['host'];
  if (host?.includes('local')) {
    return 'local';
  }
  if (host?.includes('intern.dev')) {
    return 'preprodIntern';
  }
  if (host?.includes('ansatt.dev')) {
    return 'preprodAnsatt';
  }
  return undefined;
};

export { getEnvQualifier };
