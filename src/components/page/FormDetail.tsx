import "@navikt/ds-css";
import { Alert, Heading, Ingress } from "@navikt/ds-react";
import type { NextPage } from "next";
import { EttersendelseApplication, Form, NavUnit, SubmissionType } from "../../data/domain";
import ChooseAttachments from "../../components/attachment/chooseAttachments";
import ButtonGroup from "../../components/button/buttonGroup";
import ChooseUser from "../../components/submission/chooseUser";
import { useFormState } from "../../data/appState";
import { useEffect } from "react";
import Section from "../../components/section/section";
import Layout from "../../components/layout/layout";
import { Paths } from "../../data/text";
import {
  createSubmissionUrl,
  getDefaultSubmissionType,
  isSubmissionTypePaper,
  isSubmissionAllowed,
} from "../../utils/submissionUtil";
import { ButtonType } from "../../components/button/buttonGroupElement";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { useReffererPage } from "src/hooks/useReferrerPage";
import { useTranslation } from "next-i18next";

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
  submissionType?: SubmissionType;
  navUnits: NavUnit[];
}

const FormDetail: NextPage<Props> = (props) => {
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
        submissionType: getDefaultSubmissionType(form, props.submissionType),
        formId: id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, formData]);

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

export default FormDetail;
