import Carousel from '@components/Carousel';
import Full from '@components/Full';
import { Spinner } from '@components/Spinner';
import Title from '@components/Title';
import api from '@utils/backend/api';
import client from '@utils/themoviedb/api';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Home = ({ ...props }) => {
  const { t } = useTranslation();

  return (
    <Full className='grid place-items-center'>
      <Title title='Home' />
      <div className='w-full py-11'>
        {Object.entries(props.data).map(([name, items], i) => {
          return (
            <div className='flex flex-col' key={i}>
              <h3 className='mb-2'> {t(`pages.filmlist.menu.${name}`)}</h3>
              <Carousel />
            </div>
          );
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
        ...(await api.getBrowse()),
      },
    },
  };
};
