import { FormData } from "../data/domain";
import { TFunction } from "next-i18next";

const getCoverPageTitle = (formData: FormData, t: TFunction) => {
  const { formNumber, title, titleOfSubmission, otherDocumentationTitle } = formData;
  const extraInfo = otherDocumentationTitle ? ` - ${otherDocumentationTitle}` : "";
  if (formNumber) {
    return t("cover-page-title.ettersendelse", {
      formNumber,
      title,
      extraInfo
    })
  } else {
    return t("cover-page-title.innsendelse", {
      titleOfSubmission,
      extraInfo
    })
  }
};

export { getCoverPageTitle };
