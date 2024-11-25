import { TFunction } from 'next-i18next';
import { FormData } from '../data/domain';

const getCoverPageTitle = (formData: FormData, t: TFunction) => {
  const { formNumber, title, titleOfSubmission, otherDocumentationTitle, documentationTitlePrefix } = formData;
  const titlePrefix = documentationTitlePrefix ? `${documentationTitlePrefix} - ` : '';
  const extraInfo = otherDocumentationTitle ? ` - ${titlePrefix}${otherDocumentationTitle}` : '';
  if (formNumber) {
    return t('cover-page-title.ettersendelse', {
      formNumber,
      title,
    });
  } else {
    return t('cover-page-title.innsendelse', {
      titleOfSubmission,
      extraInfo,
    });
  }
};

export { getCoverPageTitle };
