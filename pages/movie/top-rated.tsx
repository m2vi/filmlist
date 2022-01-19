import Scroll from '@components/Scroll';
import api from '@utils/tmdb/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

const Tab = (props: any) => {
  useEffect(() => console.log(props.data), [props]);

  return <Scroll data={props.data} />;
};

Tab.layout = true;

export default Tab;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: await api.getTMDBTab({ tab: 'top-rated', locale, page: 1, type: 'movie' }),
    },
  };
};
