import { validateFormData } from "../../src/utils/validator";
import { FormData, UserType } from "../../src/data/domain";
import { ErrorMessages } from "../../src/data/text";

describe("validator", () => {
  let formData: FormData;

  beforeEach(() => {
    formData = {
      userData: {},
    };
  });

  describe("subjectOfSubmission", () => {
    it("should give an empty input error when social security number is empty", () => {
      formData.userData!.socialSecurityNo = "";
      formData.userData!.type = UserType.hasSocialNumber;
      const errors = validateFormData(formData);
      expect(errors?.socialSecurityNo).to.eq(ErrorMessages.socialSecurityNoIsEmpty);
    });

    describe("type hasSocialNumber", () => {
      it("validate socialSecurityNo is set", () => {
        formData.userData!.type = UserType.hasSocialNumber;
        const errors = validateFormData(formData);
        expect(errors?.socialSecurityNo).to.eq(ErrorMessages.socialSecurityNoIsEmpty);
      });
    });

    describe("type noSocialNumber", () => {
      it("validate userdata", () => {
        formData.userData!.type = UserType.noSocialNumber;
        const errors = validateFormData(formData);
        expect(errors?.firstName).to.eq(ErrorMessages.firstName);
        expect(errors?.lastName).to.eq(ErrorMessages.lastName);
        expect(errors?.postalCode).to.eq(ErrorMessages.postalCode);
        expect(errors?.city).to.eq(ErrorMessages.city);
        expect(errors?.streetName).to.eq(ErrorMessages.streetName);
        expect(errors?.city).to.eq(ErrorMessages.city);
      });

      it("validate navUnitContact undefined", () => {
        formData.userData!.type = UserType.noSocialNumber;
        const errors = validateFormData(formData);
        expect(errors?.navUnitContact).to.eq(ErrorMessages.navUnitContact);
      });

      it("validate navUnitContact true", () => {
        formData.userData!.type = UserType.noSocialNumber;
        formData.userData!.navUnitContact = true;
        const errors = validateFormData(formData);
        expect(errors?.navUnit).to.eq(ErrorMessages.navUnitContactSelect);
      });

      it("do not validate navUnitContact true", () => {
        formData.userData!.type = UserType.noSocialNumber;
        formData.userData!.navUnitContact = false;
        const errors = validateFormData(formData);
        expect(errors?.navUnitContact).to.be.undefined;
      });
    });

    describe("type other", () => {
      it("validate navUnit is set", () => {
        formData.userData!.type = UserType.other;
        const errors = validateFormData(formData);
        expect(errors?.navUnit).to.eq(ErrorMessages.navUnit);
      });

      it("should validate otherDocumentationTitle and subjectOfSubmission", () => {
        formData.userData!.type = UserType.other;
        formData.otherDocumentationTitle = "";
        formData.subjectOfSubmission = "";
        const errors = validateFormData(formData);
        expect(errors?.otherDocumentation).to.eq(ErrorMessages.otherDocumentation);
        expect(errors?.subjectOfSubmission).to.eq(ErrorMessages.subjectOfSubmission);
      });
    });
  });

  describe("validator - detaljer", () => {
    it("give an error if no attachments are in the list", () => {
      formData.formId = "nav761389";
      formData.attachments = [];
      const errors = validateFormData(formData);
      expect(errors?.attachments).to.eq(ErrorMessages.attachments);
    });
  });
});
