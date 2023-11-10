import '@navikt/ds-css';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Layout from '../components/layout/layout';
import Section from '../components/section/section';
import { Paths } from '../data/paths';
import { getServerSideTranslations } from '../utils/i18nUtil';

interface Props {}

const Home: NextPage<Props> = () => {
  const router = useRouter();
  const { t } = useTranslation('home');

  const handleClick = async (path: string) => {
    await router.push(path);
  };

  return (
    <Layout title={t('title')}>
      <Heading size="large" spacing={true}>
        {t('heading')}
      </Heading>

      <Section>
        <BodyShort spacing={true}>{t('attachments.description')}</BodyShort>
        <Button variant="primary" onClick={() => handleClick(Paths.formDocumentation)}>
          {t('attachments.button-text')}
        </Button>
      </Section>

      <Section>
        <BodyShort spacing={true}>{t('other-documentation.description')}</BodyShort>
        <Button variant="primary" onClick={() => handleClick(Paths.otherDocumentation)}>
          {t('other-documentation.button-text')}
        </Button>
      </Section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  if (process.env.APP_ENV === 'production') {
    return { notFound: true };
  }
  const translations = await getServerSideTranslations(locale, ['common', 'home']);
  return { props: { ...translations } };
};

export default Home;
