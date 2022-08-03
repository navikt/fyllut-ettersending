import { Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { NavUnit, UserData, userDataInit, FormData } from "../../api/domain";

interface Props {
  userdata?: UserData;
  updateFormData: any;
  formData: FormData;
  navUnits?: NavUnit[] | undefined;
}

enum SubmissionType {
  hasSocialNumber = "has-social-number",
  noSocialNumber = "no-social-number",
  other = "other",
}

const SubmissionRadioGroup = ({ navUnits, updateFormData, formData }: Props) => {
  const [beenInContactWithNAV, setBeenInContactWithNAV] = useState("nei");
  const [userdata, setUserData] = useState<UserData>(userDataInit);

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
        >
          <Radio name="submissionInvolves" value={SubmissionType.hasSocialNumber}>
            En person som har fødselsnummer eller D-nummer
          </Radio>
          <Radio name="submissionInvolves" value={SubmissionType.noSocialNumber}>
            En person som ikke har fødselsnummer eller D-nummer
          </Radio>
          <Radio name="submissionInvolves" value={SubmissionType.other}>
            Flere personer samtidig eller tiltaksbedrifter, kursarrangører og andre virksomheter
          </Radio>
        </RadioGroup>
      </div>

      <div className="section">
        {formData.submissionInvolves === SubmissionType.other && (
          <Select
            label="Velg hvilken NAV-enhet som skal motta innsendingen"
            size="medium"
            onChange={(evt) => updateFormData("navDeviceToReceiveSubmission", evt.target.value)}
          >
            {navUnits
              ?.sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((navUnit) => (
                <option value={navUnit.name}>{navUnit.name}</option>
              ))}
          </Select>
        )}
      </div>

      {formData.submissionInvolves === SubmissionType.hasSocialNumber && (
        <div className="section">
          <TextField
            value={formData.socialNo}
            name="socialNo"
            label="Fødselsnummer / D-nummer"
            onChange={(evt) => updateFormData("socialNo", evt.target.value)}
            placeholder="Skriv inn tekst"
            size="medium"
          />
        </div>
      )}

      {formData.submissionInvolves === SubmissionType.noSocialNumber && (
        <>
          <div className="section">
            <TextField
              value={userdata.fornavn}
              name="fornavn"
              label="Fornavn"
              size="medium"
              onChange={handleUserDataInputChange}
            />
            <TextField
              value={userdata.etternavn}
              name="etternavn"
              label="Etternavn"
              size="medium"
              onChange={handleUserDataInputChange}
            />
            <TextField
              label="Gateadresse"
              value={userdata.gateAddresse}
              name="gateAddresse"
              onChange={handleUserDataInputChange}
              size="medium"
            />
            <TextField
              label="Postnummer"
              value={userdata.postnr}
              name="postnr"
              onChange={handleUserDataInputChange}
              size="medium"
            />
            <TextField
              label="Poststed"
              value={userdata.poststed}
              name="poststed"
              onChange={handleUserDataInputChange}
              size="medium"
            />
            <TextField
              label="Land"
              value={userdata.land}
              name="land"
              onChange={handleUserDataInputChange}
              size="medium"
            />
          </div>

          <RadioGroup
            legend="Har du vært i kontakt med NAV om denne saken tidligere?"
            size="medium"
            onChange={(val: string) => setBeenInContactWithNAV(val)}
            value={beenInContactWithNAV}
          >
            <Radio value="ja">Ja</Radio>
            <Radio value="nei">Nei</Radio>
          </RadioGroup>

          {beenInContactWithNAV === "ja" && (
            <Select label="Hvilken NAV-enhet har du vært i kontakt med?" size="medium">
              {navUnits
                ?.sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((navUnit) => (
                  <option value="">{navUnit.name}</option>
                ))}
            </Select>
          )}
        </>
      )}
    </>
  );
};

export default SubmissionRadioGroup;
