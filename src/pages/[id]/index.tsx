import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import '@navikt/ds-css';
import { Alert, Heading, Ingress } from '@navikt/ds-react';
import { ServerResponse } from 'http';
import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useCallback, useEffect, useState } from 'react';
import { getEttersendinger, getForm } from 'src/api/apiService';
import { getIdPortenTokenFromContext } from 'src/api/loginRedirect';
import ValidationSummary from 'src/components/validationSummary/validationSummary';
import { useReffererPage } from 'src/hooks/useReferrerPage';
import { createEttersending, fetchNavUnits } from '../../api/apiClient';
import ChooseAttachments from '../../components/attachment/chooseAttachments';
import ButtonGroup from '../../components/button/buttonGroup';
import { ButtonType } from '../../components/button/buttonGroupElement';
import Layout from '../../components/layout/layout';
import Section from '../../components/section/section';
import ChooseUser from '../../components/submission/chooseUser';
import { useFormState } from '../../data/appState';
import { EttersendelseApplication, Form, NavUnit, SubmissionType, UnauthenticatedError } from '../../data/domain';
import { Paths } from '../../data/paths';
import { getServerSideTranslations, localePathPrefix } from '../../utils/i18nUtil';
import {
  areBothSubmissionTypesAllowed,
  getDefaultSubmissionType,
  isSubmissionAllowed,
  isSubmissionTypePaper,
  isValidSubmissionTypeInUrl,
} from '../../utils/submissionUtil';

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
}

const Detaljer: NextPage<Props> = (props) => {
  const router = useRouter();
  const { form, id } = props;
  const { formData, resetFormData, updateFormDataLanguage } = useFormState();
  const [navUnits, setNavUnits] = useState<NavUnit[]>([]);
  const referrerPage = useReffererPage();
  const { t, i18n } = useTranslation('detaljer');
  const { t: tCommon } = useTranslation('common');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setNavUnits(await fetchNavUnits());
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getNavUnitsConnectedToForm = (deviceTypes: string[] | undefined) => {
    const navUnitsConnectedToForm: NavUnit[] = navUnits.filter((navUnit) => deviceTypes?.includes(navUnit.type));
    return navUnitsConnectedToForm && !!Object.keys(navUnitsConnectedToForm).length
      ? navUnitsConnectedToForm
      : navUnits;
  };

  const submitButtonPressed = async () => {
    try {
      const ettersending = await createEttersending(formData);
      window.location.href = `${process.env.NEXT_PUBLIC_SEND_INN_FRONTEND_URL}/${ettersending.innsendingsId}`;
    } catch (error) {
      setErrorMessage(t('ettersending-error'));
    }
  };

  useEffect(() => {
    const language = i18n.language;
    if (id !== formData.formId) {
      resetFormData({
        formNumber: form.properties.formNumber,
        title: form.title,
        subjectOfSubmission: form.properties.subjectOfSubmission,
        submissionType: getDefaultSubmissionType(form, router),
        formId: id,
        language,
      });
    } else if (formData.language !== language) {
      updateFormDataLanguage(language, form);
    }
  }, [id, formData, i18n.language, form, resetFormData, updateFormDataLanguage, router]);

  const downloadButton: ButtonType = {
    text: tCommon('button.next'),
    path: Paths.downloadPage(id),
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: 'right',
  };

  const submitButton: ButtonType = {
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

  const title = router.query.sub === SubmissionType.digital ? t('title-digital') : t('title-paper');

  return (
    <Layout title={title} backUrl={referrerPage}>
      <Section>
        <Heading size="large" level="2">
          {form.title}
        </Heading>
        <Ingress>{form.properties.formNumber}</Ingress>
      </Section>
      <ValidationSummary />

      <Section>{errorMessage && <Alert variant="error">{errorMessage}</Alert>}</Section>

      {isSubmissionAllowed(form) ? (
        formData.submissionType && (
          <>
            <ChooseAttachments form={form} />
            {isSubmissionTypePaper(formData) && (
              <ChooseUser
                navUnits={getNavUnitsConnectedToForm(form.properties.navUnitTypes)}
                shouldRenderNavUnits={form.properties.navUnitMustBeSelected}
              />
            )}

            <ButtonGroup
              buttons={[
                formData.submissionType === SubmissionType.digital ? submitButton : downloadButton,
                ...(referrerPage ? [previousButton] : []),
              ]}
            />
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
          </>
        )
      ) : (
        <Alert variant="info">{t('no-attachments-alert')}</Alert>
      )}
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Set cache control header
  const { res, query } = context;
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

  // Attempt to verify the token and redirect to login if necessary
  let idportenToken = '';
  try {
    idportenToken = (await getIdPortenTokenFromContext(context)) as string;
  } catch (ex) {
    if (ex instanceof UnauthenticatedError) {
      return redirectToLogin(context);
    }
  }

  // Fetch the form
  const id = context.params?.id as string;
  const { locale } = context;
  const form = await getForm(id, locale);

  // If the form doesn't exist or the submission type is not the same as the valid submission types in the form, return 404
  if (!form || (query.sub && !isValidSubmissionTypeInUrl(form, query.sub))) {
    return { notFound: true };
  }

  // Fetch existing ettersendinger and redirect if necessary
  let existingEttersendinger: EttersendelseApplication[] = [];
  if (idportenToken && form?.properties.formNumber) {
    existingEttersendinger = await getEttersendinger(idportenToken, form.properties.formNumber);
    redirectBasedOnExistingEttersendinger(existingEttersendinger, res);
  }

  if (!query.sub && areBothSubmissionTypesAllowed(form)) {
    return {
      redirect: {
        permanent: false,
        destination: localePathPrefix(context) + Paths.submissionType(id),
        locale: false,
      },
    };
  }

  const translations = await getServerSideTranslations(locale, ['common', 'detaljer', 'validator']);

  return {
    props: { form, existingEttersendinger, id, ...translations },
  };
}

const redirectBasedOnExistingEttersendinger = (
  existingEttersendinger: EttersendelseApplication[],
  res: ServerResponse,
) => {
  if (existingEttersendinger.length === 1) {
    res.setHeader(
      'Location',
      `${process.env.NEXT_PUBLIC_SEND_INN_FRONTEND_URL}/${existingEttersendinger[0].innsendingsId}`,
    );
    res.statusCode = 302;
  }

  if (existingEttersendinger.length > 1) {
    res.setHeader('Location', `${process.env.MIN_SIDE_FRONTEND_URL}/varsler`);
    res.statusCode = 302;
  }
};

const redirectToLogin = (context: GetServerSidePropsContext) => {
  const querySeparator = context.resolvedUrl.includes('?') ? '&' : '?';
  const referrerQuery = context.req.headers.referer ? `${querySeparator}referrer=${context.req.headers.referer}` : '';
  const redirect = encodeURIComponent('/fyllut-ettersending' + context.resolvedUrl + referrerQuery);
  return {
    redirect: {
      permanent: false,
      destination: `/oauth2/login?redirect=${redirect}`,
    },
    props: {},
  };
};

export default Detaljer;
