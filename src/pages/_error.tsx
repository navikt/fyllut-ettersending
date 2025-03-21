import { NextPageContext } from 'next';
import { ErrorComponent } from '../components/error/ErrorComponent';
import Layout from '../components/layout/layout';
// import ErrorComponent from '../components/error';

const Error = ({ statusCode }: { statusCode: number }) => {
  return (
    <Layout title="Ettersend dokumentasjon" showBackLink={false}>
      {statusCode === 404 ? (
        <ErrorComponent
          heading={'Beklager en feil oppsto'}
          errorBody={'Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.'}
          navigateToFrontPage={'Gå til forsiden'}
          ctaButton={'Bruk gjerne søket eller menyen'}
          bugUrlTitle={'Meld inn feil på denne lenken'}
        />
      ) : (
        <p>En feil har oppstått. Vennligst prøv igjen senere</p>
      )}
    </Layout>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
