import { NextApiRequest, NextApiResponse } from 'next';
import { createLospost } from '../../../api/apiService';
import { getIdPortenToken } from '../../../api/loginRedirect';
import { LospostRequestBody, isHttpError } from '../../../data/domain';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body: LospostRequestBody = req.body;
    const idportenToken = (await getIdPortenToken(req.headers.authorization)) as string;

    try {
      const response = await createLospost(idportenToken, body);
      res.status(response.status);
      res.setHeader('location', response.headers.get('location')!);
      res.send(await response.json());
    } catch (error) {
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
