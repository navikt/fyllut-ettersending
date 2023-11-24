import { Radio, RadioGroup, UNSAFE_Combobox } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { useFormState } from '../../data/appState';
import { NavUnit, UserType } from '../../data/domain';
import SocialSecurityNo from '../form/socialSecurityNo';
import Section from '../section/section';
import ContactInformation from './contactInformation';

interface Props {
  navUnits?: NavUnit[] | undefined;
  shouldRenderNavUnits?: boolean;
  subject?: string;
}

const ChooseUser = ({ navUnits, shouldRenderNavUnits = true, subject }: Props) => {
  const { formData, updateFormData, updateUserData, errors } = useFormState();
  const { t } = useTranslation('common');

  const navUnitOptions = useMemo(() => {
    return navUnits?.sort((a, b) => (a.name > b.name ? 1 : -1)).map((navUnit) => navUnit.name) ?? [];
  }, [navUnits]);

  const chosenSubject = subject ? subject : formData.subjectOfSubmission;

  // If subject is TIL (tiltakspenger), we only want to show the "other option"
  const radioGroupSection = () => {
    return (
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
          {chosenSubject !== 'TIL' && (
            <>
              <Radio name={UserType.hasSocialNumber} value={UserType.hasSocialNumber} id={UserType.hasSocialNumber}>
                {t('choose-user.user-type.choice-has-ssn')}
              </Radio>
              <Radio name={UserType.noSocialNumber} value={UserType.noSocialNumber} id={UserType.noSocialNumber}>
                {t('choose-user.user-type.choice-no-ssn')}
              </Radio>
            </>
          )}
          {shouldRenderNavUnits && (
            <Radio name={UserType.other} value={UserType.other} id={UserType.other}>
              {t('choose-user.user-type.choice-other')}
            </Radio>
          )}
        </RadioGroup>
      </Section>
    );
  };

  return (
    <>
      {radioGroupSection()}

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

      {formData.userData?.type === UserType.noSocialNumber && <ContactInformation navUnits={navUnits} />}

      {formData.userData?.type === UserType.other && (
        <Section>
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
