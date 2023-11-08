import { NextRouter } from 'next/router';
import { Form, FormData, ListForm, SubmissionType, getSubmissionTypeFromString } from '../data/domain';

const getSubmissionTypeFromUrl = (router: NextRouter): SubmissionType | null => {
  if (isSubmissionParamSet(router)) {
    const submissionType: SubmissionType = getSubmissionTypeFromString(router.query.sub as string);
    return submissionType;
  }

  return null;
};

const createSubmissionUrl = (form: Form, formData: FormData): string => {
  const formNumber = form.properties.formNumber!;
  const attachmentList = formData.attachments?.map(({ attachmentCode }) => attachmentCode);

  return `${process.env.NEXT_PUBLIC_SENDINN_URL}?erEttersendelse=true&sprak=NO_NB&skjemanummer=${encodeURIComponent(
    formNumber,
  )}&vedleggsIder=${attachmentList}`;
};

const isSubmissionAllowed = (form: Form) => {
  return form.attachments?.length > 0 && form.properties.submissionType !== 'INGEN';
};

const areBothSubmissionTypesAllowed = (form: Form) => {
  return form.properties.submissionType === 'PAPIR_OG_DIGITAL';
};

const isSubmissionParamSet = (router: NextRouter) => {
  const submissionValues = Object.values(SubmissionType) as string[];
  return !!router.query.sub && submissionValues.includes(router.query.sub as string);
};

const isSubmissionTypePaper = (formData: FormData) => {
  return formData.submissionType === SubmissionType.paper;
};

const isPaperSubmissionAllowed = (form: Form | ListForm) => {
  return form.properties.submissionType === 'PAPIR_OG_DIGITAL' || form.properties.submissionType === 'KUN_PAPIR';
};

const isDigitalSubmissionAllowed = (form: Form | ListForm) => {
  return form.properties.submissionType === 'PAPIR_OG_DIGITAL' || form.properties.submissionType === 'KUN_DIGITAL';
};

const isValidSubmissionTypeInUrl = (form: Form, submissionType: string | undefined | string[]) => {
  if (!submissionType || Array.isArray(submissionType)) {
    return false;
  }

  if (submissionType === SubmissionType.paper) {
    return isPaperSubmissionAllowed(form);
  }

  if (submissionType === SubmissionType.digital) {
    return isDigitalSubmissionAllowed(form);
  }

  return false;
};

export {
  areBothSubmissionTypesAllowed,
  createSubmissionUrl,
  getSubmissionTypeFromUrl,
  isDigitalSubmissionAllowed,
  isPaperSubmissionAllowed,
  isSubmissionAllowed,
  isSubmissionParamSet,
  isSubmissionTypePaper,
  isValidSubmissionTypeInUrl,
};
