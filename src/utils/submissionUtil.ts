import { Form, FormData, SubmissionType } from "../data/domain";

const getDefaultSubmissionType = (form: Form): SubmissionType => {
  const allowedSubmissionType = form.properties.submissionType;
  if (allowedSubmissionType === "PAPIR_OG_DIGITAL" || allowedSubmissionType === "KUN_DIGITAL") {
    return SubmissionType.digital;
  }
  return SubmissionType.paper;
};

const createSubmissionUrl = (form: Form, formData: FormData): string => {
  const formNumber = form.properties.formNumber ?? "";
  const attachmentList = formData.attachments?.map(({ key }) => key);

  return `${process.env.NEXT_PUBLIC_SENDINN_URL}?erEttersendelse=true&sprak=NO_NB&skjemanummer=${encodeURIComponent(
    formNumber
  )}&vedleggsIder=${attachmentList}`;
};

const areBothSubmissionTypesAllowed = (form: Form) => {
  console.log(form.properties);
  return form.properties.submissionType === "PAPIR_OG_DIGITAL";
};

const isSubmissionTypePaper = (formData: FormData) => {
  return formData.submissionType === SubmissionType.paper;
};

export { createSubmissionUrl, areBothSubmissionTypesAllowed, isSubmissionTypePaper, getDefaultSubmissionType };
