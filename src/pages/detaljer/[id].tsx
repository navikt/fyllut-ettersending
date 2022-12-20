import "@navikt/ds-css";
import { Alert, Heading, Ingress } from "@navikt/ds-react";
import type { NextPage } from "next";
import { getForm, getNavUnits } from "../../api/apiService";
import { ButtonText, Form, NavUnit, Paths } from "../../data/domain";
import ChooseAttachments from "../../components/attachment/chooseAttachments";
import ButtonGroup from "../../components/button/buttonGroup";
import ChooseUser from "../../components/submission/chooseUser";
import { useFormState } from "../../data/appState";
import { useEffect } from "react";
import Section from "../../components/section/section";
import Layout from "../../components/layout/layout";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";

interface Props {
  form: Form;
  navUnits: NavUnit[];
  id: string;
}

const Detaljer: NextPage<Props> = (props) => {
  const router = useRouter()
  const {form, navUnits, id} = props;
  const {formData, resetFormData} = useFormState();

  const getNavUnitsConnectedToForm = (deviceTypes: string[] | undefined) => {
    const navUnitsConnectedToForm = navUnits.filter((navUnit) => deviceTypes?.includes(navUnit.type));
    return navUnitsConnectedToForm || navUnits;
  };

  useEffect(() => {
    if (id !== formData.formId) {
      resetFormData({
        formNumber: form.properties.formNumber,
        title: form.title,
        subjectOfSubmission: form.properties.subjectOfSubmission,
        formId: id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, formData]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <Layout title="Ettersende dokumentasjon i posten">
      <Section>
        <Heading size="large" level="2">
          {form.title}
        </Heading>
        <Ingress>{form.properties.formNumber}</Ingress>
      </Section>

      {
        form.attachments?.length > 0 ? (
          <>
            <ChooseAttachments form={form} />

            <ChooseUser navUnits={getNavUnitsConnectedToForm(form.properties.navUnitTypes)} />

            <ButtonGroup
              buttons={[{
                text: ButtonText.next,
                path: Paths.downloadPage,
                validateForm: true
              }, {
                text: ButtonText.cancel,
                path: "/",
                variant: "tertiary"
              }]}
            />
          </>
        ) : (
          <Alert variant="info">
            Dette skjemaet har ingen vedlegg som kan ettersendes.
          </Alert>
        )
      }
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { res } = context;
  res.setHeader(
    "Cache-Control",
    "public, maxage=1800"
  );

  const id = context.params?.id as string;
  const formData = getForm(id);
  const navUnitsData = getNavUnits();

  const [form, navUnits] = await Promise.all([formData, navUnitsData]);

  return {
    props: {form, navUnits, id},
  };
}

export default Detaljer;
