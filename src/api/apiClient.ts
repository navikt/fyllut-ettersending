import FileSaver from "file-saver";
import { getFileName } from "../utils/formDataUtil";
import { FormData, KeyValue, NavUnit } from "../data/domain";

const baseUrl = ".";

const fetchForms = async () => {
  const response = await fetch(`${baseUrl}/api/forms`);
  return response.json();
}

const fetchArchiveSubjects = async (): Promise<KeyValue> => {
  const response = await fetch(`${baseUrl}/api/archive-subjects`);
  return response.json();
}

const fetchNavUnits = async (): Promise<NavUnit[]> => {
  const response = await fetch(`${baseUrl}/api/nav-units`);
  return response.json();
}

const downloadFrontpage = async (formData: FormData) => {
  const b64 = await fetch(`${baseUrl}/api/download`, {
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json; charset=utf8",
    },
    method: "POST",
  });
  FileSaver.saveAs(await b64.blob(), getFileName(formData));
}

export {
  fetchForms,
  fetchArchiveSubjects,
  fetchNavUnits,
  downloadFrontpage,
}