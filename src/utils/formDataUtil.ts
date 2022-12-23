import { FormData } from "../data/domain";

const hasOtherAttachment = (formData: FormData): boolean => {
  return !!formData.attachments?.find(attachment => attachment.otherDocumentation)
}

const getFileName = (formData: FormData) => {
  return `${formData.formNumber || "Innsendelse"}.pdf`;
}

export {
  hasOtherAttachment,
  getFileName,
}