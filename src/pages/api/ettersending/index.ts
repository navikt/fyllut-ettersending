import { NextApiRequest, NextApiResponse } from 'next';
import { createEttersending } from 'src/api/apiService';
import { getIdPortenToken } from 'src/api/loginRedirect';
import { EttersendingRequestBody } from '../../../data/domain';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body: EttersendingRequestBody = req.body;
    const idportenToken = (await getIdPortenToken(req.headers.authorization)) as string;

    // FIXME: Send correct status code
    res.status(200);
    res.send(await createEttersending(idportenToken, body));
  }
};

export default handler;
