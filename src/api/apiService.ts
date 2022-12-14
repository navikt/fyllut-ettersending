import { get, post } from "./http";
import { Attachment, Form, KeyValue, NavUnit } from "../data/domain";
import { FrontPageRequest } from "./frontPageService";
import logger from "../utils/logger";

const getForms = async (): Promise<Form[]> => {
  const startTime = Date.now();
  let forms = [];
  try {
    if (isMock()) {
      forms = require("../mock/forms.json");
    } else {
      forms = await get(`${process.env.FYLLUT_BASE_URL}/api/forms`);
      logger.debug(`Loaded ${forms.length} forms (ms: ${Date.now() - startTime})`);
    }
  } catch (e: any) {
    logger.error("Failed to load forms", e);
  }

  return forms;
}

const getForm = async (formPath: string): Promise<Form | undefined> => {
  const startTime = Date.now();
  let form;

  try {
    if (isMock()) {
      form = require(`../mock/${formPath}.json`) ?? {};
    } else {
      form = await get(`${process.env.FYLLUT_BASE_URL}/api/forms/${formPath}?type=limited`);
      logger.debug(`Load form ${formPath} (ms: ${Date.now() - startTime})`);
    }
  } catch (e: any) {
    logger.error(`Failed to load form ${formPath}`, e);
  }

  form.attachments
    .sort((a: Attachment, b: Attachment) => {
      // TODO: Change this when otherDocumentation is available
      if (b.key === "annenDokumentasjon") {
        return -1;
      } else if (a.key === "annenDokumentasjon") {
        return 1;
      }
      return (a.label > b.label ? 1 : -1)
    });

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
  const startTime = Date.now();
  let units: any[] = [];

  try {
    if (isMock()) {
      units = require("../mock/navUnits.json");
    } else {
      units = await get(`${process.env.FYLLUT_BASE_URL}/api/enhetsliste`);
      logger.debug(`Loaded ${units.length} nav units (ms: ${Date.now() - startTime})`);
    }
  } catch (e: any) {
    logger.error("Failed to load nav units", e);
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
  const startTime = Date.now();
  let subjects = {};

  try {
    if (isMock()) {
      subjects = require("../mock/archiveSubjects.json");
    } else {
      subjects = await get(`${process.env.FYLLUT_BASE_URL}/api/common-codes/archive-subjects`);
      logger.debug(`Loaded ${Object.keys(subjects).length} archive subjects (ms: ${Date.now() - startTime})`);
    }
  } catch (e: any) {
    logger.error("Failed to load archive subjects", e);
  }

  return subjects;
}

const downloadFrontPage = async (url: string, data: FrontPageRequest) => {
  const startTime = Date.now();

  try {
    // TODO: Find out why process.env.FYLLUT_BASE_URL do not work and we have to send url.
    const frontPage = post(`${url}/api/foersteside`, JSON.stringify(data));
    logger.debug(`Download front page (ms: ${Date.now() - startTime})`);
    return frontPage;
  } catch (e: any) {
    logger.error("Failed to download front page", e);
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
