import { NextApiRequest, NextApiResponse } from "next";
import { download } from "../../api/frontPageService";
import { getFileName } from "../../utils/formDataUtil";
import { FormData } from "../../data/domain";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const formData: FormData = req.body;
    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${getFileName(formData)}`);
    res.send(await download(formData));
  }
};

export default handler;
