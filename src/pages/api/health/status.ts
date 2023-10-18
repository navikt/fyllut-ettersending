import type { NextApiRequest, NextApiResponse } from 'next';

interface ApplicationStatus {
  status: 'OK' | 'ISSUE' | 'DOWN';
  description?: string;
  logLink?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApplicationStatus>) {
  const response: ApplicationStatus = {
    status: 'OK',
    description: 'OK',
    logLink: process.env.LOG_LINK || 'https://logs.adeo.no/app/r/s/joMHK',
  };
  res.status(200).json(response);
}
