import { FormData } from '../data';

const hasOtherAttachment = (formData: FormData): boolean => {
  return !!formData.attachments?.find((attachment) => attachment.otherDocumentation);
};

const getFileName = (formData: FormData) => {
  return `${formData.formNumber || 'Innsendelse'}.pdf`;
};

const isValidFormPath = (formPath?: string) => {
  return !!formPath && /^[a-z0-9]+$/.test(formPath);
};

export { getFileName, hasOtherAttachment, isValidFormPath };
