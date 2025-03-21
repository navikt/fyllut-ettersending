import { QuerySubmissionType } from './types';

export const getSubmissionTypeFromString = (string: string): QuerySubmissionType => {
  if (!Object.values(QuerySubmissionType).includes(string as QuerySubmissionType)) {
    throw new Error(`Invalid submission type: ${string}`);
  }
  return QuerySubmissionType[string as keyof typeof QuerySubmissionType];
};
