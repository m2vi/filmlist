import Scroll from '@components/Scroll';
import api from '@utils/backend/api';
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
      data: await api.getTab({ tab: query.tab, locale, start: 0, end: 75 }),
    },
  };
};
