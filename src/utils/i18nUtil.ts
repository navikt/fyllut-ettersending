import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideTranslations = async (locale: string | undefined, namespacesRequired: string[]) => {
  return await serverSideTranslations(locale ?? 'nb', namespacesRequired);
};
