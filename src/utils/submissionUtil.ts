import { NextRouter } from 'next/router';
import { Form, FormData, ListForm, SubmissionType, getSubmissionTypeFromString } from '../data/domain';

const getDefaultSubmissionType = (form: Form, router: NextRouter): SubmissionType => {
  const allowedSubmissionType = form.properties.submissionType;

  if (isSubmissionParamSet(router)) {
    const submissionType: SubmissionType = getSubmissionTypeFromString(router.query.sub as string);
    return submissionType;
  }

  if (allowedSubmissionType.includes('DIGITAL')) {
    return SubmissionType.digital;
  }

  return SubmissionType.paper;
};

const isSubmissionAllowed = (form: Form) => {
  return !!form.attachments?.length && !!form.properties.submissionType.length;
};

const areBothSubmissionTypesAllowed = (form: Form) => {
  return form.properties.submissionType.includes('PAPER') && form.properties.submissionType.includes('DIGITAL');
};

const isSubmissionParamSet = (router: NextRouter) => {
  const submissionValues = Object.values(SubmissionType) as string[];
  return !!router.query.sub && submissionValues.includes(router.query.sub as string);
};

const isSubmissionTypePaper = (formData: FormData) => {
  return formData.submissionType === SubmissionType.paper;
};

const isPaperSubmissionAllowed = (form: Form | ListForm) => {
  return form.properties.submissionType?.includes('PAPER');
};

const isDigitalSubmissionAllowed = (form: Form | ListForm) => {
  return form.properties.submissionType?.includes('DIGITAL');
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
  getDefaultSubmissionType,
  isDigitalSubmissionAllowed,
  isPaperSubmissionAllowed,
  isSubmissionAllowed,
  isSubmissionParamSet,
  isSubmissionTypePaper,
  isValidSubmissionTypeInUrl,
};
