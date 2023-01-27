import { NextApiRequest, NextApiResponse } from "next";
import { getForm } from "../../../api/apiService";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === "GET") {
    res.status(200).json(await getForm(String(id)));
  }
};

export default handler;
