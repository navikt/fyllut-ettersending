import { LinkCard, TextField } from '@navikt/ds-react';
import { useTranslation } from 'next-i18next/pages';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { isDigitalSubmissionAllowed, isPaperSubmissionAllowed } from 'src/utils/submissionUtil';
import { ListForm } from '../../data';
import { Paths } from '../../data/paths';
import { buildQueryString } from '../../utils/queryParams';
import Section from '../section/section';
import styles from './search.module.css';

interface Props {
  forms: ListForm[];
}

const FormSearch = ({ forms }: Props) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<ListForm[]>([]);
  const router = useRouter();
  const { t } = useTranslation('ettersendelse');
  const tema = typeof router.query.tema === 'string' ? router.query.tema : undefined;
  const gjelder = typeof router.query.gjelder === 'string' ? router.query.gjelder : undefined;

  const withQuery = (formPath: string, sub: 'digital' | 'paper') => {
    const queryString = buildQueryString({ sub, tema, gjelder });
    return `${Paths.details(formPath)}${queryString ? `?${queryString}` : ''}`;
  };

  const renderSubmissionLinkCard = (form: ListForm, sub: 'digital' | 'paper') => {
    const submissionTypeLabel = sub === 'digital' ? 'digital' : 'papir';
    const title = `${form.title} (${submissionTypeLabel})`;
    const ariaLabel = [title, form.properties?.formNumber].filter(Boolean).join(' ');

    return (
      <LinkCard className={styles.clickable} data-color="accent">
        <LinkCard.Title as="h3">
          <LinkCard.Anchor asChild aria-label={ariaLabel}>
            <NextLink href={withQuery(form.path, sub)}>{title}</NextLink>
          </LinkCard.Anchor>
        </LinkCard.Title>
        <LinkCard.Description>{form.properties?.formNumber}</LinkCard.Description>
      </LinkCard>
    );
  };

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
          label={t('search-input.label')}
          description={t('search-input.description')}
          name="search"
          onChange={(e) => setSearchInput(e.target.value)}
          size="medium"
        />
      </Section>

      <div className={styles.results} data-cy="searchResults">
        {searchResult
          .sort((a, b) => sortForms(a, b))
          .map((form) => (
            <Fragment key={form.path}>
              {isDigitalSubmissionAllowed(form) && renderSubmissionLinkCard(form, 'digital')}

              {isPaperSubmissionAllowed(form) && renderSubmissionLinkCard(form, 'paper')}
            </Fragment>
          ))}
      </div>
    </>
  );
};

export default FormSearch;
