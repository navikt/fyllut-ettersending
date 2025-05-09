import FileSaver from 'file-saver';
import {
  DigitalLospostFormData,
  DownloadCoverPageRequestBody,
  EttersendingRequestBody,
  EttersendingVedlegg,
  FormData,
  HttpError,
  LospostRequestBody,
  NavUnit,
} from '../data';
import { getFileName } from '../utils/formDataUtil';

const baseUrl = '/fyllut-ettersending';

const fetchForms = async () => {
  const response = await fetch(`${baseUrl}/api/forms`);
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

  const result = await fetch(`${baseUrl}/api/download`, {
    body: JSON.stringify(jsonBody),
    headers: {
      'Content-Type': 'application/json; charset=utf8',
      'Accept-Language': lang,
    },
    method: 'POST',
  });

  if (!result.ok) {
    throw new HttpError(result.statusText, result.status);
  }

  FileSaver.saveAs(await result.blob(), getFileName(formData));
};

const createEttersending = async (formData: FormData): Promise<string> => {
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
            ? `${process.env.NEXT_PUBLIC_FYLLUT_FRONTEND_URL}/${attachment.attachmentForm}?sub=paper`
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

  const location = result.headers.get('location');
  if (!location) {
    throw new HttpError('Ukjent lokasjon', 500);
  }

  return location;
};

const createLospost = async (formData: DigitalLospostFormData): Promise<string> => {
  if (!formData.subject || !formData.documentTitle) {
    throw new Error('Ufullstendig skjema');
  }
  const titlePrefix = formData.documentationTitlePrefix ? `${formData.documentationTitlePrefix} - ` : '';
  const jsonBody: LospostRequestBody = {
    soknadTittel: `${formData.subject.label} - ${titlePrefix}${formData.documentTitle}`,
    tema: formData.subject.value,
    dokumentTittel: `${titlePrefix}${formData.documentTitle}`,
    sprak: formData.language || 'nb',
  };
  const result = await fetch(`${baseUrl}/api/lospost`, {
    body: JSON.stringify(jsonBody),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf8',
    },
  });

  if (!result.ok) {
    throw new HttpError(result.statusText, result.status);
  }

  const location = result.headers.get('location');
  if (!location) {
    throw new HttpError('Ukjent lokasjon', 500);
  }

  return location;
};

export { createEttersending, createLospost, downloadFrontpage, fetchForms, fetchNavUnits };
