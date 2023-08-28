import { NextRouter } from "next/router";
import { Form, FormData, SubmissionType, getSubmissionTypeFromString } from "../data/domain";

const getDefaultSubmissionType = (form: Form, router: NextRouter): SubmissionType => {
  const allowedSubmissionType = form.properties.submissionType;

  if (isSubmissionParamSet(router)) {
    const submissionType: SubmissionType = getSubmissionTypeFromString(router.query.sub as string);
    return submissionType;
  }

  if (allowedSubmissionType === "PAPIR_OG_DIGITAL" || allowedSubmissionType === "KUN_DIGITAL") {
    return SubmissionType.digital;
  }

  return SubmissionType.paper;
};

const createSubmissionUrl = (form: Form, formData: FormData): string => {
  const formNumber = form.properties.formNumber!;
  const attachmentList = formData.attachments?.map(({ attachmentCode }) => attachmentCode);

  return `${process.env.NEXT_PUBLIC_SENDINN_URL}?erEttersendelse=true&sprak=NO_NB&skjemanummer=${encodeURIComponent(
    formNumber
  )}&vedleggsIder=${attachmentList}`;
};

const isSubmissionAllowed = (form: Form) => {
  return form.attachments?.length > 0 && form.properties.submissionType !== "INGEN";
};

const areBothSubmissionTypesAllowed = (form: Form) => {
  return form.properties.submissionType === "PAPIR_OG_DIGITAL";
};

const isSubmissionParamSet = (router: NextRouter) => {
  const submissionValues = Object.values(SubmissionType) as string[];
  return !!router.query.sub && submissionValues.includes(router.query.sub as string);
};

const isSubmissionTypePaper = (formData: FormData) => {
  return formData.submissionType === SubmissionType.paper;
};

export {
  getDefaultSubmissionType,
  createSubmissionUrl,
  isSubmissionAllowed,
  areBothSubmissionTypesAllowed,
  isSubmissionParamSet,
  isSubmissionTypePaper,
};
