import { getTokenxToken } from 'src/auth/getTokenXToken';
import { distinct } from 'src/utils/arrayUtil';
import { toValidLanguageCodes } from 'src/utils/language';
import { isLocalDevelopment } from 'src/utils/utils';
import {
  ApiNavUnit,
  Attachment,
  BasicForm,
  EnvQualifierType,
  EttersendelseApplication,
  EttersendingRequestBody,
  Form,
  FyllutFoerstesidePdf,
  FyllutForm,
  FyllutListForm,
  HttpError,
  isHttpError,
  KeyValue,
  LospostRequestBody,
  NavUnit,
} from '../data';
import logger from '../utils/logger';
import { FrontPageRequest } from './frontPageService';
import { get, post } from './http';

const getForms = async (): Promise<BasicForm[]> => {
  const startTime = Date.now();
  let forms: FyllutListForm[] = [];

  try {
    forms = await get<FyllutListForm[]>(`${process.env.FYLLUT_BASE_URL}/api/forms`);
    logger.debug(`Loaded ${forms.length} forms (ms: ${Date.now() - startTime})`);
  } catch (e) {
    logger.error('Failed to load forms', e as Error);
  }

  return forms.map((form) => {
    const { skjemanummer, subsequentSubmissionTypes } = form.properties;
    return {
      ...form,
      properties: {
        formNumber: skjemanummer ?? null,
        allowedSubmissionTypes: subsequentSubmissionTypes,
      },
    };
  });
};

const getForm = async (formPath: string, language: string = 'nb'): Promise<Form | undefined> => {
  const startTime = Date.now();
  let form: FyllutForm | undefined;

  try {
    form = await get<FyllutForm>(`${process.env.FYLLUT_BASE_URL}/api/forms/${formPath}?type=limited&lang=${language}`);
    logger.debug(`Load form ${formPath} (ms: ${Date.now() - startTime})`);
  } catch (e) {
    logger.warn(`Failed to load form ${formPath}`, e as Error);
    if (isHttpError(e)) {
      if (e.status === 404) {
        return undefined;
      }
      logger.info(e);
      throw new HttpError(e.message, e.status);
    }
  }

  if (!form) {
    return undefined;
  }

  const sortedAttachments = form.attachments.sort((a: Attachment, b: Attachment) => {
    if (b.otherDocumentation) {
      return -1;
    } else if (a.otherDocumentation) {
      return 1;
    }
    return a.label > b.label ? 1 : -1;
  });

  const {
    skjemanummer,
    enhetMaVelgesVedPapirInnsending,
    tema,
    enhetstyper,
    subsequentSubmissionTypes,
    hideUserTypes,
    publishedLanguages,
  } = form.properties;

  return {
    ...form,
    properties: {
      formNumber: skjemanummer,
      allowedSubmissionTypes: subsequentSubmissionTypes,
      navUnitTypes: enhetstyper ?? [],
      subjectOfSubmission: tema,
      publishedLanguages: distinct(['nb', ...toValidLanguageCodes(publishedLanguages ?? [])]),
      ...(hideUserTypes && { hideUserTypes }),
      ...(enhetMaVelgesVedPapirInnsending && {
        navUnitMustBeSelected: enhetMaVelgesVedPapirInnsending,
      }),
    },
    attachments: sortedAttachments,
  };
};

const getNavUnits = async (): Promise<NavUnit[]> => {
  const startTime = Date.now();
  let units: ApiNavUnit[] = [];

  try {
    units = await get(`${process.env.FYLLUT_BASE_URL}/api/enhetsliste`);
    logger.debug(`Loaded ${units.length} nav units (ms: ${Date.now() - startTime})`);
  } catch (e) {
    logger.error('Failed to load nav units', e as Error);
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

const getArchiveSubjects = async (locale: string = 'nb'): Promise<KeyValue> => {
  const startTime = Date.now();
  let subjects = {};

  try {
    const headers = { 'accept-language': locale };
    subjects = await get(`${process.env.FYLLUT_BASE_URL}/api/common-codes/archive-subjects`, headers);
    logger.debug(`Loaded ${Object.keys(subjects).length} archive subjects (ms: ${Date.now() - startTime})`);
  } catch (e) {
    logger.error('Failed to load archive subjects', e as Error);
  }

  return subjects;
};

const downloadFrontPage = async (data: FrontPageRequest) => {
  const startTime = Date.now();

  try {
    const frontPage = await post<FyllutFoerstesidePdf>(`${process.env.FYLLUT_BASE_URL}/api/foersteside`, data);
    logger.debug(`Download front page (ms: ${Date.now() - startTime})`);
    return frontPage;
  } catch (e) {
    logger.error('Failed to download front page', e as Error);
    throw e;
  }
};

const getEttersendinger = async (idportenToken: string, id: string) => {
  try {
    const tokenxToken = await getTokenX(idportenToken);

    return await get<EttersendelseApplication[]>(
      `${process.env.INNSENDING_API_URL}/frontend/v1/skjema/${id}/soknader?soknadstyper=ettersendelse`,
      { Authorization: `Bearer ${tokenxToken}` },
    );
  } catch (e) {
    logger.error('Could not fetch ettersendinger', e as Error);
    return [];
  }
};

const createEttersending = async (
  idportenToken: string,
  ettersendingBody: EttersendingRequestBody,
  envQualifier?: EnvQualifierType,
) => {
  const tokenxToken = await getTokenX(idportenToken);

  return await post<Response>(
    `${process.env.INNSENDING_API_URL}/fyllut/v1/ettersending`,
    ettersendingBody,
    {
      Authorization: `Bearer ${tokenxToken}`,
      ...(envQualifier && { 'Nav-Env-Qualifier': envQualifier }),
    },
    { rawResponse: true },
  );
};

const createLospost = async (idportenToken: string, body: LospostRequestBody, appEnvQualifier?: EnvQualifierType) => {
  const tokenxToken = await getTokenX(idportenToken);

  return await post<Response>(
    `${process.env.INNSENDING_API_URL}/fyllut/v1/lospost`,
    body,
    {
      Authorization: `Bearer ${tokenxToken}`,
      ...(appEnvQualifier && { 'Nav-Env-Qualifier': appEnvQualifier }),
    },
    { rawResponse: true },
  );
};

const getTokenX = async (idportenToken: string): Promise<string> => {
  if (isLocalDevelopment()) {
    return 'mock-tokenx-token';
  }
  const audience = process.env.INNSENDING_API_AUDIENCE ?? 'dev-gcp:team-soknad:innsending-api';
  return await getTokenxToken(idportenToken, audience);
};

export {
  createEttersending,
  createLospost,
  downloadFrontPage,
  getArchiveSubjects,
  getEttersendinger,
  getForm,
  getForms,
  getNavUnits,
};
