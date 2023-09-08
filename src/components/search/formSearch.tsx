import { LinkPanel, TextField } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import { Form } from "../../data/domain";
import Section from "../section/section";
import styles from "./search.module.css";
import { useRouter } from "next/router";
import { Paths } from "../../data/text";
import { useTranslation } from "next-i18next";

interface Props {
  forms: Form[];
}

const FormSearch = ({ forms }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<Form[]>([]);
  const router = useRouter();
  const { t } = useTranslation("ettersendelse");

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

  const sortForms = (a: Form, b: Form) => {
    return a.title.trim().localeCompare(b.title.trim());
  };

  return (
    <>
      <Section>
        <TextField
          autoComplete="off"
          label={t("search-input.label")}
          description={t("search-input.description")}
          name="search"
          onChange={(e) => setSearchInput(e.target.value)}
          size="medium"
        />
      </Section>

      <div className={styles.results} data-cy="searchResults">
        {searchResult
          .sort((a, b) => sortForms(a, b))
          .map((form, index) => (
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
