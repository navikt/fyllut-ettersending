import { Radio, RadioGroup, Select } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { NavUnit } from "../../data/domain";
import Section from "../section/section";
import SocialSecurityNo from "../form/socialSecurityNo";
import { useFormState } from "../../data/appState";
import { isPersonGroup, isPersonNoSocialSecurityNumber, isPersonSocialSecurityNumber } from "../../utils/formDataUtil";
import ContactInformation from "./contactInformation";

interface Props {
  navUnits?: NavUnit[] | undefined;
}

enum SubmissionType {
  hasSocialNumber = "hasSocialNumber",
  noSocialNumber = "noSocialNumber",
  other = "other",
}

const ChooseUser = ({navUnits}: Props) => {
  const {formData, updateFormData, updateUserData, errors} = useFormState();
  const [personType, setPersonType] = useState<SubmissionType>();

  useEffect(() => {
    if (isPersonSocialSecurityNumber(formData)) {
      setPersonType(SubmissionType.hasSocialNumber);
    } else  if (isPersonNoSocialSecurityNumber(formData)) {
      setPersonType(SubmissionType.noSocialNumber);
    } else if (isPersonGroup(formData)) {
      setPersonType(SubmissionType.other);
    }
  }, []);

  return (
    <>
      <Section>
        <RadioGroup
          legend="Hvem gjelder innsendelsen for?"
          size="medium"
          onChange={(value) => {
            updateFormData({userData: undefined});
            setPersonType(value);
          }}
          name="submissionInvolves"
          error={errors.submissionInvolves}
          value={personType ?? ""}
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

      {personType === SubmissionType.hasSocialNumber && (
        <Section>
          <SocialSecurityNo
            value={formData.userData?.socialSecurityNo ?? ""}
            name="socialSecurityNo"
            label="Fødselsnummer / D-nummer"
            onChange={value => updateUserData({socialSecurityNo: value})}
            placeholder="Skriv inn tekst"
            error={errors.socialSecurityNo}
          />
        </Section>
      )}

      {personType === SubmissionType.noSocialNumber && (
        <ContactInformation navUnits={navUnits} />
      )}

      <Section>
        {personType === SubmissionType.other && (
          <Select
            label="Velg hvilken NAV-enhet som skal motta innsendingen"
            size="medium"
            onChange={e => updateUserData({navUnit: e.target.value})}
            value={formData.userData?.navUnit ?? ""}
            error={errors.navUnit}
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

export default ChooseUser;


