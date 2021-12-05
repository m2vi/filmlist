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
    <Full className='pt-10 flex justify-center'>
      <Title title='Browse' />
      <div className='w-full items-center pt-11 px-11' style={{ maxWidth: '2220px' }}>
        {Object.entries(props.data).map(([key, section], i) => {
          return <Carousel section={section as any} key={i} />;
        })}
      </div>
    </Full>
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
