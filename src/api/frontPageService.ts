import { downloadFrontPage } from "./apiService";
import { FormData, SubmissionType } from "./domain";
import FileSaver from "file-saver";

const download = async (url: string, formData: FormData) => {
  let pdf;
  try {
    console.log(toFrontPageRequest(formData));
    pdf = await downloadFrontPage(url, toFrontPageRequest(formData));
    saveToFile(pdf.foersteside, `${formData.formNumber || "Innsendelse"}.pdf`);
  } catch (e) {
    console.error(e);
  }
}

const saveToFile = (b64string: string, filename: string) => {
  FileSaver.saveAs(b64toBlob(b64string, "application/pdf"), filename);
}

const b64toBlob = (b64Data: string, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const toFrontPageRequest = (formData: FormData): FrontPageRequest => {
  return {
    foerstesidetype: "ETTERSENDELSE",
    navSkjemaId: formData.formNumber || "",
    spraakkode: "NB",
    overskriftstittel: getTitle(formData),
    arkivtittel: getTitle(formData),
    tema: formData.theme,
    vedleggsliste: formData.attachments,
    dokumentlisteFoersteside: [
      ...formData.attachments
    ],
    adresse: toFrontPageAddress(formData),
    bruker: toFrontPageUser(formData),
    ukjentBrukerPersoninfo: toUnknownAddressInfo(formData),
  };
}

const getTitle = (formData: FormData) => {
  if (formData.formNumber) {
    return `Ettersendelse til ${formData.formNumber} ${formData.title}`;
  } else {
    return `Innsendelsen gjelder: ${formData.theme}`;
  }
};

const toFrontPageAddress = (formData: FormData): FrontPageAddress|undefined => {
  if (formData.submissionInvolves === SubmissionType.noSocialNumber) {
    return {
      adresselinje1: formData.userData?.gateAddresse,
      postnummer: formData.userData?.postnr,
      poststed: formData.userData?.poststed,
    } as FrontPageAddress;
  }

  return undefined;
}

const toFrontPageUser = (formData: FormData): FrontPageUser|undefined => {
  if (formData.socialSecurityNo) {
    return {
      brukerId: formData.socialSecurityNo,
      brukerType: "PERSON",
    } as FrontPageUser;
  }
}

const toUnknownAddressInfo = (formData: FormData): string|undefined => {
  if (formData.socialSecurityNo && formData.userData?.gateAddresse) {
    return `${formData.userData?.fornavn} ${formData.userData?.etternavn}, ` +
      `${formData.userData?.gateAddresse}, ` +
      `${formData.userData?.postnr} ${formData.userData?.poststed}, ` +
      `${formData.userData?.land}.`;
  }
}

/**
 * Domain for https://github.com/navikt/foerstesidegenerator
 */
interface FrontPageRequest {
  foerstesidetype: FrontPageType;
  navSkjemaId: string;
  spraakkode: string;
  overskriftstittel: string;
  arkivtittel: string;
  tema?: string;
  vedleggsliste: string[];
  dokumentlisteFoersteside: string[];
  netsPostboks?: string;
  adresse?: FrontPageAddress;
  bruker?: FrontPageUser;
  ukjentBrukerPersoninfo?: string;
}

type FrontPageType = "SKJEMA" | "ETTERSENDELSE";

export interface FrontPageAddress {
  adresselinje1: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postnummer: string;
  poststed: string;
}

interface FrontPageUser {
  brukerId: string;
  brukerType: string;
}

export {
  download,
}

export type {
  FrontPageRequest,
}
