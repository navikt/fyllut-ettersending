import FileSaver from 'file-saver';
import {
  DownloadCoverPageRequestBody,
  EttersendelseApplication,
  EttersendingRequestBody,
  EttersendingVedlegg,
  FormData,
  HttpError,
  KeyValue,
  NavUnit,
} from '../data/domain';
import { getFileName } from '../utils/formDataUtil';

const baseUrl = '/fyllut-ettersending';

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

const downloadFrontpage = async (formData: FormData, title: string, lang: string = 'nb') => {
  const jsonBody: DownloadCoverPageRequestBody = {
    formData,
    title,
  };
  const b64 = await fetch(`${baseUrl}/api/download`, {
    body: JSON.stringify(jsonBody),
    headers: {
      'Content-Type': 'application/json; charset=utf8',
      'Accept-Language': lang,
    },
    method: 'POST',
  });
  FileSaver.saveAs(await b64.blob(), getFileName(formData));
};

const createEttersending = async (formData: FormData): Promise<EttersendelseApplication> => {
  const jsonBody: EttersendingRequestBody = {
    tittel: formData.title,
    skjemanr: formData.formNumber!,
    sprak: formData.language ?? 'nb',
    tema: formData.subjectOfSubmission!,
    vedleggsListe:
      formData.attachments?.map((attachment): EttersendingVedlegg => {
        return {
          vedleggsnr: attachment.attachmentCode,
          tittel: attachment.label,
          url: attachment.attachmentForm
            ? `${process.env.NEXT_PUBLIC_FYLLUT_FRONTEND_URL}/${attachment.attachmentForm}`
            : undefined,
        };
      }) ?? [],
  };

  const result = await fetch(`${baseUrl}/api/ettersending`, {
    body: JSON.stringify(jsonBody),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf8',
    },
  });

  if (!result.ok) {
    throw new HttpError(result.statusText, result.status);
  }

  const resultJson = await result.json();
  return resultJson;
};

export { createEttersending, downloadFrontpage, fetchArchiveSubjects, fetchForms, fetchNavUnits };
