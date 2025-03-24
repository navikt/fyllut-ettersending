import { NextApiRequest } from 'next';
import { AllowedSubmissionType, AllowedSubmissionType_Old, EnvQualifierType } from '../data/domain';

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

/**
 *
 * Metoden er implementert for å støtte bakoverkompatibilitet. Fjernes etter migrering
 */
function mapInnsendingTypeToSubmissionTypes(
  allowedSubmissionType?: AllowedSubmissionType_Old,
): AllowedSubmissionType[] {
  if (!allowedSubmissionType) return ['PAPER', 'DIGITAL'];

  switch (allowedSubmissionType) {
    case 'PAPIR_OG_DIGITAL':
      return ['PAPER', 'DIGITAL'];
    case 'KUN_PAPIR':
      return ['PAPER'];
    case 'KUN_DIGITAL':
      return ['DIGITAL'];
    case 'INGEN':
      return [];
    default:
      return [];
  }
}

export { getEnvQualifier, mapInnsendingTypeToSubmissionTypes };
