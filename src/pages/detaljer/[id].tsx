import "@navikt/ds-css";
import { Detail, Heading } from "@navikt/ds-react";
import type { NextPage } from "next";
import { GetServerSidePropsContext } from "next/types";
import { getForm, getNavUnits } from "../../api/apiService";
import { ButtonText, Form, NavUnit, Paths } from "../../api/domain";
import ChooseAttachments from "../../components/attachment/chooseAttachments";
import ButtonGroup from "../../components/button/buttonGroup";
import SubmissionRadioGroup from "../../components/submission/submissionRadioGroup";
import { useFormData } from "../../data/appState";
import { useEffect } from "react";
import Section from "../../components/section/section";
import { validateFormData } from "../../utils/validator";

interface Props {
  form: Form;
  navUnits: NavUnit[];
  id: string;
}

const Detaljer: NextPage<Props> = (props) => {
  const { form, navUnits, id } = props;
  const { formData, setFormData } = useFormData();


  const updateFormData = (key: string, data: any) => {
    let updatedFormData = { ...formData, [key]: data };
    const errorMsg = validateFormData(updatedFormData);
    setFormData({ ...formData, [key]: data, errors: errorMsg });
  };

  const getNavUnitsFromApplicationData = (deviceTypes: string[] | undefined) => {
    return navUnits.filter((navUnit) => deviceTypes?.includes(navUnit.type));
  };

  useEffect(() => {
    setFormData({
      ...formData,
      formNumber: form.properties.formNumber,
      title: form.title,
      theme: form.properties.theme,
      formId: id,
    });
  }, [id]);

  return (
    <>
      <Heading spacing size="large" level="2">
        Sende dokumentasjon i posten
      </Heading>

      <Section>
        <Heading level="1" size="small">
          {form.title}
        </Heading>
        <Detail spacing>{form.properties.formNumber}</Detail>
      </Section>

      <ChooseAttachments form={form} formData={formData} updateFormData={updateFormData} />

      <SubmissionRadioGroup
        formData={formData}
        updateFormData={updateFormData}
        navUnits={getNavUnitsFromApplicationData(form.properties.navUnitTypes)}
      />

      <ButtonGroup
        primaryBtnPath={Paths.downloadPage}
        primaryBtnText={ButtonText.next}
        secondaryBtnText={ButtonText.cancel}
        validate
      />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;
  const form = await getForm(id);
  const navUnits = await getNavUnits();

  return {
    props: { form, navUnits, id },
  };
}

export default Detaljer;
