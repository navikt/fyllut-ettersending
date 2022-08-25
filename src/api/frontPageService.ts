import { downloadFrontPage } from "./apiService";
import { FormData } from "./domain";
import FileSaver from "file-saver";

const download = async (url: string, formData: FormData) => {
  let pdf;
  try {
    pdf = await downloadFrontPage(url, toFrontPageRequest(formData));
    saveToFile(pdf.foersteside, `${formData.formNumber}.pdf`);
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
  const title = `${formData.formNumber} ${formData.title}`;

  return {
    foerstesidetype: "ETTERSENDELSE",
    navSkjemaId: formData.formNumber!,
    spraakkode: "NB", // TODO: Support more languages
    overskriftstittel: title,
    arkivtittel: title,
    tema: formData.theme!,
    vedleggsliste: formData.attachments,
    dokumentlisteFoersteside: [
      ...formData.attachments
    ],
    netsPostboks: "1400",
    adresse: toFrontPageAddress(formData),
    bruker: toFrontPageUser(formData),
    ukjentBrukerPersoninfo: toUnknownAddressInfo(formData),
  };
}

const toFrontPageAddress = (formData: FormData): FrontPageAddress => {
  return {
    adresselinje1: formData.userData?.gateAddresse,
    postnummer: formData.userData?.postnr,
    poststed: formData.userData?.poststed,
  } as FrontPageAddress;
}

const toFrontPageUser = (formData: FormData): FrontPageUser|undefined => {
  if (formData.socialNo) {
    return {
      brukerId: formData.socialNo,
      brukerType: "PERSON",
    } as FrontPageUser;
  }
}

const toUnknownAddressInfo = (formData: FormData): string|undefined => {
  if (formData.socialNo && formData.userData?.gateAddresse) {
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
  tema: string;
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
