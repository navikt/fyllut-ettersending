import { NextApiRequest, NextApiResponse } from 'next';
import { createEttersending } from 'src/api/apiService';
import { getIdPortenToken } from 'src/api/loginRedirect';
import { EttersendingRequestBody, isHttpError } from '../../../data/domain';
import logger from '../../../utils/logger';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body: EttersendingRequestBody = req.body;
    const idportenToken = (await getIdPortenToken(req.headers.authorization)) as string;

    try {
      const response = await createEttersending(idportenToken, body);
      res.status(200);
      res.send(response);
    } catch (error) {
      logger.error('Error creating ettersending', error);
      if (isHttpError(error)) {
        res.status(error.status);
        res.send({ message: error.message });
      } else {
        res.status(500);
        res.send({ message: 'Internal server error' });
      }
    }
  }
};

export default handler;
