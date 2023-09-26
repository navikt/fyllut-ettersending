import "@navikt/ds-css";
import { Alert, Heading, Ingress } from "@navikt/ds-react";
import type { GetStaticProps, NextPage } from "next";
import { EttersendelseApplication, Form, NavUnit, SubmissionType } from "../../../data/domain";
import ChooseAttachments from "../../../components/attachment/chooseAttachments";
import ButtonGroup from "../../../components/button/buttonGroup";
import ChooseUser from "../../../components/submission/chooseUser";
import { useFormState } from "../../../data/appState";
import { useEffect } from "react";
import Section from "../../../components/section/section";
import Layout from "../../../components/layout/layout";
import { useRouter } from "next/router";
import { Paths } from "../../../data/text";
import ChooseSubmissionType from "../../../components/submission/chooseSubmissionType";
import {
  createSubmissionUrl,
  getDefaultSubmissionType,
  areBothSubmissionTypesAllowed,
  isSubmissionTypePaper,
  isSubmissionAllowed,
  isSubmissionParamSet,
} from "../../../utils/submissionUtil";
import { ButtonType } from "../../../components/button/buttonGroupElement";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { getForm, getForms, getNavUnits } from "src/api/apiService";
import { useReffererPage } from "src/hooks/useReferrerPage";
import { getServerSideTranslations } from "../../../utils/i18nUtil";
import { useTranslation } from "next-i18next";

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
  navUnits: NavUnit[];
}

const Detaljer: NextPage<Props> = (props) => {
  const router = useRouter();
  const { form, id } = props;
  const { formData, resetFormData } = useFormState();
  const referrerPage = useReffererPage();
  const { t } = useTranslation("detaljer");
  const { t: tCommon } = useTranslation("common");

  const getNavUnitsConnectedToForm = (deviceTypes: string[] | undefined) => {
    const navUnitsConnectedToForm: NavUnit[] = props.navUnits.filter((navUnit) => deviceTypes?.includes(navUnit.type));
    return navUnitsConnectedToForm && !!Object.keys(navUnitsConnectedToForm).length
      ? navUnitsConnectedToForm
      : props.navUnits;
  };

  useEffect(() => {
    if (id !== formData.formId) {
      resetFormData({
        formNumber: form.properties.formNumber,
        title: form.title,
        subjectOfSubmission: form.properties.subjectOfSubmission,
        submissionType: getDefaultSubmissionType(form, router),
        formId: id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, formData]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>{t("loading-text")}</div>;
  }

  const downloadButton: ButtonType = {
    text: tCommon("button.next"),
    path: Paths.downloadPage,
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: "right",
  };

  const submitButton: ButtonType = {
    text: tCommon("button.next"),
    external: true,
    path: createSubmissionUrl(form, formData),
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: "right",
  };

  const previousButton: ButtonType = {
    text: tCommon("button.previous"),
    variant: "secondary",
    icon: <ArrowLeftIcon aria-hidden />,
    path: referrerPage,
    external: true,
  };

  return (
    <Layout title={t("title")} backUrl={referrerPage}>
      <Section>
        <Heading size="large" level="2">
          {form.title}
        </Heading>
        <Ingress>{form.properties.formNumber}</Ingress>
      </Section>

      {isSubmissionAllowed(form) ? (
        <>
          {areBothSubmissionTypesAllowed(form) && !isSubmissionParamSet(router) && <ChooseSubmissionType />}

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
                text: tCommon("button.cancel"),
                path: Paths.base,
                variant: "tertiary",
              },
            ]}
          />
        </>
      ) : (
        <Alert variant="info">{t("no-attachments-alert")}</Alert>
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const id = params?.id as string;

  const translations = await getServerSideTranslations(locale, ["common", "detaljer", "validator"]);
  const form = await getForm(id, locale);
  const navUnits = await getNavUnits();

  return { props: { ...translations, form, id, navUnits }, revalidate: 120 };
};

export const getStaticPaths = async () => {
  const forms = await getForms();

  return {
    paths: forms.map((form) => ({ params: { id: form.path } })),
    fallback: true,
  };
};

export default Detaljer;
