import { NextApiRequest, NextApiResponse } from "next";
import { getForms } from "../../../api/apiService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(200).json(await getForms());
  }
}

export default handler;