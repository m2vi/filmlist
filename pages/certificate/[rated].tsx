import Scroll from '@components/Scroll';
import api from '@utils/backend/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

const Handler = (props: any) => {
  useEffect(() => console.log(props.data), [props]);

  return <Scroll data={props.data} />;
};

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: await api.getTab({
        tab: 'none',
        locale,
        start: 0,
        end: 75,
        custom_config: {
          filter: {
            rated: query?.rated === 'null' ? null : query?.rated,
          },
        },
      }),
    },
  };
};
