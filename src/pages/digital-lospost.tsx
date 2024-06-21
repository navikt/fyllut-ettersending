import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import '@navikt/ds-css';
import { Alert } from '@navikt/ds-react';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useState } from 'react';
import ButtonGroup from 'src/components/button/buttonGroup';
import { ButtonType } from 'src/components/button/buttonGroupElement';
import ValidationSummary from 'src/components/validationSummary/validationSummary';
import { useReffererPage } from 'src/hooks/useReferrerPage';
import { createLospost } from '../api/apiClient';
import { getIdPortenTokenFromContext } from '../api/loginRedirect';
import Layout from '../components/layout/layout';
import Section from '../components/section/section';
import { useFormState } from '../data/appState';
import { FormDataPage, UnauthenticatedError } from '../data/domain';
import DigitalLospostForm from '../forms/digitalLospost/DigitalLospost';
import { getServerSideTranslations } from '../utils/i18nUtil';
import logger from '../utils/logger';

interface Props {
  tema?: string;
}

const DigitalLospostPage: NextPage<Props> = ({ tema }) => {
  const { formData, updateFormData } = useFormState();
  const { t, i18n } = useTranslation('digital-lospost');
  const { t: tCommon } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const referrerPage = useReffererPage();

  const submitButtonPressed = async () => {
    try {
      window.location.href = await createLospost(t('title'), formData);
    } catch (error) {
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

  useEffect(() => {
    if (formData.language !== i18n.language) {
      updateFormData({ language: i18n.language });
    }
  }, [formData.language, i18n.language, updateFormData]);

  return (
    <Layout title={t('title')} backUrl={referrerPage}>
      <ValidationSummary />
      <Section>{errorMessage && <Alert variant="error">{errorMessage}</Alert>}</Section>
      <DigitalLospostForm subject={tema} />
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
  if (process.env.APP_ENV === 'production') {
    // digital løspost not available in production yet
    return { notFound: true };
  }
  const { tema } = context.query as { tema: string };
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
  const translations = await getServerSideTranslations(context.locale, ['digital-lospost', 'common', 'validator']);
  const page: FormDataPage = 'digital-lospost';
  if (tema) {
    return { props: { tema, page, ...translations } };
  }
  return { props: { page, ...translations } };
}

const redirectToLogin = (context: GetServerSidePropsContext) => {
  const querySeparator = context.resolvedUrl.includes('?') ? '&' : '?';
  const referrerQuery = context.req.headers.referer ? `${querySeparator}referrer=${context.req.headers.referer}` : '';
  const redirect = encodeURIComponent('/fyllut-ettersending' + context.resolvedUrl + referrerQuery);

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
