import type { NextApiRequest, NextApiResponse } from 'next';

interface ApplicationStatus {
  status: 'OK' | 'ISSUE' | 'DOWN';
  description?: string;
  logLink?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApplicationStatus>) {
  const response: ApplicationStatus = { status: 'OK', description: 'OK' };
  res.status(200).json(response);
}
