import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { createEttersending, fetchNavUnits } from 'src/api/apiClient';
import ChooseAttachments from 'src/components/attachment/chooseAttachments';
import ButtonGroup from 'src/components/button/buttonGroup';
import { ButtonType } from 'src/components/button/buttonGroupElement';
import Layout from 'src/components/layout/layout';
import Section from 'src/components/section/section';
import ChooseUser from 'src/components/submission/chooseUser';
import ValidationSummary from 'src/components/validationSummary/validationSummary';
import { EttersendelseApplication, Form, NavUnit, QuerySubmissionType, UserType } from 'src/data';
import { useFormState } from 'src/data/appState';
import { Paths } from 'src/data/paths';
import { useReffererPage } from 'src/hooks/useReferrerPage';
import { uncapitalize } from 'src/utils/stringUtil';
import { getDefaultQuerySubmissionType, isSubmissionAllowed, isSubmissionTypePaper } from 'src/utils/submissionUtil';
import { Error } from '../error/Error';

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
}

const Details: NextPage<Props> = (props) => {
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
      window.location.href = await createEttersending(formData);
    } catch (_error) {
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
        submissionType: getDefaultQuerySubmissionType(form, router),
        formId: id,
        language,
        userData: form.properties.hideUserTypes ? { type: UserType.none } : undefined,
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

  return (
    <Layout
      title={`${t('title-for')} ${uncapitalize(form.title)}`}
      backUrl={referrerPage}
      publishedLanguages={form.properties.publishedLanguages}
    >
      <ValidationSummary />
      <Section>{errorMessage && <Alert variant="error">{errorMessage}</Alert>}</Section>
      <>
        {isSubmissionAllowed(form) ? (
          formData.submissionType && (
            <>
              <ChooseAttachments form={form} />
              {isSubmissionTypePaper(formData) && (
                <ChooseUser
                  navUnits={getNavUnitsConnectedToForm(form.properties.navUnitTypes)}
                  shouldRenderNavUnits={form.properties.navUnitMustBeSelected}
                  shouldRenderUserTypes={!form.properties.hideUserTypes}
                />
              )}

              <ButtonGroup
                buttons={[
                  formData.submissionType === QuerySubmissionType.digital ? submitButton : downloadButton,
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
          <Error
            heading={'Beklager, her har det oppstått en feil'}
            errorBody={'Det er ikke mulig å ettersende vedlegg til dette skjemaet'}
            navigateToFrontPage={'Gå til forsiden'}
            ctaButton={'Bruk gjerne søket eller menyen'}
            bugUrlTitle={'Meld inn feil på denne lenken'}
          />
        )}
      </>
      )
    </Layout>
  );
};

export default Details;
