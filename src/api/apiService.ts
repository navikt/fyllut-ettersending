import { get, post } from "./http";
import { Form, KeyValue, NavUnit } from "./domain";
import { FrontPageRequest } from "./frontPageService";

const getForms = async (): Promise<Form[]> => {
  let forms = [];
  try {
    forms = await get(`${process.env.FYLLUT_BASE_URL}/api/forms`);
  } catch (e) {
    console.error(e);
  }

  return forms;
}

const getForm = async (formPath: string): Promise<Form|undefined> => {
  let form;
  try {
    form = await get(`${process.env.FYLLUT_BASE_URL}/api/forms/${formPath}?type=limited`);
  } catch (e) {
    console.error(e);
  }

  return {
    ...form,
    properties: {
      formNumber: form?.properties.skjemanummer,
      submissionType: form?.properties.innsending ?? null,
      navUnitTypes: form?.properties.enhetstyper ?? [],
      subjectOfSubmission: form?.properties.tema,
    }
  }
}

const getNavUnits = async (): Promise<NavUnit[]> => {
  let units: any[] = [];
  try {
    units = await get(`${process.env.FYLLUT_BASE_URL}/api/enhetsliste`);
  } catch (e) {
    console.error(e);
  }

  return units
    .filter(unit => unit.status === "Aktiv")
    .map(unit => {
      return {
        id: unit.enhetId,
        name: unit.navn,
        number: unit.enhetNr,
        type: unit.type,
      }
    });
}

const getArchiveSubjects = async (): Promise<KeyValue> => {
  let subjects = {};
  try {
    subjects = await get(`${process.env.FYLLUT_BASE_URL}/api/common-codes/archive-subjects`);
  } catch (e) {
    console.error(e);
  }

  return subjects;
}

const downloadFrontPage = async (url: string, data: FrontPageRequest) => {
  try {
    // TODO: Find out why process.env.FYLLUT_BASE_URL do not work and we have to send url.
    return post(`${url}/api/foersteside`, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export {
  getForms,
  getForm,
  getNavUnits,
  getArchiveSubjects,
  downloadFrontPage,
}
