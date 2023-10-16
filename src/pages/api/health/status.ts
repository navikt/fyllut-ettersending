import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthStatus {
  status: 'OK' | 'ISSUE' | 'DOWN';
  description?: string;
  logLink?: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HealthStatus>) {
  const response: HealthStatus = { status: 'OK', description: 'OK' };
  res.status(200).json(response);
}
