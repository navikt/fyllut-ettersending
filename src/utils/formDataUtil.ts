import { FormData } from '../data';

const hasOtherAttachment = (formData: FormData): boolean => {
  return !!formData.attachments?.find((attachment) => attachment.otherDocumentation);
};

const getFileName = (formData: FormData) => {
  return `${formData.formNumber || 'Innsendelse'}.pdf`;
};

export { getFileName, hasOtherAttachment };
