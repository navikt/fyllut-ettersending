import { NextRouter } from 'next/router';
import { Form, FormData, getSubmissionTypeFromString, ListForm, QuerySubmissionType } from '../data';

const getDefaultQuerySubmissionType = (form: Form, router: NextRouter): QuerySubmissionType => {
  const allowedSubmissionType = form.properties.allowedSubmissionTypes;

  if (isSubmissionParamSet(router)) {
    return getSubmissionTypeFromString(router.query.sub as string);
  }

  if (allowedSubmissionType.includes('DIGITAL')) {
    return QuerySubmissionType.digital;
  }

  return QuerySubmissionType.paper;
};

const isSubmissionAllowed = (form: Form) => {
  return !!form.attachments?.length && !!form.properties.allowedSubmissionTypes.length;
};

const areBothSubmissionTypesAllowed = (form: Form) => {
  return (
    form.properties.allowedSubmissionTypes.includes('PAPER') &&
    form.properties.allowedSubmissionTypes.includes('DIGITAL')
  );
};

const isSubmissionParamSet = (router: NextRouter) => {
  const submissionValues = Object.values(QuerySubmissionType) as string[];
  return !!router.query.sub && submissionValues.includes(router.query.sub as string);
};

const isSubmissionTypePaper = (formData: FormData) => {
  return formData.submissionType === QuerySubmissionType.paper;
};

const isPaperSubmissionAllowed = (form: Form | ListForm) => {
  return form.properties.allowedSubmissionTypes?.includes('PAPER');
};

const isDigitalSubmissionAllowed = (form: Form | ListForm) => {
  return form.properties.allowedSubmissionTypes?.includes('DIGITAL');
};

const isValidSubmissionTypeInUrl = (form: Form, submissionType: string | undefined | string[]) => {
  if (!submissionType || Array.isArray(submissionType)) {
    return false;
  }

  if (submissionType === QuerySubmissionType.paper) {
    return isPaperSubmissionAllowed(form);
  }

  if (submissionType === QuerySubmissionType.digital) {
    return isDigitalSubmissionAllowed(form);
  }

  return false;
};

export {
  areBothSubmissionTypesAllowed,
  getDefaultQuerySubmissionType,
  isDigitalSubmissionAllowed,
  isPaperSubmissionAllowed,
  isSubmissionAllowed,
  isSubmissionParamSet,
  isSubmissionTypePaper,
  isValidSubmissionTypeInUrl,
};
