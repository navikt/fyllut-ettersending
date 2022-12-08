import { validateFormData } from "../../src/utils/validator";
import { ErrorMessages, FormData } from "../../src/data/domain";

describe("validator.tsx", () => {
  let formData: FormData;

  beforeEach(() => {
    formData = {};
  });

  describe("validator - submissionRadioGroup component", () => {
    it("should give an invalid error when social security number is invalid", () => {
      formData.socialSecurityNo = "01010122222";
      const errors = validateFormData(formData);
      expect(errors!.socialSecurityNo).to.eq(ErrorMessages.socialSecurityNo);
    });

    it("should give an empty input error when social security number is empty", () => {
      formData.socialSecurityNo = "";
      const errors = validateFormData(formData);
      expect(errors?.socialSecurityNo).to.eq(ErrorMessages.socialSecurityNoIsEmpty);
    });

    it("should validate userdata when user has no social number and give error if input fields is empty", () => {
      const errors = validateFormData(formData);
      expect(errors?.fornavn).to.eq(ErrorMessages.fornavn);
      expect(errors?.etternavn).to.eq(ErrorMessages.etternavn);
      expect(errors?.postnr).to.eq(ErrorMessages.postnr);
      expect(errors?.poststed).to.eq(ErrorMessages.poststed);
      expect(errors?.gateAddresse).to.eq(ErrorMessages.gateAddresse);
      expect(errors?.land).to.eq(ErrorMessages.land);
    });

    it("should validate navUnitInContactWith when submissionType is noSocialNo && beenInContactPrev is true and give an error if value is empty", () => {
      formData.beenInContactPrev = true;
      const errors = validateFormData(formData);
      expect(errors?.navUnitInContactWith).to.eq(ErrorMessages.chooseOne);
    });

    it("should not validate navUnitInContactWith when submissionType is noSocialNo && beenInContactPrev is false", () => {
      formData.beenInContactPrev = false;
      const errors = validateFormData(formData);
      expect(errors?.navUnitInContactWith).to.be.undefined;
    });

    it("should validate navUnitToReceiveSubmission if submissiontype is other and give an error if navUnitToReceiveSubmission is not set", () => {
      const errors = validateFormData(formData);
      expect(errors?.navUnitToReceiveSubmission).to.eq(ErrorMessages.chooseOne);
    });
  });

  describe("validator - velg skjema", () => {
    it("should validate nameOfUploadedDocument, subjectOfSubmission & submissionInvolves when velgSkjemaSubmissionType is ´other document´ and give error when description of upload document is not filled", () => {
      formData.otherDocumentationTitle = "";
      formData.subjectOfSubmission = "";
      const errors = validateFormData(formData);
      // expect(errors?.otherDocumentationTitle).to.eq(ErrorMessages.otherDocumentationTitle);
      expect(errors?.subjectOfSubmission).to.eq(ErrorMessages.chooseOne);
    });
  });

  describe("validator - detaljer", () => {
    it("give an error if no attachments are in the list", () => {
      formData.formId = "nav761389";
      formData.attachments = []
      const errors = validateFormData(formData);
      expect(errors?.attachments).to.eq(ErrorMessages.attachments);
    });
  });
});
