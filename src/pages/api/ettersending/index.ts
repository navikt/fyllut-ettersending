import { NextApiRequest, NextApiResponse } from 'next';
import { createEttersending } from 'src/api/apiService';
import { getIdPortenToken } from 'src/api/loginRedirect';
import { EttersendelseApplication, EttersendingRequestBody } from '../../../data/domain';
import logger from '../../../utils/logger';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body: EttersendingRequestBody = req.body;
    const idportenToken = (await getIdPortenToken(req.headers.authorization)) as string;

    const response = await createEttersending(idportenToken, body);

    if (response.ok) {
      const ettersending = (await response.json()) as EttersendelseApplication;
      res.status(200);
      res.send(ettersending);
    } else {
      const errorResponse = await response.json();
      logger.error('Error creating ettersending', errorResponse);

      res.status(response.status);
      res.send(errorResponse);
    }
  }
};

export default handler;
