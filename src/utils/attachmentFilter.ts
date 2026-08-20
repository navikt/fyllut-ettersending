import { Attachment } from '../data/attachment';

const normalizeAttachmentCodeFilter = (filterValue: string | string[] | undefined): string[] => {
  if (!filterValue) {
    return [];
  }

  const rawValue = Array.isArray(filterValue) ? filterValue.join(',') : filterValue;

  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
};

const filterAttachmentsByCode = (attachments: Attachment[], attachmentCodeFilter: string[]): Attachment[] => {
  if (attachmentCodeFilter.length === 0) {
    return attachments;
  }

  const allowedAttachmentCodes = new Set(attachmentCodeFilter);

  return attachments.filter((attachment) => {
    const attachmentCode = attachment.attachmentCode?.trim();
    return !!attachmentCode && allowedAttachmentCodes.has(attachmentCode);
  });
};

export { filterAttachmentsByCode, normalizeAttachmentCodeFilter };
