import { Attachment } from './attachment';
import { BasicForm } from './forms';
import { AllowedSubmissionType, LanguageCode } from './types';

/**
 * I denne filen er typene som returneres fra fyllut/form APIet definert
 */
export interface FyllutListForm extends BasicForm {
  properties: FyllutListFormProperties;
}

export interface FyllutListFormProperties {
  skjemanummer?: string;
  subsequentSubmissionTypes: AllowedSubmissionType[];
}

/**
 * @property{string} foersteside - Base64
 */
export interface FyllutFoerstesidePdf {
  foersteside: string;
}

/**
 * @property {AllowedSubmissionType[]} subsequentSubmissionTypes - Tilsvarer Ettersending i fyllut.
 */
export interface FyllytFormProperties {
  skjemanummer?: string;
  tema: string;
  subsequentSubmissionTypes: AllowedSubmissionType[];
  enhetstyper?: string[];
  enhetMaVelgesVedPapirInnsending?: boolean;
  hideUserTypes?: boolean;
  publishedLanguages?: LanguageCode[];
}

export interface FyllutForm extends BasicForm {
  properties: FyllytFormProperties;
  attachments: Attachment[];
}
