import { Radio, RadioGroup, UNSAFE_Combobox } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { useFormState } from '../../data/appState';
import { UserType } from '../../data/domain';
import SocialSecurityNo from '../form/socialSecurityNo';
import Section from '../section/section';
import ContactInformation from './contactInformation';

interface Props {
  navUnitOptions: string[];
  shouldRenderNavUnits?: boolean;
  shouldRenderRadioButtons?: boolean;
}

const ChooseUser = ({ navUnitOptions, shouldRenderNavUnits = true, shouldRenderRadioButtons = true }: Props) => {
  const { formData, updateFormData, updateUserData, errors } = useFormState();
  const { t } = useTranslation('common');

  return (
    <>
      {shouldRenderRadioButtons && (
        <Section>
          <RadioGroup
            legend={t('choose-user.user-type.legend')}
            size="medium"
            onChange={(type) => {
              updateFormData({
                userData: {
                  type,
                },
              });
            }}
            name="userType"
            id="userType"
            error={errors.userType}
            value={formData.userData?.type ?? ''}
            tabIndex={-1}
          >
            <Radio name={UserType.hasSocialNumber} value={UserType.hasSocialNumber}>
              {t('choose-user.user-type.choice-has-ssn')}
            </Radio>
            <Radio name={UserType.noSocialNumber} value={UserType.noSocialNumber}>
              {t('choose-user.user-type.choice-no-ssn')}
            </Radio>
            {shouldRenderNavUnits && (
              <Radio name={UserType.other} value={UserType.other}>
                {t('choose-user.user-type.choice-other')}
              </Radio>
            )}
          </RadioGroup>
        </Section>
      )}

      {formData.userData?.type === UserType.hasSocialNumber && (
        <Section>
          <SocialSecurityNo
            value={formData.userData?.socialSecurityNo ?? ''}
            name="socialSecurityNo"
            id="socialSecurityNo"
            label={t('choose-user.ssn-input.label')}
            onChange={(value) => updateUserData({ socialSecurityNo: value })}
            placeholder={t('choose-user.ssn-input.placeholder')}
            error={errors.socialSecurityNo}
          />
        </Section>
      )}

      {formData.userData?.type === UserType.noSocialNumber && <ContactInformation navUnitOptions={navUnitOptions} />}

      {formData.userData?.type === UserType.other && (
        <Section dataCy="navUnitSection">
          <UNSAFE_Combobox
            label={t('choose-user.nav-unit-input.label')}
            options={navUnitOptions}
            name="chooseUserNavUnit"
            id="navUnit"
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
