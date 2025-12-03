import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Button, Heading, Link as NavLink } from '@navikt/ds-react';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { getForm } from 'src/api/apiService';
import ButtonGroup from 'src/components/button/buttonGroup';
import { Form } from 'src/data';
import { Paths } from 'src/data/paths';
import { downloadFrontpage } from '../../api/apiClient';
import Layout from '../../components/layout/layout';
import Section from '../../components/section/section';
import { useFormState } from '../../data/appState';
import { getServerSideTranslations, localePathPrefix } from '../../utils/i18nUtil';
import { getCoverPageTitle } from '../../utils/lastNedUtil';

interface Props {
  locale: string | undefined;
  previousPath: string;
  form?: Form;
}

const LastNed: NextPage<Props> = ({ locale, previousPath, form }) => {
  const { formData } = useFormState();
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string>();
  const { t, i18n } = useTranslation('last-ned');
  const { t: tCommon } = useTranslation('common');
  const { updateFormDataLanguage } = useFormState();

  const isLospost = !formData.formId;
  const submissionType = isLospost ? 'lospost' : 'ettersending';
  const backButtonPath = isLospost ? `${previousPath}/paper` : previousPath;

  useEffect(() => {
    const language = i18n.language;
    if (form && formData.language !== language) {
      updateFormDataLanguage(language, form);
    }
  }, [formData, i18n.language, form, updateFormDataLanguage]);

  const download = async () => {
    setLoading(true);
    const title = getCoverPageTitle(formData, t);
    try {
      await downloadFrontpage(formData, title, locale);
    } catch (_e) {
      setDownloadError(t('download-error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={t(`title.${submissionType}`)}
      backUrl={backButtonPath}
      publishedLanguages={form?.properties.publishedLanguages}
    >
      <Section>
        <Heading level="2" size="medium" spacing>
          {t('section-top.title')}
        </Heading>
        <BodyShort spacing>{t('section-top.description')}</BodyShort>
      </Section>

      <Section>
        <Button variant="primary" onClick={download} size="medium" loading={loading}>
          {t('button.download-cover-page')}
        </Button>
        {downloadError && (
          <Alert className="download-error" variant="error" data-cy="DownloadError">
            {downloadError}
          </Alert>
        )}
      </Section>

      {formData.attachments && (
        <Section>
          <Heading level="2" size="medium" spacing>
            {t(`section-attachments.title.${formData.attachments.length > 1 ? 'plural' : 'single'}`)}
          </Heading>
          <ul>
            {formData.attachments.map((attachment) => {
              const title = attachment.otherDocumentation ? formData.otherDocumentationTitle : attachment.label;
              const formUrl =
                !attachment.otherDocumentation && attachment.attachmentForm
                  ? Paths.attachmentForm(attachment.attachmentForm)
                  : undefined;

              return (
                <li key={attachment.key}>
                  {formUrl ? (
                    <NavLink target="_blank" rel="noopener noreferrer" href={formUrl}>
                      {title} {tCommon('opensInNewTab')}
                    </NavLink>
                  ) : (
                    title
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <div className="lastSection">
        <Heading level="2" size="medium" spacing>
          {t('section-last.title', { step: formData.attachments ? '3' : '2' })}
        </Heading>

        <BodyShort spacing>{t(`section-last.description.${submissionType}`)}</BodyShort>
      </div>
      <ButtonGroup
        buttons={[
          {
            text: tCommon('button.previous'),
            variant: 'secondary',
            icon: <ArrowLeftIcon aria-hidden />,
            path: backButtonPath,
          },
        ]}
      />
      <ButtonGroup
        buttons={[
          {
            text: tCommon('button.exit'),
            path: process.env.NEXT_PUBLIC_NAV_URL || 'https://nav.no',
            variant: 'tertiary',
            external: true,
          },
        ]}
      />
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale, params } = context;
  const id = params?.id as string;
  const previousPath = id === 'lospost' ? Paths.otherDocumentation : Paths.details(id) + '?sub=paper';
  if (isHardNavigation(context)) {
    // Only allows soft navigation to this page, because client won't have any state on hard navigation
    return {
      redirect: {
        permanent: true,
        destination: localePathPrefix(context) + previousPath,
        locale: false,
      },
    };
  }

  // Fetch the form
  const form = id !== 'lospost' ? await getForm(id, locale) : null;

  const translations = await getServerSideTranslations(locale, ['common', 'last-ned']);
  return { props: { ...translations, locale, previousPath, form } };
}

const isHardNavigation = ({ req }: GetServerSidePropsContext) => !req.headers['x-nextjs-data'];

export default LastNed;
