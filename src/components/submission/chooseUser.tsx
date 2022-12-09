import { Radio, RadioGroup, Select } from "@navikt/ds-react";
import { NavUnit, UserType } from "../../data/domain";
import Section from "../section/section";
import SocialSecurityNo from "../form/socialSecurityNo";
import { useFormState } from "../../data/appState";
import ContactInformation from "./contactInformation";

interface Props {
  navUnits?: NavUnit[] | undefined;
}

const ChooseUser = ({navUnits}: Props) => {
  const {formData, updateFormData, updateUserData, errors} = useFormState();

  return (
    <>
      <Section>
        <RadioGroup
          legend="Hvem gjelder innsendelsen for?"
          size="medium"
          onChange={(type) => {
            updateFormData({
              userData: {
                type
              },
            });
          }}
          name="userType"
          error={errors.userType}
          value={formData.userData?.type ?? ""}
        >
          <Radio name={UserType.hasSocialNumber} value={UserType.hasSocialNumber}>
            En person som har fødselsnummer eller D-nummer
          </Radio>
          <Radio name={UserType.noSocialNumber} value={UserType.noSocialNumber}>
            En person som ikke har fødselsnummer eller D-nummer
          </Radio>
          <Radio name={UserType.other} value={UserType.other}>
            Flere personer samtidig eller tiltaksbedrifter, kursarrangører og andre virksomheter
          </Radio>
        </RadioGroup>
      </Section>

      {formData.userData?.type === UserType.hasSocialNumber && (
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

      {formData.userData?.type === UserType.noSocialNumber && (
        <ContactInformation navUnits={navUnits}/>
      )}

      {formData.userData?.type === UserType.other && (
        <Section>
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
        </Section>
      )}
    </>
  );
};

export default ChooseUser;


