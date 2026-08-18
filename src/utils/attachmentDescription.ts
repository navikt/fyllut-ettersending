import { FormData } from '../data';

const trimAttachmentDescription = (value: string | undefined) => value?.trim();

const trimAttachmentDescriptions = (formData: FormData): FormData => ({
  ...formData,
  documentTitle: trimAttachmentDescription(formData.documentTitle),
  otherDocumentationTitle: trimAttachmentDescription(formData.otherDocumentationTitle),
});

export { trimAttachmentDescription, trimAttachmentDescriptions };
