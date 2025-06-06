import { TFunction } from 'next-i18next';
import { FormData, UserType } from '../../../src/data';
import { validateFormData } from '../../../src/utils/validator';

const tMock = ((key: string): string => key) as TFunction;

describe('validator', () => {
  let formData: FormData;

  beforeEach(() => {
    formData = {
      page: 'other',
      userData: {},
    };
  });

  describe('subjectOfSubmission', () => {
    it('should give an empty input error when social security number is empty', () => {
      formData.userData!.socialSecurityNo = '';
      formData.userData!.type = UserType.hasSocialNumber;
      const errors = validateFormData(formData, tMock);
      expect(errors?.socialSecurityNo).to.eq('socialSecurityNoIsEmpty');
    });

    describe('type hasSocialNumber', () => {
      it('validate socialSecurityNo is set', () => {
        formData.userData!.type = UserType.hasSocialNumber;
        const errors = validateFormData(formData, tMock);
        expect(errors?.socialSecurityNo).to.eq('socialSecurityNoIsEmpty');
      });
    });

    describe('type noSocialNumber', () => {
      it('validate userdata', () => {
        formData.userData!.type = UserType.noSocialNumber;
        const errors = validateFormData(formData, tMock);
        expect(errors?.firstName).to.eq('firstName');
        expect(errors?.lastName).to.eq('lastName');
        expect(errors?.postalCode).to.eq('postalCode');
        expect(errors?.city).to.eq('city');
        expect(errors?.streetName).to.eq('streetName');
        expect(errors?.city).to.eq('city');
      });

      it('validate navUnitContact undefined', () => {
        formData.userData!.type = UserType.noSocialNumber;
        const errors = validateFormData(formData, tMock);
        expect(errors?.navUnitContact).to.eq('navUnitContact');
      });

      it('validate navUnitContact true', () => {
        formData.userData!.type = UserType.noSocialNumber;
        formData.userData!.navUnitContact = true;
        const errors = validateFormData(formData, tMock);
        expect(errors?.navUnit).to.eq('navUnitContactSelect');
      });

      it('do not validate navUnitContact true', () => {
        formData.userData!.type = UserType.noSocialNumber;
        formData.userData!.navUnitContact = false;
        const errors = validateFormData(formData, tMock);
        expect(errors?.navUnitContact).to.eq(undefined);
      });
    });

    describe('type other', () => {
      it('validate navUnit is set', () => {
        formData.userData!.type = UserType.other;
        const errors = validateFormData(formData, tMock);
        expect(errors?.navUnit).to.eq('navUnit');
      });

      it('should validate otherDocumentationTitle and subjectOfSubmission', () => {
        formData.userData!.type = UserType.other;
        formData.otherDocumentationTitle = '';
        formData.subjectOfSubmission = '';
        const errors = validateFormData(formData, tMock);
        expect(errors?.otherDocumentationTitle).to.eq('otherDocumentation');
        expect(errors?.subjectOfSubmission).to.eq('subjectOfSubmission');
      });

      it('allows valid characters in otherDocumentationTitle', () => {
        formData.userData!.type = UserType.other;
        formData.otherDocumentationTitle =
          'abcdefghijklmnopqrstuvwxyzæøåäöëüïñõ ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅÄÖËÜÏ 1234567890 ./;()":,–_\'?&+’%#•@»«§';
        const errors = validateFormData(formData, tMock);
        expect(errors?.otherDocumentationTitle).to.eq(undefined);
      });

      it('does not allow invalid characters in otherDocumentationTitle', () => {
        formData.userData!.type = UserType.other;
        formData.otherDocumentationTitle = 'invalid title <script>';
        const errors = validateFormData(formData, tMock);
        expect(errors?.otherDocumentationTitle).to.eq('otherDocumentationInvalid');
      });
    });
  });

  describe('validator - detaljer', () => {
    it('give an error if no attachments are in the list', () => {
      formData.formId = 'nav761389';
      formData.attachments = [];
      const errors = validateFormData(formData, tMock);
      expect(errors?.attachments).to.eq('attachments');
    });
  });
});
