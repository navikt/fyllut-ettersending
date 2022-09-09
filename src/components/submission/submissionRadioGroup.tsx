import { Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { NavUnit, UserData, FormData, SubmissionType, initUserData } from "../../api/domain";

interface Props {
  userdata?: UserData;
  updateFormData: any;
  formData: FormData;
  navUnits?: NavUnit[] | undefined;
}

const SubmissionRadioGroup = ({ navUnits, updateFormData, formData }: Props) => {
  const [userdata, setUserData] = useState<UserData>(initUserData());

  useEffect(() => {
    updateFormData("userData", userdata);
  }, [userdata]);

  const handleUserDataInputChange = (evt: any) => {
    const target = evt.target as HTMLInputElement;
    setUserData({
      ...userdata,
      [target.name]: target.value,
    });
  };

  return (
    <>
      <div className="section">
        <RadioGroup
          legend="Hvem gjelder innsendelsen for?"
          size="medium"
          onChange={(value) => updateFormData("submissionInvolves", value)}
          value={formData.submissionInvolves}
          name="submissionInvolves"
          error={formData.errors?.submissionInvolves}
        >
          <Radio name={SubmissionType.hasSocialNumber} value={SubmissionType.hasSocialNumber}>
            En person som har fødselsnummer eller D-nummer
          </Radio>
          <Radio name={SubmissionType.noSocialNumber} value={SubmissionType.noSocialNumber}>
            En person som ikke har fødselsnummer eller D-nummer
          </Radio>
          <Radio name={SubmissionType.other} value={SubmissionType.other}>
            Flere personer samtidig eller tiltaksbedrifter, kursarrangører og andre virksomheter
          </Radio>
        </RadioGroup>
      </div>

      {formData.submissionInvolves === SubmissionType.hasSocialNumber && (
        <div className="section">
          <TextField
            value={formData.socialSecurityNo}
            name="socialSecurityNo"
            label="Fødselsnummer / D-nummer"
            onChange={(evt) => updateFormData("socialSecurityNo", evt.target.value)}
            placeholder="Skriv inn tekst"
            size="medium"
            type="number"
            error={formData.errors?.socialSecurityNo}
          />
        </div>
      )}

      {formData.submissionInvolves === SubmissionType.noSocialNumber && (
        <>
          <div className="section">
            <TextField
              value={formData.userData?.fornavn}
              name="fornavn"
              label="Fornavn"
              size="medium"
              onChange={handleUserDataInputChange}
              error={formData.errors?.fornavn}
            />
            <TextField
              value={formData.userData?.etternavn}
              name="etternavn"
              label="Etternavn"
              size="medium"
              onChange={handleUserDataInputChange}
              error={formData.errors?.etternavn}
            />
            <TextField
              label="Gateadresse"
              value={formData.userData?.gateAddresse}
              name="gateAddresse"
              onChange={handleUserDataInputChange}
              size="medium"
              error={formData.errors?.gateAddresse}
            />
            <TextField
              label="Postnummer"
              value={formData.userData?.postnr}
              name="postnr"
              onChange={handleUserDataInputChange}
              size="medium"
              type="number"
              error={formData.errors?.postnr}
            />
            <TextField
              label="Poststed"
              value={formData.userData?.poststed}
              name="poststed"
              onChange={handleUserDataInputChange}
              size="medium"
              error={formData.errors?.poststed}
            />
            <TextField
              label="Land"
              value={formData.userData?.land}
              name="land"
              onChange={handleUserDataInputChange}
              size="medium"
              error={formData.errors?.land}
            />
          </div>

          <RadioGroup
            legend="Har du vært i kontakt med NAV om denne saken tidligere?"
            size="medium"
            onChange={(val: boolean) => updateFormData("beenInContactPrev", val)}
            value={formData.beenInContactPrev}
            name={"beenInContactPrev"}
          >
            <Radio value={true}>Ja</Radio>
            <Radio value={false}>Nei</Radio>
          </RadioGroup>

          {formData?.beenInContactPrev && (
            <Select
              label="Hvilken NAV-enhet har du vært i kontakt med?"
              size="medium"
              onChange={(evt) => updateFormData("navUnitInContactWith", evt.target.value)}
              value={formData?.navUnitInContactWith}
              error={formData?.errors?.navUnitInContactWith}
            >
              <option></option>
              {navUnits
                ?.sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((navUnit, index) => (
                  <option key={index} value={navUnit.name}>
                    {navUnit.name}
                  </option>
                ))}
            </Select>
          )}
        </>
      )}

      <div className="section">
        {formData.submissionInvolves === SubmissionType.other && (
          <Select
            label="Velg hvilken NAV-enhet som skal motta innsendingen"
            size="medium"
            onChange={(evt) => updateFormData("navUnitToReceiveSubmission", evt.target.value)}
            value={formData?.navUnitToReceiveSubmission}
            error={formData.errors?.navUnitToReceiveSubmission}
          >
            <option></option>
            {navUnits
              ?.sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((navUnit, index) => (
                <option key={index} value={navUnit.name}>
                  {navUnit.name}
                </option>
              ))}
          </Select>
        )}
      </div>
    </>
  );
};

export default SubmissionRadioGroup;
