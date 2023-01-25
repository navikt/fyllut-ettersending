import { downloadFrontPage } from "./apiService";
import { FormData, UserType } from "../data/domain";
import logger from "../utils/logger";

const download = async (formData: FormData) => {
  let pdf;
  try {
    pdf = await downloadFrontPage(toFrontPageRequest(formData));
    return Buffer.from(pdf.foersteside, "base64");
  } catch (e: any) {
    logger.error("Failed to download front page", e);
  }
}

const toFrontPageRequest = (formData: FormData): FrontPageRequest => {
  return {
    foerstesidetype: "ETTERSENDELSE",
    navSkjemaId: formData.formNumber || "",
    spraakkode: "NB",
    overskriftstittel: getTitle(formData),
    arkivtittel: getTitle(formData),
    tema: formData.subjectOfSubmission,
    vedleggsliste: formData.attachments?.map(attachment => attachment.attachmentTitle) ?? [],
    dokumentlisteFoersteside: formData.attachments?.map(attachment => attachment.label) ?? [],
    adresse: toFrontPageAddress(formData),
    bruker: toFrontPageUser(formData),
    ukjentBrukerPersoninfo: toUnknownAddressInfo(formData),
  };
}

const getTitle = (formData: FormData) => {
  if (formData.formNumber) {
    return `Ettersendelse til ${formData.formNumber} ${formData.title}`;
  } else {
    return `Innsendelsen gjelder: ${formData.subjectOfSubmission}`;
  }
};

const toFrontPageAddress = (formData: FormData): FrontPageAddress|undefined => {
  if (formData.userData?.type === UserType.noSocialNumber) {
    return {
      adresselinje1: formData.userData?.streetName,
      postnummer: formData.userData?.postalCode,
      poststed: formData.userData?.city,
    } as FrontPageAddress;
  }

  return undefined;
}

const toFrontPageUser = (formData: FormData): FrontPageUser|undefined => {
  if (formData.userData?.socialSecurityNo) {
    return {
      brukerId: formData.userData?.socialSecurityNo,
      brukerType: "PERSON",
    } as FrontPageUser;
  }
}

const toUnknownAddressInfo = (formData: FormData): string|undefined => {
  if (!formData.userData?.socialSecurityNo && formData.userData?.streetName) {
    return `${formData.userData?.firstName} ${formData.userData?.lastName}, ` +
      `${formData.userData?.streetName}, ` +
      `${formData.userData?.postalCode} ${formData.userData?.city}, ` +
      `${formData.userData?.country}.`;
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
