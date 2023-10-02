import { LinkPanel, TextField } from "@navikt/ds-react";
import React, { useEffect, useState } from "react";
import { ListForm } from "../../data/domain";
import Section from "../section/section";
import styles from "./search.module.css";
import { useRouter } from "next/router";
import { Paths } from "../../data/text";
import { useTranslation } from "next-i18next";
import { isDigitalSubmissionAllowed, isPaperSubmissionAllowed } from "src/utils/submissionUtil";

interface Props {
  forms: ListForm[];
}

const FormSearch = ({ forms }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<ListForm[]>([]);
  const router = useRouter();
  const { t } = useTranslation("ettersendelse");

  useEffect(() => {
    const lcSearchInput = searchInput.toLowerCase();
    const result = forms.filter(
      (form) =>
        form.title.toLowerCase().includes(lcSearchInput) ||
        form.path.toLowerCase().includes(lcSearchInput) ||
        form.properties?.formNumber?.toLowerCase().includes(lcSearchInput),
    );
    setSearchResult(result);
  }, [searchInput, forms]);

  const sortForms = (a: ListForm, b: ListForm) => {
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
            <>
              {isDigitalSubmissionAllowed(form) && (
                <LinkPanel
                  href="#"
                  className={styles.clickable}
                  key={`digital-${index}`}
                  border
                  onClick={async (e) => {
                    e.preventDefault();
                    await router.push(`${Paths.details}/${form.path}?sub=digital`);
                  }}
                >
                  <LinkPanel.Title>{`${form.title} (digital)`}</LinkPanel.Title>
                  <LinkPanel.Description>{form.properties?.formNumber}</LinkPanel.Description>
                </LinkPanel>
              )}

              {isPaperSubmissionAllowed(form) && (
                <LinkPanel
                  href="#"
                  className={styles.clickable}
                  key={`papir-${index}`}
                  border
                  onClick={async (e) => {
                    e.preventDefault();
                    await router.push(`${Paths.details}/${form.path}?sub=paper`);
                  }}
                >
                  <LinkPanel.Title>{`${form.title} (papir)`}</LinkPanel.Title>
                  <LinkPanel.Description>{form.properties?.formNumber}</LinkPanel.Description>
                </LinkPanel>
              )}
            </>
          ))}
      </div>
    </>
  );
};

export default FormSearch;
