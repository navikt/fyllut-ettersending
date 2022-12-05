import { Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { FormData, initUserData, NavUnit, SubmissionType, UserData } from "../../api/domain";
import Section from "../section/section";
import styles from "./submission.module.css";
import SocialSecurityNo from "../form/socialSecurityNo";

interface Props {
  userdata?: UserData;
  updateFormData: any;
  formData: FormData;
  navUnits?: NavUnit[] | undefined;
}

const SubmissionRadioGroup = ({navUnits, updateFormData, formData}: Props) => {
  const [userdata, setUserData] = useState<UserData>(initUserData());

  useEffect(() => {
    updateFormData("userData", userdata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Section>
        <RadioGroup
          legend="Hvem gjelder innsendelsen for?"
          size="medium"
          onChange={(value) => updateFormData("submissionInvolves", value)}
          value={formData.submissionInvolves ?? ""}
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
      </Section>

      {formData.submissionInvolves === SubmissionType.hasSocialNumber && (
        <Section>
          <SocialSecurityNo
            value={formData.socialSecurityNo}
            name="socialSecurityNo"
            label="Fødselsnummer / D-nummer"
            onChange={value => updateFormData("socialSecurityNo", value)}
            placeholder="Skriv inn tekst"
            error={formData.errors?.socialSecurityNo}
          />
        </Section>
      )}

      {formData.submissionInvolves === SubmissionType.noSocialNumber && (
        <>
          <Section>
            <TextField
              value={formData.userData?.fornavn}
              name="fornavn"
              label="Fornavn"
              size="medium"
              onChange={handleUserDataInputChange}
              error={formData.errors?.fornavn}
              className={styles.input}
            />
            <TextField
              value={formData.userData?.etternavn}
              name="etternavn"
              label="Etternavn"
              size="medium"
              onChange={handleUserDataInputChange}
              error={formData.errors?.etternavn}
              className={styles.input}
            />
            <TextField
              label="Gateadresse"
              value={formData.userData?.gateAddresse}
              name="gateAddresse"
              onChange={handleUserDataInputChange}
              size="medium"
              error={formData.errors?.gateAddresse}
              className={styles.input}
            />
            <TextField
              label="Postnummer"
              value={formData.userData?.postnr}
              name="postnr"
              onChange={handleUserDataInputChange}
              size="medium"
              type="number"
              error={formData.errors?.postnr}
              className={styles.input}
            />
            <TextField
              label="Poststed"
              value={formData.userData?.poststed}
              name="poststed"
              onChange={handleUserDataInputChange}
              size="medium"
              error={formData.errors?.poststed}
              className={styles.input}
            />
            <TextField
              label="Land"
              value={formData.userData?.land}
              name="land"
              onChange={handleUserDataInputChange}
              size="medium"
              error={formData.errors?.land}
              className={styles.input}
            />
          </Section>

          <Section>
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
          </Section>

          {formData?.beenInContactPrev && (
            <Section>
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
            </Section>
          )}
        </>
      )}

      <Section>
        {formData.submissionInvolves === SubmissionType.other && (
          <Select
            label="Velg hvilken NAV-enhet som skal motta innsendingen"
            size="medium"
            onChange={(evt) => updateFormData("navUnitToReceiveSubmission", evt.target.value)}
            value={formData?.navUnitToReceiveSubmission ?? ""}
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
      </Section>
    </>
  );
};

export default SubmissionRadioGroup;


