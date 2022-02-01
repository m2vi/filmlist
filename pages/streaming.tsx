import Full from '@components/Full';
import Title from '@components/Title';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Streaming = () => {
  return (
    <Full className='pt-10 flex justify-center'>
      <Title title='Streaming' />
    </Full>
  );
};

export default Streaming;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  };
};
