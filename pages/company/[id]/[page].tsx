import Scroll from '@components/Scroll';
import api from '@utils/backend/api';
import client from '@utils/tmdb/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

const Company = (props: any) => {
  useEffect(() => console.log(props.data), [props]);

  return <Scroll data={props.data} />;
};

Company.layout = true;

export default Company;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  const company = await client.getCompany(query.id);
  const items = await api.getCompanyItems({ id: parseInt(query.id), locale, page: parseInt(query.page) });

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: {
        name: company?.name ? company?.name : null,
        homepage: company?.route ? company?.route : null,
        items: items,
        length: items.length,
        id: parseInt(query.id),
      },
    },
  };
};
