import "@navikt/ds-css";
import { Heading, Ingress } from "@navikt/ds-react";
import type { NextPage } from "next";
import { GetServerSidePropsContext } from "next/types";
import { getForm, getNavUnits } from "../../api/apiService";
import { ButtonText, Form, NavUnit, Paths } from "../../data/domain";
import ChooseAttachments from "../../components/attachment/chooseAttachments";
import ButtonGroup from "../../components/button/buttonGroup";
import ChooseUser from "../../components/submission/chooseUser";
import { useFormState } from "../../data/appState";
import { useEffect } from "react";
import Section from "../../components/section/section";
import Layout from "../../components/layout/layout";

interface Props {
  form: Form;
  navUnits: NavUnit[];
  id: string;
}

const Detaljer: NextPage<Props> = (props) => {
  const {form, navUnits, id} = props;
  const {formData, resetFormData} = useFormState();

  const getNavUnitsConnectedToForm = (deviceTypes: string[] | undefined) => {
    const navUnitsConnectedToForm = navUnits.filter((navUnit) => deviceTypes?.includes(navUnit.type));
    return navUnitsConnectedToForm || navUnits;
  };

  useEffect(() => {
    if (id !== formData.formId) {
      console.log("reset", id, formData.formId, formData);
      resetFormData({
        formNumber: form.properties.formNumber,
        title: form.title,
        theme: form.properties.theme,
        formId: id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, formData]);

  return (
    <Layout title="Ettersende dokumentasjon i posten">
      <Section>
        <Heading size="large" level="2">
          {form.title}
        </Heading>
        <Ingress>{form.properties.formNumber}</Ingress>
      </Section>

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
  const form = await getForm(id);
  const navUnits = await getNavUnits();

  return {
    props: {form, navUnits, id},
  };
}

export default Detaljer;
