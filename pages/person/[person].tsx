import Scroll from '@components/Scroll';
import api from '@utils/backend/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

const Person = (props: any) => {
  useEffect(() => console.log(props.data), [props]);

  return <Scroll data={props.data} />;
};

Person.layout = true;

export default Person;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: await api.getTab({ tab: 'person', locale, start: 0, end: 75, includePerson: parseInt(query.person) }),
    },
  };
};
