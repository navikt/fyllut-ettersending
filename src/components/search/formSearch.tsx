import { LinkPanel, TextField } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import { Form } from "../../data/domain";
import Section from "../section/section";
import styles from "./search.module.css";
import { useRouter } from "next/router";
import { Paths } from "../../data/text";

interface Props {
  forms: Form[];
}

const FormSearch = ({ forms }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<Form[]>([]);
  const router = useRouter();

  useEffect(() => {
    const lcSearchInput = searchInput.toLowerCase();
    const result = forms.filter(
      (form) =>
        form.title.toLowerCase().includes(lcSearchInput) ||
        form.path.toLowerCase().includes(lcSearchInput) ||
        form.properties?.skjemanummer?.toLowerCase().includes(lcSearchInput)
    );
    setSearchResult(result);
  }, [searchInput, forms]);

  return (
    <>
      <Section>
        <TextField
          autoComplete="off"
          label="Hvilket skjema vil du ettersende dokumentasjon til?"
          description="Søk på skjemanavn, skjemanummer eller stikkord
            (for eksempel: dagpenger, stønad, tiltak, foreldrepenger).
            Velg søknad / skjema i søkeresultatet."
          name="search"
          onChange={(e) => setSearchInput(e.target.value)}
          size="medium"
        />
      </Section>

      <div className={styles.results}>
        {searchResult.map((form, index) => (
          <LinkPanel
            href="#"
            className={styles.clickable}
            key={index}
            border
            onClick={async (e) => {
              e.preventDefault();
              await router.push(`${Paths.details}/${form.path}`);
            }}
          >
            <LinkPanel.Title>{form.title}</LinkPanel.Title>
            <LinkPanel.Description>{form.properties?.skjemanummer}</LinkPanel.Description>
          </LinkPanel>
        ))}
      </div>
    </>
  );
};

export default FormSearch;
