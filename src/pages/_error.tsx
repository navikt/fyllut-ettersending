import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { InternalServerError } from '../components/error/InternalServerError';
import { NotFound } from '../components/error/NotFound';

const Error = ({ statusCode }: { statusCode: number }) => {
  return statusCode === 500 ? <InternalServerError /> : <NotFound />;
};

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  const statusCode = res.statusCode;
  return {
    props: {
      statusCode,
      ...(await serverSideTranslations(locale ?? 'nb', ['common'])),
    },
  };
};

export default Error;
