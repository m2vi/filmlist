import Full from '@components/Full';
import { Spinner } from '@components/Spinner';
import Title from '@components/Title';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Home = () => {
  return (
    <Full className='grid place-items-center'>
      <Title title='Home' />
      <Spinner size='6' />
    </Full>
  );
};

Home.layout = true;

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
    },
  };
};
