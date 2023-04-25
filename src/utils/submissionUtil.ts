import { Form, FormData } from "../data/domain";

const createSubmissionUrl = (form: Form, formData: FormData): string => {
  const formNumber = form.properties.formNumber ?? "";
  const attachmentList = formData.attachments?.map(({ key }) => key);

  return `${process.env.NEXT_PUBLIC_SENDINN_URL}?erEttersendelse=true&sprak=NO_NB&skjemanummer=${encodeURIComponent(
    formNumber
  )}&vedleggsIder=${attachmentList}`;
};

const isDigitalSubmissionAllowed = (form: Form) => {
  return form.properties.submissionType === "PAPIR_OG_DIGITAL" || form.properties.submissionType === "KUN_DIGITAL";
};

const isSubmissionTypePaper = (form: Form, formData: FormData) => {
  return !isDigitalSubmissionAllowed(form) || formData.submissionType === "paper";
};

export { createSubmissionUrl, isDigitalSubmissionAllowed, isSubmissionTypePaper };
