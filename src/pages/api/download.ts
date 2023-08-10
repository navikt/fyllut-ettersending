import { NextApiRequest, NextApiResponse } from "next";
import { download } from "../../api/frontPageService";
import { getFileName } from "../../utils/formDataUtil";
import { DownloadCoverPageRequestBody } from "../../data/domain";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const lang = req.headers["accept-language"];
    const body: DownloadCoverPageRequestBody = req.body;
    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${getFileName(body.formData)}`);
    res.send(await download(body, lang));
  }
};

export default handler;
