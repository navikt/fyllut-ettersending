import { LinkPanel, TextField } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import { Form } from "../../api/domain";
import Section from "../section/section";
import styles from "./search.module.css";

interface Props {
  forms: Form[];
  onLinkPanelClicked: any;
}

const FormSearch = ({forms, onLinkPanelClicked}: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<Form[]>([]);

  useEffect(() => {
    const lcSearchInput = searchInput.toLowerCase();
    const result = forms.filter((form) =>
      form.title.toLowerCase().includes(lcSearchInput) ||
      form.path.toLowerCase().includes(lcSearchInput) ||
      form.properties?.skjemanummer?.toLowerCase().includes(lcSearchInput));
    setSearchResult(result);
  }, [searchInput, forms]);

  return (
    <>
      <Section>
        <TextField
          label="Hvilket skjema vil du ettersende dokumentasjon til?"
          description="Søk på skjemanavn, skjemanummer eller stikkord (for eksempel: dagpenger, stønad, tiltak, pensjon, e.l.). Velg søknad / skjema i søkeresultatet"
          name="search"
          onChange={(e) => setSearchInput(e.target.value)}
          size="medium"
        />
      </Section>

      <div className={styles.results}>
        {searchResult.map((form, index) => (
          <LinkPanel className={styles.clickable} key={index} border onClick={() => onLinkPanelClicked(form.path)}>
            <LinkPanel.Title>{form.title}</LinkPanel.Title>
            <LinkPanel.Description>{form.properties?.skjemanummer}</LinkPanel.Description>
          </LinkPanel>
        ))}
      </div>
    </>
  );
};

export default FormSearch;
