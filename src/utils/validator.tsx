import { idnr } from '@navikt/fnrvalidator';
import { TFunction } from 'next-i18next';
import { FormData, KeyValue, SubmissionType, UserType } from '../data/domain';
import { hasOtherAttachment } from './formDataUtil';

const validateFormData = (formData: FormData, t: TFunction) => {
  const formErrors: KeyValue = {};

  if (formData.formId && (!formData.attachments || formData.attachments.length === 0)) {
    formErrors.attachments = t('attachments');
  }

  if (formData.submissionType !== SubmissionType.digital) {
    if ((!formData.formId || hasOtherAttachment(formData)) && !formData.otherDocumentationTitle) {
      formErrors.otherDocumentationTitle = t('otherDocumentation');
    }

    if (!formData.formId && !formData.subjectOfSubmission) {
      formErrors.subjectOfSubmission = t('subjectOfSubmission');
    }

    if (!formData.userData?.type) {
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

  return Object.keys(formErrors).length === 0 ? undefined : formErrors;
};

export { validateFormData };
