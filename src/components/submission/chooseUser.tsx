import { Radio, RadioGroup, UNSAFE_Combobox } from "@navikt/ds-react";
import { NavUnit, UserType } from "../../data/domain";
import Section from "../section/section";
import SocialSecurityNo from "../form/socialSecurityNo";
import { useFormState } from "../../data/appState";
import ContactInformation from "./contactInformation";
import { useMemo } from "react";

interface Props {
  navUnits?: NavUnit[] | undefined;
  shouldRenderNavUnits?: boolean;
}

const ChooseUser = ({ navUnits, shouldRenderNavUnits = true }: Props) => {
  const { formData, updateFormData, updateUserData, errors } = useFormState();

  const navUnitOptions = useMemo(() => {
    return navUnits?.sort((a, b) => (a.name > b.name ? 1 : -1)).map((navUnit) => navUnit.name) ?? [];
  }, [navUnits]);

  return (
    <>
      <Section>
        <RadioGroup
          legend="Hvem gjelder innsendelsen for?"
          size="medium"
          onChange={(type) => {
            updateFormData({
              userData: {
                type,
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
          {shouldRenderNavUnits && (
            <Radio name={UserType.other} value={UserType.other}>
              Flere personer samtidig eller tiltaksbedrifter, kursarrangører og andre virksomheter
            </Radio>
          )}
        </RadioGroup>
      </Section>

      {formData.userData?.type === UserType.hasSocialNumber && (
        <Section>
          <SocialSecurityNo
            value={formData.userData?.socialSecurityNo ?? ""}
            name="socialSecurityNo"
            label="Fødselsnummer / D-nummer"
            onChange={(value) => updateUserData({ socialSecurityNo: value })}
            placeholder="Skriv inn tekst"
            error={errors.socialSecurityNo}
          />
        </Section>
      )}

      {formData.userData?.type === UserType.noSocialNumber && <ContactInformation navUnits={navUnits} />}

      {formData.userData?.type === UserType.other && (
        <Section>
          <UNSAFE_Combobox
            label="Velg hvilken NAV-enhet som skal motta innsendingen"
            options={navUnitOptions}
            name="chooseUserNavUnit"
            error={errors.navUnit}
            isMultiSelect={false}
            selectedOptions={formData.userData?.navUnit ? [formData.userData?.navUnit] : []}
            onToggleSelected={(option, isSelected) => {
              if (isSelected) {
                updateUserData({ navUnit: option });
              } else {
                updateUserData({ navUnit: undefined });
              }
            }}
          />
        </Section>
      )}
    </>
  );
};

export default ChooseUser;
