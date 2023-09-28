import "@navikt/ds-css";
import type { NextPage } from "next";
import { EttersendelseApplication, Form, SubmissionType, UnauthenticatedError } from "../../../../data/domain";
import { GetServerSidePropsContext } from "next/types";
import { getIdPortenToken } from "src/api/loginRedirect";
import { getEttersendinger, getForm, getNavUnits } from "src/api/apiService";
import { ServerResponse } from "http";
import { getServerSideTranslations } from "../../../../utils/i18nUtil";
import FormDetail from "src/components/page/FormDetail";

interface Props {
  form: Form;
  id: string;
  existingEttersendinger: EttersendelseApplication[];
}

// For digital submissions we need to log in to see if there are existing "ettersendinger". This cannot be done statically.
const DigitalDetail: NextPage<Props> = (props) => {
  return <FormDetail {...props} submissionType={SubmissionType.digital}></FormDetail>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Set cache control header
  const { res } = context;
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");

  // Attempt to verify the token and redirect to login if necessary
  let idportenToken = "";
  try {
    idportenToken = (await getIdPortenToken(context)) as string;
  } catch (ex) {
    if (ex instanceof UnauthenticatedError) {
      return redirectToLogin(context);
    }
  }

  // Fetch the form
  const id = context.params?.id as string;
  const { locale } = context;
  const form = await getForm(id, locale);
  const navUnits = await getNavUnits();
  const translations = await getServerSideTranslations(locale, ["common", "detaljer", "validator"]);

  // Fetch existing ettersendinger and redirect if necessary
  let existingEttersendinger: EttersendelseApplication[] = [];
  if (idportenToken && form?.properties.formNumber) {
    existingEttersendinger = await getEttersendinger(idportenToken, form.properties.formNumber);
    redirectBasedOnExistingEttersendinger(existingEttersendinger, res);
  }

  return {
    props: { form, existingEttersendinger, id, navUnits, ...translations },
  };
}

const redirectBasedOnExistingEttersendinger = (
  existingEttersendinger: EttersendelseApplication[],
  res: ServerResponse,
) => {
  if (existingEttersendinger.length === 1) {
    res.setHeader("Location", `${process.env.SEND_INN_FRONTEND_URL}/${existingEttersendinger[0].innsendingsId}`);
    res.statusCode = 302;
  }

  if (existingEttersendinger.length > 1) {
    res.setHeader("Location", `${process.env.MIN_SIDE_FRONTEND_URL}/varsler`);
    res.statusCode = 302;
  }
};

const redirectToLogin = (context: GetServerSidePropsContext) => {
  const querySeparator = context.resolvedUrl.includes("?") ? "&" : "?";
  const referrerQuery = context.req.headers.referer ? `${querySeparator}referrer=${context.req.headers.referer}` : "";
  const redirect = encodeURIComponent("/fyllut-ettersending" + context.resolvedUrl + referrerQuery);
  return {
    redirect: {
      permanent: false,
      destination: `/oauth2/login?redirect=${redirect}`,
    },
    props: {},
  };
};

export default DigitalDetail;
