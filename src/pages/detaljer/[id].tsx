import "@navikt/ds-css";
import { Alert, Heading, Ingress } from "@navikt/ds-react";
import type { NextPage } from "next";
import { EttersendelseApplication, Form, NavUnit, SubmissionType, UnauthenticatedError } from "../../data/domain";
import ChooseAttachments from "../../components/attachment/chooseAttachments";
import ButtonGroup from "../../components/button/buttonGroup";
import ChooseUser from "../../components/submission/chooseUser";
import { useFormState } from "../../data/appState";
import { useCallback, useEffect, useState } from "react";
import Section from "../../components/section/section";
import Layout from "../../components/layout/layout";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import { fetchNavUnits } from "../../api/apiClient";
import { ButtonText, Paths } from "../../data/text";
import ChooseSubmissionType from "../../components/submission/chooseSubmissionType";
import {
  createSubmissionUrl,
  getDefaultSubmissionType,
  areBothSubmissionTypesAllowed,
  isSubmissionTypeByMail,
  isSubmissionAllowed,
} from "../../utils/submissionUtil";
import { ButtonType } from "../../components/button/buttonGroupElement";
import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { fetchEttersendinger, verifyToken } from "src/api/loginRedirect";
import { getForm } from "src/api/apiService";
import { ServerResponse } from "http";

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
}

const Detaljer: NextPage<Props> = (props) => {
  const router = useRouter();
  const { form, id } = props;
  const { formData, resetFormData } = useFormState();
  const [navUnits, setNavUnits] = useState<NavUnit[]>([]);

  const fetchData = useCallback(async () => {
    setNavUnits(await fetchNavUnits());
  }, []);

  useEffect(() => {
    if (form.properties.navUnitMustBeSelected) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getNavUnitsConnectedToForm = (deviceTypes: string[] | undefined) => {
    const navUnitsConnectedToForm: NavUnit[] = navUnits.filter((navUnit) => deviceTypes?.includes(navUnit.type));
    return navUnitsConnectedToForm && !!Object.keys(navUnitsConnectedToForm).length
      ? navUnitsConnectedToForm
      : navUnits;
  };

  console.log(props.existingEttersendinger);

  useEffect(() => {
    if (id !== formData.formId) {
      resetFormData({
        formNumber: form.properties.formNumber,
        title: form.title,
        subjectOfSubmission: form.properties.subjectOfSubmission,
        submissionType: getDefaultSubmissionType(form),
        formId: id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, formData]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const downloadButton: ButtonType = {
    text: ButtonText.next,
    path: Paths.downloadPage,
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: "right",
  };

  const submitButton: ButtonType = {
    text: ButtonText.next,
    external: true,
    path: createSubmissionUrl(form, formData),
    validateForm: true,
    icon: <ArrowRightIcon aria-hidden />,
    iconPosition: "right",
  };

  return (
    <Layout title="Ettersende dokumentasjon">
      <Section>
        <Heading size="large" level="2">
          {form.title}
        </Heading>
        <Ingress>{form.properties.formNumber}</Ingress>
      </Section>

      {isSubmissionAllowed(form) ? (
        <>
          {areBothSubmissionTypesAllowed(form) && <ChooseSubmissionType />}

          <ChooseAttachments form={form} />

          {isSubmissionTypeByMail(formData) && (
            <ChooseUser
              navUnits={getNavUnitsConnectedToForm(form.properties.navUnitTypes)}
              shouldRenderNavUnits={form.properties.navUnitMustBeSelected}
            />
          )}

          <ButtonGroup
            buttons={[
              formData.submissionType === SubmissionType.digital ? submitButton : downloadButton,
              {
                text: ButtonText.previous,
                variant: "secondary",
                icon: <ArrowLeftIcon aria-hidden />,
                onClick: (e) => {
                  router.back();
                  e.currentTarget.blur();
                },
              },
            ]}
          />
          <ButtonGroup
            center
            buttons={[
              {
                text: ButtonText.cancel,
                path: Paths.base,
                variant: "tertiary",
              },
            ]}
          />
        </>
      ) : (
        <Alert variant="info">Dette skjemaet har ingen vedlegg som kan ettersendes.</Alert>
      )}
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Set cache control header
  const { res } = context;
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");

  // Attempt to verify the token
  let idportenToken: string = "";
  try {
    idportenToken = (await verifyToken(context)) as string;
  } catch (ex) {
    if (ex instanceof UnauthenticatedError) {
      return redirectToLogin(context);
    }
  }

  // Fetch the form
  const id = context.params?.id as string;
  const form = await getForm(id);

  // Fetch existing ettersendinger and redirect if necessary
  let existingEttersendinger: EttersendelseApplication[] = [];
  if (idportenToken && form?.properties.formNumber) {
    existingEttersendinger = await fetchEttersendinger(idportenToken, form.properties.formNumber);
    redirectBasedOnExistingEttersendinger(existingEttersendinger, res);
  }

  return {
    props: { form, existingEttersendinger, id },
  };
}

const redirectBasedOnExistingEttersendinger = (
  existingEttersendinger: EttersendelseApplication[],
  res: ServerResponse
) => {
  if (existingEttersendinger.length === 1) {
    res.setHeader("Location", `${process.env.SEND_INN_FRONTEND_URL}/${existingEttersendinger[0].innsendingsId}`);
    res.statusCode = 302;
  }

  if (existingEttersendinger.length > 1) {
    res.setHeader("Location", `${process.env.MIN_SIDE_URL}/varsler`);
    res.statusCode = 302;
  }
};

const redirectToLogin = (context: GetServerSidePropsContext) => {
  return {
    redirect: {
      permanent: false,
      destination: `/oauth2/login?redirect=/fyllut-ettersending${context.resolvedUrl}`,
    },
    props: {},
  };
};

export default Detaljer;
