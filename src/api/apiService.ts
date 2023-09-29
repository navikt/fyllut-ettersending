import { get, post } from "./http";
import { Attachment, BasicForm, Form, FyllutFormList, KeyValue, NavUnit } from "../data/domain";
import { FrontPageRequest } from "./frontPageService";
import logger from "../utils/logger";
import { getTokenxToken } from "src/auth/getTokenXToken";
import { isLocalDevelopment } from "src/utils/utils";

const getForms = async (): Promise<BasicForm[]> => {
  const startTime = Date.now();
  let forms: FyllutFormList[] = [];

  try {
    forms = await get(`${process.env.FYLLUT_BASE_URL}/api/forms`);
    logger.debug(`Loaded ${forms.length} forms (ms: ${Date.now() - startTime})`);
  } catch (e: any) {
    logger.error("Failed to load forms", e);
  }

  return forms.map((form) => {
    return {
      ...form,
      properties: {
        formNumber: form?.properties.skjemanummer ?? null,
        submissionType: form?.properties?.ettersending ?? "PAPIR_OG_DIGITAL",
      },
    };
  });
};

const getForm = async (formPath: string, language: string = "nb"): Promise<Form | undefined> => {
  const startTime = Date.now();
  let form;

  try {
    form = await get(`${process.env.FYLLUT_BASE_URL}/api/forms/${formPath}?type=limited&lang=${language}`);
    logger.debug(`Load form ${formPath} (ms: ${Date.now() - startTime})`);
  } catch (e: any) {
    logger.error(`Failed to load form ${formPath}`, e);
  }

  form?.attachments.sort((a: Attachment, b: Attachment) => {
    if (b.otherDocumentation) {
      return -1;
    } else if (a.otherDocumentation) {
      return 1;
    }
    return a.label > b.label ? 1 : -1;
  });

  return {
    ...form,
    properties: {
      formNumber: form?.properties.skjemanummer ?? null,
      submissionType: form?.properties.ettersending ?? "PAPIR_OG_DIGITAL",
      navUnitTypes: form?.properties.enhetstyper ?? [],
      subjectOfSubmission: form?.properties.tema ?? null,
      navUnitMustBeSelected: form?.properties.enhetMaVelgesVedPapirInnsending ?? null,
    },
  };
};

const getNavUnits = async (): Promise<NavUnit[]> => {
  const startTime = Date.now();
  let units: any[] = [];

  try {
    units = await get(`${process.env.FYLLUT_BASE_URL}/api/enhetsliste`);
    logger.debug(`Loaded ${units.length} nav units (ms: ${Date.now() - startTime})`);
  } catch (e: any) {
    logger.error("Failed to load nav units", e);
  }

  return units.map((unit) => {
    return {
      id: unit.enhetId,
      name: unit.navn,
      number: unit.enhetNr,
      type: unit.type,
    };
  });
};

const getArchiveSubjects = async (): Promise<KeyValue> => {
  const startTime = Date.now();
  let subjects = {};

  try {
    subjects = await get(`${process.env.FYLLUT_BASE_URL}/api/common-codes/archive-subjects`);
    logger.debug(`Loaded ${Object.keys(subjects).length} archive subjects (ms: ${Date.now() - startTime})`);
  } catch (e: any) {
    logger.error("Failed to load archive subjects", e);
  }

  return subjects;
};

const downloadFrontPage = async (data: FrontPageRequest) => {
  const startTime = Date.now();

  try {
    const frontPage = post(`${process.env.FYLLUT_BASE_URL}/api/foersteside`, JSON.stringify(data));
    logger.debug(`Download front page (ms: ${Date.now() - startTime})`);
    return frontPage;
  } catch (e: any) {
    logger.error("Failed to download front page", e);
  }
};

const getEttersendinger = async (idportenToken: string, id: string) => {
  try {
    let tokenxToken = "mock-tokenx-token";
    if (!isLocalDevelopment()) {
      tokenxToken = (await getTokenxToken(
        idportenToken,
        process.env.INNSENDING_API_AUDIENCE ?? "dev-gcp:team-soknad:innsending-api",
      )) as string;
    }

    const response = await fetch(
      `${process.env.INNSENDING_API_URL}/frontend/v1/skjema/${id}/soknader?soknadstyper=ettersendelse`,
      { headers: { Authorization: `Bearer ${tokenxToken}` } },
    );

    return await response.json();
  } catch (ex: any) {
    logger.error("Could not fetch ettersendinger", ex);
    return [];
  }
};

export { getForms, getForm, getNavUnits, getArchiveSubjects, downloadFrontPage, getEttersendinger };
