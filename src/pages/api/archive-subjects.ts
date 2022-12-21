import { NextApiRequest, NextApiResponse } from "next";
import { getArchiveSubjects } from "../../api/apiService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.status(200).json(await getArchiveSubjects());
  }
}

export default handler;