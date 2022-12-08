import { Radio, RadioGroup, Select, TextField } from "@navikt/ds-react";
import { ChangeEvent, useEffect, useState } from "react";
import { NavUnit } from "../../data/domain";
import Section from "../section/section";
import styles from "./submission.module.css";
import { useFormState } from "../../data/appState";

interface Props {
  navUnits?: NavUnit[] | undefined;
}

const ContactInformation = ({navUnits}: Props) => {
  const {formData,  updateUserData, errors} = useFormState();
  const [navUnitState, setNavUnitState] = useState<boolean>(false);

  const handleUserDataInputChange = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    updateUserData({[e.target.name]: e.target.value});
  };

  useEffect(() => {
    if (formData.userData?.navUnit) {
      setNavUnitState(true);
    }
  }, []);

  return (
    <>
      <Section>
        <TextField
          value={formData.userData?.fornavn ?? ""}
          name="fornavn"
          label="Fornavn"
          size="medium"
          onChange={handleUserDataInputChange}
          error={errors.fornavn}
          className={styles.input}
        />
        <TextField
          value={formData.userData?.etternavn ?? ""}
          name="etternavn"
          label="Etternavn"
          size="medium"
          onChange={handleUserDataInputChange}
          error={errors.etternavn}
          className={styles.input}
        />
        <TextField
          label="Gateadresse"
          value={formData.userData?.gateAddresse ?? ""}
          name="gateAddresse"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.gateAddresse}
          className={styles.input}
        />
        <TextField
          label="Postnummer"
          value={formData.userData?.postnr ?? ""}
          name="postnr"
          onChange={handleUserDataInputChange}
          size="medium"
          type="number"
          error={errors.postnr}
          className={styles.input}
        />
        <TextField
          label="Poststed"
          value={formData.userData?.poststed ?? ""}
          name="poststed"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.poststed}
          className={styles.input}
        />
        <TextField
          label="Land"
          value={formData.userData?.land ?? ""}
          name="land"
          onChange={handleUserDataInputChange}
          size="medium"
          error={errors.land}
          className={styles.input}
        />
      </Section>

      <Section>
        <RadioGroup
          legend="Har du vært i kontakt med NAV om denne saken tidligere?"
          size="medium"
          onChange={value => setNavUnitState(value)}
          value={formData.beenInContactPrev}
          name="navUnitState"
        >
          <Radio value={true}>Ja</Radio>
          <Radio value={false}>Nei</Radio>
        </RadioGroup>
      </Section>

      {navUnitState && (
        <Section>
          <Select
            label="Hvilken NAV-enhet har du vært i kontakt med?"
            size="medium"
            onChange={handleUserDataInputChange}
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

export default ContactInformation;


