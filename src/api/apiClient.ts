import FileSaver from "file-saver";
import { getFileName } from "../utils/formDataUtil";
import {DownloadCoverPageRequestBody, FormData, KeyValue, NavUnit} from "../data/domain";

const baseUrl = "/fyllut-ettersending";

const fetchForms = async () => {
  const response = await fetch(`${baseUrl}/api/forms`);
  return response.json();
};

const fetchArchiveSubjects = async (): Promise<KeyValue> => {
  const response = await fetch(`${baseUrl}/api/archive-subjects`);
  return response.json();
};

const fetchNavUnits = async (): Promise<NavUnit[]> => {
  const response = await fetch(`${baseUrl}/api/nav-units`);
  return response.json();
};

const downloadFrontpage = async (formData: FormData, title: string, lang: string) => {
  const jsonBody: DownloadCoverPageRequestBody = {
    formData,
    title
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

export { fetchForms, fetchArchiveSubjects, fetchNavUnits, downloadFrontpage };
