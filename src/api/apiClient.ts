import FileSaver from "file-saver";
import { getFileName } from "../utils/formDataUtil";
import { DownloadCoverPageRequestBody, FormData } from "../data/domain";

// Client-side requests to the API routes

const baseUrl = "/fyllut-ettersending";

const downloadFrontpage = async (formData: FormData, title: string, lang: string = "nb") => {
  const jsonBody: DownloadCoverPageRequestBody = {
    formData,
    title,
  };
  const b64 = await fetch(`${baseUrl}/api/download`, {
    body: JSON.stringify(jsonBody),
    headers: {
      "Content-Type": "application/json; charset=utf8",
      "Accept-Language": lang,
    },
    method: "POST",
  });
  FileSaver.saveAs(await b64.blob(), getFileName(formData));
};

export { downloadFrontpage };
