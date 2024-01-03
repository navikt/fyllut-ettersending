import { Radio, RadioGroup, TextField, UNSAFE_Combobox } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next';
import { ChangeEvent } from 'react';
import { useFormState } from '../../data/appState';
import Section from '../section/section';
import styles from './submission.module.css';

interface Props {
  navUnitOptions: string[];
}

const ContactInformation = ({ navUnitOptions }: Props) => {
  const { formData, updateUserData, errors } = useFormState();
  const { t } = useTranslation('common');

  const handleUserDataInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateUserData({ [e.target.name]: e.target.value });
  };

  return (
    <>
      <Section>
        <TextField
          label={t('choose-user.contact-information.first-name')}
          value={formData.userData?.firstName ?? ''}
          id="firstName"
          name="firstName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.firstName}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.last-name')}
          value={formData.userData?.lastName ?? ''}
          id="lastName"
          name="lastName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.lastName}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.street-name')}
          value={formData.userData?.streetName ?? ''}
          id="streetName"
          name="streetName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.streetName}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.postal-code')}
          value={formData.userData?.postalCode ?? ''}
          id="postalCode"
          name="postalCode"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.postalCode}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.city')}
          value={formData.userData?.city ?? ''}
          id="city"
          name="city"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.city}
          className={styles.input}
        />
        <TextField
          label={t('choose-user.contact-information.country')}
          value={formData.userData?.country ?? ''}
          id="country"
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
          id="navUnitContact"
          error={errors.navUnitContact}
          tabIndex={-1}
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
            id="navUnit"
            error={errors.navUnit}
            isMultiSelect={false}
            selectedOptions={formData.userData?.navUnit?.name ? [formData.userData?.navUnit.name] : []}
            onToggleSelected={(option, isSelected) => {
              if (isSelected) {
                updateUserData({ navUnit: findNavUnit(option) });
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
