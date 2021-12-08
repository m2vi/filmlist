import Carousel from '@components/Carousel';
import Full from '@components/Full';
import Title from '@components/Title';
import api from '@utils/backend/api';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

const Home = ({ ...props }) => {
  const { t } = useTranslation();

  return (
    <div className='pt-10 w-full flex justify-center'>
      <Title title='Browse' />
      <div className='w-full items-center pt-11 px-11 max-w-screen-2xl'>
        {Object.entries(props.data).map(([key, section], i) => {
          return <Carousel section={section as any} key={i} />;
        })}
      </div>
    </div>
  );
};

Home.layout = true;

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
      data: {
        ...(await api.getBrowse(context.locale)),
      },
    },
  };
};
