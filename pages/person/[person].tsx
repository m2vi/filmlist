import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import client from '@utils/tmdb/api';
import Person from '@components/Layout/details/Person';

const Handler = ({ ...props }) => <Person {...props} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  const data = await client.getPerson(parseInt(query.person), locale);

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data,
    },
  };
};
