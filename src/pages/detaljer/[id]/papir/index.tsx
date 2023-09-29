import "@navikt/ds-css";
import type { GetStaticProps, NextPage } from "next";
import { EttersendelseApplication, Form, NavUnit, SubmissionType } from "../../../../data/domain";
import FormDetail from "src/components/page/FormDetail";
import { getServerSideTranslations } from "src/utils/i18nUtil";
import { getForm, getForms, getNavUnits } from "src/api/apiService";
import { useRouter } from "next/router";
import { isPaperSubmissionAllowed } from "src/utils/submissionUtil";

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
  navUnits: NavUnit[];
}

const PaperDetail: NextPage<Props> = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <FormDetail
      form={props.form}
      id={props.id}
      existingEttersendinger={props.existingEttersendinger}
      submissionType={SubmissionType.paper}
      navUnits={props.navUnits}
    ></FormDetail>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const id = params?.id as string;
  const form = await getForm(id, locale);

  // If the form submission type is not digital, return 404
  if (!form || (form && !isPaperSubmissionAllowed(form))) {
    console.log("Form not found", id);
    return { notFound: true };
  }

  const translations = await getServerSideTranslations(locale, ["common", "detaljer", "validator"]);
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

export default PaperDetail;
