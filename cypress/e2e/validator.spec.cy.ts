import {
  ErrorMessages,
  FormData,
  initFormData,
  initUserData,
  SubmissionType,
  VelgSkjemaSubmissionType,
} from "../../src/api/domain";
import { validateFormData } from "../../src/utils/validator";

describe("validator.tsx", () => {
  let _formData: FormData;

  beforeEach(() => {
    _formData = initFormData();
    _formData.onSubmitTriggered = true;
  });

  describe("validator - submissionRadioGroup component", () => {
    it("should not validate socialSecurityNo if submission involves is not set hasSocialNumber ", () => {
      _formData.socialSecurityNo = "000";
      _formData.submissionInvolves = SubmissionType.noSocialNumber;
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors?.socialSecurityNo).to.be.undefined;
    });

    it.skip("should give an invalid error when social security number is invalid", () => {
      _formData.submissionInvolves = SubmissionType.hasSocialNumber;
      _formData.socialSecurityNo = "01010122222";
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors!.socialSecurityNo).to.eq(ErrorMessages.socialSecurityNo);
    });

    it("should give an empty input error when social security number is empty", () => {
      _formData.submissionInvolves = SubmissionType.hasSocialNumber;
      _formData.socialSecurityNo = "";
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors?.socialSecurityNo).to.eq(ErrorMessages.socialSecurityNoIsEmpty);
    });

    it("should validate userdata when user has no social number and give error if input fields is empty", () => {
      _formData.submissionInvolves = SubmissionType.noSocialNumber;
      _formData.userData = initUserData();
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors?.fornavn).to.eq(ErrorMessages.fornavn);
      expect(_formData.errors?.etternavn).to.eq(ErrorMessages.etternavn);
      expect(_formData.errors?.postnr).to.eq(ErrorMessages.postnr);
      expect(_formData.errors?.poststed).to.eq(ErrorMessages.poststed);
      expect(_formData.errors?.gateAddresse).to.eq(ErrorMessages.gateAddresse);
      expect(_formData.errors?.land).to.eq(ErrorMessages.land);
    });

    it("should validate navUnitInContactWith when submissionType is noSocialNo && beenInContactPrev is true and give an error if value is empty", () => {
      _formData.submissionInvolves = SubmissionType.noSocialNumber;
      _formData.beenInContactPrev = true;
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors?.navUnitInContactWith).to.eq(ErrorMessages.chooseOne);
    });

    it("should not validate navUnitInContactWith when submissionType is noSocialNo && beenInContactPrev is false", () => {
      _formData.submissionInvolves = SubmissionType.noSocialNumber;
      _formData.beenInContactPrev = false;
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors?.navUnitInContactWith).to.be.undefined;
    });

    it("should validate navUnitToReceiveSubmission if submissiontype is other and give an error if navUnitToReceiveSubmission is not set", () => {
      _formData.submissionInvolves = SubmissionType.other;
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors?.navUnitToReceiveSubmission).to.eq(ErrorMessages.chooseOne);
    });
  });

  describe("validator - velg skjema", () => {
    it("should validate nameOfUploadedDocument, subjectOfSubmission & submissionInvolves when velgSkjemaSubmissionType is ´other document´ and give error when description of upload document is not filled", () => {
      _formData.velgSkjemaSubmissionType = VelgSkjemaSubmissionType.sendAnotherDoc;
      _formData.nameOfUploadedDocument = "";
      _formData.subjectOfSubmission = "";
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors?.nameOfUploadedDocument).to.eq(ErrorMessages.nameOfUploadedDocument);
      expect(_formData.errors?.subjectOfSubmission).to.eq(ErrorMessages.chooseOne);
    });
  });

  describe("validator - detaljer", () => {
    it("give an error if no attachments are in the list", () => {
      _formData.formId = "nav761389";
      _formData.attachments = []
      const formErrors = validateFormData(_formData);
      _formData.errors = formErrors;
      expect(_formData.errors?.attachments).to.eq(ErrorMessages.attachments);
    });
  });
});
