import { Radio, RadioGroup, UNSAFE_Combobox } from "@navikt/ds-react";
import { NavUnit, UserType } from "../../data/domain";
import Section from "../section/section";
import SocialSecurityNo from "../form/socialSecurityNo";
import { useFormState } from "../../data/appState";
import ContactInformation from "./contactInformation";
import { useMemo } from "react";
import {useTranslation} from "next-i18next";

interface Props {
  navUnits?: NavUnit[] | undefined;
  shouldRenderNavUnits?: boolean;
}

const ChooseUser = ({ navUnits, shouldRenderNavUnits = true }: Props) => {
  const { formData, updateFormData, updateUserData, errors } = useFormState();
  const {t} = useTranslation("common");

  const navUnitOptions = useMemo(() => {
    return navUnits?.sort((a, b) => (a.name > b.name ? 1 : -1)).map((navUnit) => navUnit.name) ?? [];
  }, [navUnits]);

  return (
    <>
      <Section>
        <RadioGroup
          legend={t("choose-user.user-type.legend")}
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
            {t("choose-user.user-type.choice-has-ssn")}
          </Radio>
          <Radio name={UserType.noSocialNumber} value={UserType.noSocialNumber}>
            {t("choose-user.user-type.choice-no-ssn")}
          </Radio>
          {shouldRenderNavUnits && (
            <Radio name={UserType.other} value={UserType.other}>
              {t("choose-user.user-type.choice-other")}
            </Radio>
          )}
        </RadioGroup>
      </Section>

      {formData.userData?.type === UserType.hasSocialNumber && (
        <Section>
          <SocialSecurityNo
            value={formData.userData?.socialSecurityNo ?? ""}
            name="socialSecurityNo"
            label={t("choose-user.ssn-input.label")}
            onChange={(value) => updateUserData({ socialSecurityNo: value })}
            placeholder={t("choose-user.ssn-input.placeholder")}
            error={errors.socialSecurityNo}
          />
        </Section>
      )}

      {formData.userData?.type === UserType.noSocialNumber && <ContactInformation navUnits={navUnits} />}

      {formData.userData?.type === UserType.other && (
        <Section>
          <UNSAFE_Combobox
            label={t("choose-user.nav-unit-input.label")}
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
