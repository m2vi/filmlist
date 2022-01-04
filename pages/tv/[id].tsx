import Details from '@components/Layout/details/Details';
import api from '@utils/backend/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = ({ ...props }) => <Details {...props} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: await api.details('tv', parseInt(query.id), locale),
    },
  };
};
