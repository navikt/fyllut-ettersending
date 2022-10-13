import { get, post } from "./http";
import { Form, KeyValue, NavUnit } from "./domain";
import { FrontPageRequest } from "./frontPageService";
import { logger } from "../utils/logger";

const getForms = async (): Promise<Form[]> => {
  logger.debug("Load forms");

  let forms = [];
  try {
    if (isMock()) {
      forms = require("../mock/forms.json");
    } else {
      forms = await get(`${process.env.FYLLUT_BASE_URL}/api/forms`);
    }
  } catch (e) {
    logger.error("Failed to load forms", {e});
  }

  return forms;
}

const getForm = async (formPath: string): Promise<Form | undefined> => {
  logger.info(`Load form ${formPath}`);

  let form;
  try {
    if (isMock()) {
      form = require(`../mock/${formPath}.json`) ?? {};
    } else {
      form = await get(`${process.env.FYLLUT_BASE_URL}/api/forms/${formPath}?type=limited`);
    }
  } catch (e) {
    logger.error(`Failed to load form ${formPath}`, {e});
  }

  return {
    ...form,
    properties: {
      formNumber: form?.properties.skjemanummer ?? null,
      submissionType: form?.properties.innsending ?? null,
      navUnitTypes: form?.properties.enhetstyper ?? [],
      subjectOfSubmission: form?.properties.tema ?? null,
    }
  }
}

const getNavUnits = async (): Promise<NavUnit[]> => {
  logger.debug("Load nav units (enhetsliste)");

  let units: any[] = [];
  try {
    if (isMock()) {
      units = require("../mock/navUnits.json");
    } else {
      units = await get(`${process.env.FYLLUT_BASE_URL}/api/enhetsliste`);
    }
  } catch (e) {
    logger.error("Failed to load nav units", {e});
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
  logger.debug("Load archive subjects");

  let subjects = {};
  try {
    if (isMock()) {
      subjects = require("../mock/archiveSubjects.json");
    } else {
      subjects = await get(`${process.env.FYLLUT_BASE_URL}/api/common-codes/archive-subjects`);
    }
  } catch (e) {
    logger.error("Failed to load archive subjects", {e});
  }

  return subjects;
}

const downloadFrontPage = async (url: string, data: FrontPageRequest) => {
  logger.debug("Download front page");

  try {
    // TODO: Find out why process.env.FYLLUT_BASE_URL do not work and we have to send url.
    return post(`${url}/api/foersteside`, JSON.stringify(data));
  } catch (e) {
    logger.error("Failed to download front page", {e});
  }
}

const isMock = () => {
  return !!process.env.MOCK;
}

export {
  getForms,
  getForm,
  getNavUnits,
  getArchiveSubjects,
  downloadFrontPage,
}
