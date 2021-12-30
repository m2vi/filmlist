import Details from '@components/Details';
import api from '@utils/backend/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Movie = ({ ...props }) => <Details {...props} />;

Movie.layout = true;

export default Movie;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: await api.details('movie', parseInt(query.id), locale),
    },
  };
};
