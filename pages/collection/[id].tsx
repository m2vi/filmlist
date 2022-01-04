import Collection from '@components/Layout/details/Collection';
import api from '@utils/backend/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = ({ ...props }) => <Collection {...props} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: await api.findCollection(parseInt(query.id), locale),
    },
  };
};
