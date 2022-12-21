import { NextApiRequest, NextApiResponse } from "next";
import { download } from "../../api/frontPageService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log(req.body);
    res.status(200).json(await download(req.body));
  }
}

export default handler;