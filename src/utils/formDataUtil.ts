import { FormData } from "../data/domain";

const hasOtherAttachment = (formData: FormData): boolean => {
  return !!formData.attachments?.find(attachment => attachment.otherDocumentation)
}

export {
  hasOtherAttachment,
}