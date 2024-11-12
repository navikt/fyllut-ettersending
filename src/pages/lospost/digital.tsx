import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import '@navikt/ds-css';
import { Alert } from '@navikt/ds-react';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useCallback, useEffect, useReducer, useState } from 'react';
import ButtonGroup from 'src/components/button/buttonGroup';
import { ButtonType } from 'src/components/button/buttonGroupElement';
import ValidationSummary from 'src/components/validationSummary/validationSummary';
import { useReffererPage } from 'src/hooks/useReferrerPage';
import { createLospost } from '../../api/apiClient';
import { getArchiveSubjects } from '../../api/apiService';
import { getIdPortenTokenFromContext } from '../../api/loginRedirect';
import Layout from '../../components/layout/layout';
import Section from '../../components/section/section';
import { useFormState } from '../../data/appState';
import { FormDataPage, KeyValue, UnauthenticatedError } from '../../data/domain';
import archiveSubjectsReducer from '../../forms/digitalLospost/archiveSubjectsReducer';
import DigitalLospostForm from '../../forms/digitalLospost/DigitalLospost';
import { getServerSideTranslations } from '../../utils/i18nUtil';
import logger from '../../utils/logger';
import { PAPER_ONLY_SUBJECTS } from '../../utils/lospost';
import { uncapitalize } from '../../utils/stringUtil';

interface Props {
  tema?: string;
  subjects?: KeyValue;
}

const DigitalLospostPage: NextPage<Props> = ({ tema, subjects: serverSubjects }) => {
  const { formData, updateFormData } = useFormState();
  const router = useRouter();
  const { t, i18n } = useTranslation('digital-lospost');
  const { t: tCommon } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [subjectsState, dispatch] = useReducer(archiveSubjectsReducer, { status: 'init' }, (state) => state);
  const referrerPage = useReffererPage();

  const submitButtonPressed = async () => {
    try {
      window.location.href = await createLospost(formData);
    } catch (_error) {
      setErrorMessage(t('lospost-error'));
    }
  };

  const nextButton: ButtonType = {
    text: tCommon('button.next'),
    external: true,
    onClick: submitButtonPressed,
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: 'right',
  };

  const previousButton: ButtonType = {
    text: tCommon('button.previous'),
    variant: 'secondary',
    icon: <ArrowLeftIcon aria-hidden />,
    path: referrerPage,
    external: true,
  };

  const verifySubjects = useCallback(async () => {
    if (serverSubjects) {
      const hideSubjectsCombobox = tema ? !!serverSubjects[tema] : false;
      dispatch({ type: 'set', subjects: serverSubjects, hidden: hideSubjectsCombobox });
      if (hideSubjectsCombobox) {
        updateFormData({ subject: { value: tema!, label: serverSubjects[tema!] } });
      } else if (tema) {
        const { pathname } = router;
        router.replace(pathname, undefined, { shallow: true });
      }
    }
  }, [router, serverSubjects, tema, updateFormData]);

  useEffect(() => {
    verifySubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formData.page !== 'digital-lospost') {
      updateFormData({ page: 'digital-lospost' });
    }
  }, [formData.page, updateFormData]);

  useEffect(() => {
    if (formData.language !== i18n.language) {
      updateFormData({ language: i18n.language });
    }
  }, [formData.language, i18n.language, updateFormData]);

  const title =
    tema && serverSubjects?.[tema] ? `${t('title-about')} ${uncapitalize(serverSubjects[tema])}` : t('title');

  return (
    <Layout title={title} backUrl={referrerPage}>
      <ValidationSummary />
      <Section>{errorMessage && <Alert variant="error">{errorMessage}</Alert>}</Section>
      <DigitalLospostForm subjects={subjectsState} />
      <ButtonGroup buttons={[nextButton, ...(referrerPage ? [previousButton] : [])]} />
      <ButtonGroup
        center={!!referrerPage}
        buttons={[
          {
            text: tCommon('button.cancel'),
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
  const { tema, dokumentnavn } = context.query as { tema: string; dokumentnavn: string };
  const pageProps = {
    ...(tema && { tema }),
    ...(dokumentnavn && { dokumentnavn }),
  };
  // Attempt to verify the token and redirect to login if necessary
  try {
    await getIdPortenTokenFromContext(context, true);
  } catch (ex: unknown) {
    logger.debug(`Failed to verify token`);
    if (ex instanceof UnauthenticatedError) {
      logger.info(`Failed to verify token. Redirecting to login.`);
      return redirectToLogin(context);
    }
  }
  const subjects = await getArchiveSubjects();
  PAPER_ONLY_SUBJECTS.forEach((code) => delete subjects[code]);
  const translations = await getServerSideTranslations(context.locale, ['digital-lospost', 'common', 'validator']);
  const page: FormDataPage = 'digital-lospost';
  return { props: { page, subjects, ...pageProps, ...translations } };
}

const redirectToLogin = (context: GetServerSidePropsContext) => {
  const querySeparator = context.resolvedUrl.includes('?') ? '&' : '?';
  const referrerQuery = context.req.headers.referer ? `${querySeparator}referrer=${context.req.headers.referer}` : '';
  const locale = context.locale && context.locale !== 'nb' ? `/${context.locale}` : '';
  const redirect = encodeURIComponent(`/fyllut-ettersending${locale}` + context.resolvedUrl + referrerQuery);

  logger.info("Redirecting to login page with redirect url: '" + redirect);

  return {
    redirect: {
      permanent: false,
      destination: `/oauth2/login?redirect=${redirect}`,
    },
    props: {},
  };
};

export default DigitalLospostPage;
