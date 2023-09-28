import "@navikt/ds-css";
import type { GetStaticProps, NextPage } from "next";
import { EttersendelseApplication, Form, NavUnit } from "../../../data/domain";
import { getForm, getForms, getNavUnits } from "src/api/apiService";
import { getServerSideTranslations } from "../../../utils/i18nUtil";
import FormDetail from "src/components/page/FormDetail";

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
  navUnits: NavUnit[];
}

const Detaljer: NextPage<Props> = (props) => {
  return <FormDetail {...props}></FormDetail>;
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
