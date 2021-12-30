import Details from '@components/Details';
import api from '@utils/backend/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Tv = ({ ...props }) => <Details {...props} />;

Tv.layout = true;

export default Tv;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: await api.details('tv', parseInt(query.id), locale),
    },
  };
};
