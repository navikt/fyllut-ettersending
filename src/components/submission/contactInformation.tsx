import { Radio, RadioGroup, TextField, UNSAFE_Combobox } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useMemo } from 'react';
import { useFormState } from '../../data/appState';
import { NavUnit } from '../../data/domain';
import Section from '../section/section';
import styles from './submission.module.css';

interface Props {
  navUnits?: NavUnit[] | undefined;
}

const ContactInformation = ({ navUnits }: Props) => {
  const { formData, updateUserData, errors } = useFormState();
  const { t } = useTranslation('common');

  const handleUserDataInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateUserData({ [e.target.name]: e.target.value });
  };

  const navUnitOptions = useMemo(() => {
    return navUnits?.sort((a, b) => (a.name > b.name ? 1 : -1)).map((navUnit) => navUnit.name) ?? [];
  }, [navUnits]);

  return (
    <>
      <Section>
        <TextField
          label={t('choose-user.contact-information.first-name')}
          value={formData.userData?.firstName ?? ''}
          name="firstName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.firstName}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.last-name')}
          value={formData.userData?.lastName ?? ''}
          name="lastName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.lastName}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.street-name')}
          value={formData.userData?.streetName ?? ''}
          name="streetName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.streetName}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.postal-code')}
          value={formData.userData?.postalCode ?? ''}
          name="postalCode"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.postalCode}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.city')}
          value={formData.userData?.city ?? ''}
          name="city"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.city}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.country')}
          value={formData.userData?.country ?? ''}
          name="country"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.country}
          className={styles.input}
        />
      </Section>

      <Section>
        <RadioGroup
          legend={t('choose-user.contact-information.nav-unit-contact-legend')}
          size="medium"
          onChange={(value) => updateUserData({ navUnitContact: value })}
          value={formData.userData?.navUnitContact ?? ''}
          name="navUnitContact"
          error={errors.navUnitContact}
        >
          <Radio value={true}>{t('yes')}</Radio>
          <Radio value={false}>{t('no')}</Radio>
        </RadioGroup>
      </Section>

      {formData.userData?.navUnitContact && (
        <Section>
          <UNSAFE_Combobox
            label={t('choose-user.contact-information.nav-unit-select-label')}
            options={navUnitOptions}
            name="contactInformationNavUnit"
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

export default ContactInformation;
