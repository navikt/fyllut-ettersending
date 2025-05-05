import { NextApiRequest, NextApiResponse } from 'next';
import { download } from '../../api/frontPageService';
import { DownloadCoverPageRequestBody, isHttpError } from '../../data';
import { getFileName } from '../../utils/formDataUtil';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const lang = req.headers['accept-language'];
    const body: DownloadCoverPageRequestBody = req.body;
    try {
      const result = await download(body, lang);
      res.status(200);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${getFileName(body.formData)}`);
      res.send(result);
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
