import '@navikt/ds-css';
import { NextPageContext } from 'next';
import { Error as ErrorComponent } from '../components/error/Error';
import Layout from '../components/layout/layout';

const Error = ({ statusCode }: { statusCode: number }) => {
  return (
    <Layout title={statusCode === 400 ? 'Feil: fant ikke siden' : 'Feil: noe gikk galt.'} hideTitle>
      {statusCode === 500 ? (
        <ErrorComponent
          heading={'Beklager, noe gikk galt.'}
          errorBody={
            'En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.'
          }
          navigateToFrontPage={'Gå til forsiden'}
          ctaButton={'Bruk gjerne søket eller menyen'}
          bugUrlTitle={'Meld inn feil på denne lenken'}
        />
      ) : (
        <ErrorComponent
          heading={'Beklager, vi fant ikke siden'}
          errorBody={'Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.'}
          navigateToFrontPage={'Gå til forsiden'}
          ctaButton={'Bruk gjerne søket eller menyen'}
          bugUrlTitle={'Meld inn feil på denne lenken'}
        />
      )}
    </Layout>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
