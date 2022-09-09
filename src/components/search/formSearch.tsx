import { BodyShort, Label, LinkPanel, TextField } from "@navikt/ds-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Form } from "../../api/domain";

interface Props {
  forms: Form[];
  onLinkPanelClicked: any
}

const FormSearch = ({ forms, onLinkPanelClicked }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<Form[]>([]);

  useEffect(() => {
    const result = forms.filter((e) => e.title.includes(searchInput) || e.path.includes(searchInput));
    setSearchResult(result);
  }, [searchInput, forms]);


  return (
    <>
    <div className="section">
      <Label spacing>Hvilket skjema vil du ettersende dokumentasjon til?</Label>
      <BodyShort spacing>
        Søk på skjemanavn, skjemanummer eller stikkord. Velg søknad / skjema i søkeresultatet.
      </BodyShort>

    </div>

    <div className="section">
      <TextField
        label="Søk"
        name="search"
        onChange={(e) => setSearchInput(e.target.value)}
        size="medium"
      />
    </div>

    <div className="form-results">
      {searchResult.map((form, index) => (
          <LinkPanel className="clickable" key={index} border onClick={() => onLinkPanelClicked(form.path)}>
            <LinkPanel.Title>{form.title}</LinkPanel.Title>
            <LinkPanel.Description>{form.properties?.skjemanummer}</LinkPanel.Description>
          </LinkPanel>
      ))}
    </div>
  </>
  );
};

export default FormSearch;
