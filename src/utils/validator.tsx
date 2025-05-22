import { idnr } from '@navikt/fnrvalidator';
import { TFunction } from 'next-i18next';
import { FormData, KeyValue, QuerySubmissionType, UserType } from '../data';
import { hasOtherAttachment } from './formDataUtil';

const containsOnlyCharactersValidInFoerstesideGenerator = (str: string) => {
  // Regex is from "foerstesidegenerator" and checks that a string only contains characters that are defined as valid.
  // https://github.com/navikt/foerstesidegenerator/blob/20170afdb8e8efbfa7ced1940290ff40cdc7bb95/app/src/main/java/no/nav/foerstesidegenerator/service/support/PostFoerstesideRequestValidator.java#L42C70-L42C124
  // The flag /u enables full Unicode support. Allows us to match based on Unicode properties such as:
  // p{L} matches any kind of letter from any language
  // p{N} matches any kind of numeric character in any script
  // p{Zs} matches a whitespace character that is invisible, but does take up space
  const validCharactersRegex = /^[\p{L}\p{N}\p{Zs}\n\t\-./;()":,–_'?&+’%#•@»«§]*$/gu;
  return validCharactersRegex.test(str);
};

const validateFormData = (formData: FormData, t: TFunction) => {
  const formErrors: KeyValue = {};
  if (formData.page === 'digital-lospost') {
    if (!formData.documentTitle) {
      formErrors.documentTitle = t('digitalLospost.documentTitle');
    } else if (formData.documentTitle.length > 150) {
      formErrors.documentTitle = t('digitalLospost.documentTitleLength');
    }
    if (!formData.subject) {
      formErrors.subject = t('digitalLospost.subject');
    }
  } else {
    if (formData.formId && (!formData.attachments || formData.attachments.length === 0)) {
      formErrors.attachments = t('attachments');
    }

    if (formData.submissionType !== QuerySubmissionType.digital) {
      if ((!formData.formId || hasOtherAttachment(formData)) && !formData.otherDocumentationTitle) {
        formErrors.otherDocumentationTitle = t('otherDocumentation');
      }

      if ((!formData.formId || hasOtherAttachment(formData)) && (formData.otherDocumentationTitle ?? '').length > 150) {
        formErrors.otherDocumentationTitle = t('otherDocumentationLength');
      }

      if (
        (!formData.formId || hasOtherAttachment(formData)) &&
        !containsOnlyCharactersValidInFoerstesideGenerator(formData.otherDocumentationTitle ?? '')
      ) {
        formErrors.otherDocumentationTitle = t('otherDocumentationInvalid');
      }

      if (!formData.formId && !formData.subjectOfSubmission) {
        formErrors.subjectOfSubmission = t('subjectOfSubmission');
      }

      if (!formData.userData?.type && formData.userData?.type !== UserType.none) {
        formErrors.userType = t('userType');
      } else if (formData.userData?.type === UserType.hasSocialNumber) {
        if (!formData.userData?.socialSecurityNo) {
          formErrors.socialSecurityNo = t('socialSecurityNoIsEmpty');
        } else if (idnr(formData.userData.socialSecurityNo).status === 'invalid') {
          formErrors.socialSecurityNo = t('socialSecurityNo');
        }
      } else if (formData.userData?.type === UserType.noSocialNumber) {
        if (!formData.userData?.firstName) {
          formErrors.firstName = t('firstName');
        }
        if (!formData.userData?.lastName) {
          formErrors.lastName = t('lastName');
        }
        if (!formData.userData?.streetName) {
          formErrors.streetName = t('streetName');
        }
        if (!formData.userData?.postalCode) {
          formErrors.postalCode = t('postalCode');
        }
        if (!formData.userData?.city) {
          formErrors.city = t('city');
        }
        if (!formData.userData?.country) {
          formErrors.country = t('country');
        }

        if (formData.userData?.navUnitContact === undefined) {
          formErrors.navUnitContact = t('navUnitContact');
        } else if (formData.userData?.navUnitContact && !formData.userData?.navUnit) {
          formErrors.navUnit = t('navUnitContactSelect');
        }
      } else if (formData.userData?.type === UserType.other) {
        if (!formData.userData?.navUnit) {
          formErrors.navUnit = t('navUnit');
        }
      }
    }
  }

  return Object.keys(formErrors).length === 0 ? undefined : formErrors;
};

export { validateFormData };
