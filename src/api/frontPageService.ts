import { downloadFrontPage } from "./apiService";
import {DownloadCoverPageRequestBody, FormData, UserType} from "../data/domain";
import logger from "../utils/logger";

const download = async (body: DownloadCoverPageRequestBody, acceptLanguage: string | undefined) => {
  let pdf;
  try {
    const spraakkode = toSpraakkode(acceptLanguage);
    pdf = await downloadFrontPage(toFrontPageRequest(body, spraakkode));
    return Buffer.from(pdf.foersteside, "base64");
  } catch (e: any) {
    logger.error("Failed to download front page", e);
  }
};

const VALID_LANGUAGES = ["nb", "nn", "en"];
const toSpraakkode = (acceptLanguage: string | undefined): string => {
  if (acceptLanguage && VALID_LANGUAGES.includes(acceptLanguage)) {
    return acceptLanguage.toUpperCase();
  }
  return "NB";
}

const toFrontPageRequest = (body: DownloadCoverPageRequestBody, spraakkode: string): FrontPageRequest => {
  const {formData, title} = body;
  return {
    foerstesidetype: "ETTERSENDELSE",
    navSkjemaId: formData.formNumber || "",
    spraakkode,
    overskriftstittel: title,
    arkivtittel: title,
    tema: formData.subjectOfSubmission,
    vedleggsliste: formData.attachments?.map((attachment) => attachment.attachmentTitle) ?? [],
    dokumentlisteFoersteside: formData.attachments?.map((attachment) => attachment.label) ?? [],
    adresse: toFrontPageAddress(formData),
    bruker: toFrontPageUser(formData),
    ukjentBrukerPersoninfo: toUnknownAddressInfo(formData),
  };
};

const toFrontPageAddress = (formData: FormData): FrontPageAddress | undefined => {
  if (formData.userData?.type === UserType.noSocialNumber) {
    return {
      adresselinje1: formData.userData?.streetName,
      postnummer: formData.userData?.postalCode,
      poststed: formData.userData?.city,
    } as FrontPageAddress;
  }

  return undefined;
};

const toFrontPageUser = (formData: FormData): FrontPageUser | undefined => {
  if (formData.userData?.socialSecurityNo) {
    return {
      brukerId: formData.userData?.socialSecurityNo,
      brukerType: "PERSON",
    } as FrontPageUser;
  }
};

const toUnknownAddressInfo = (formData: FormData): string | undefined => {
  if (!formData.userData?.socialSecurityNo && formData.userData?.streetName) {
    return (
      `${formData.userData?.firstName} ${formData.userData?.lastName}, ` +
      `${formData.userData?.streetName}, ` +
      `${formData.userData?.postalCode} ${formData.userData?.city}, ` +
      `${formData.userData?.country}.`
    );
  }
};

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
  tittel?: string;
  behandlingstema?: string;
  "NAV-skjemaID"?: string;
  enhetsnummer?: string;
  avsender?: FrontPageSender;
  arkivsak?: FrontPageArchiveCase
}

type FrontPageType = "SKJEMA" | "ETTERSENDELSE" | "LOESPOST";

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

interface FrontPageSender {
  avsenderID: string;
  avsenderNavn: string;
}

interface FrontPageArchiveCase {
  arkivsaksystem: string;
  arkivsaksnummer: string;
}

export { download };

export type { FrontPageRequest };
