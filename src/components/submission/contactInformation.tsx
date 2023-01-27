import { Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { ChangeEvent } from "react";
import { NavUnit } from "../../data/domain";
import Section from "../section/section";
import styles from "./submission.module.css";
import { useFormState } from "../../data/appState";

interface Props {
  navUnits?: NavUnit[] | undefined;
}

const ContactInformation = ({ navUnits }: Props) => {
  const { formData, updateUserData, errors } = useFormState();

  const handleUserDataInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateUserData({ [e.target.name]: e.target.value });
  };

  return (
    <>
      <Section>
        <TextField
          label="Fornavn"
          value={formData.userData?.firstName ?? ""}
          name="firstName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.firstName}
          className={styles.input}
        />
        <TextField
          label="Etternavn"
          value={formData.userData?.lastName ?? ""}
          name="lastName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.lastName}
          className={styles.input}
        />
        <TextField
          label="Gateadresse"
          value={formData.userData?.streetName ?? ""}
          name="streetName"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.streetName}
          className={styles.input}
        />
        <TextField
          label="Postnummer"
          value={formData.userData?.postalCode ?? ""}
          name="postalCode"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.postalCode}
          className={styles.input}
        />
        <TextField
          label="Poststed"
          value={formData.userData?.city ?? ""}
          name="city"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.city}
          className={styles.input}
        />
        <TextField
          label="Land"
          value={formData.userData?.country ?? ""}
          name="country"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.country}
          className={styles.input}
        />
      </Section>

      <Section>
        <RadioGroup
          legend="Har du vært i kontakt med NAV om denne saken tidligere?"
          size="medium"
          onChange={(value) => updateUserData({ navUnitContact: value })}
          value={formData.userData?.navUnitContact ?? ""}
          name="navUnitContact"
          error={errors.navUnitContact}
        >
          <Radio value={true}>Ja</Radio>
          <Radio value={false}>Nei</Radio>
        </RadioGroup>
      </Section>

      {formData.userData?.navUnitContact && (
        <Section>
          <Select
            label="Hvilken NAV-enhet har du vært i kontakt med?"
            size="medium"
            onChange={handleUserDataInputChange}
            value={formData.userData?.navUnit ?? ""}
            name="navUnit"
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

export default ContactInformation;
