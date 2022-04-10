import Tab from '@components/Tab';
import { GetTabResponse } from '@Types/filmlist';
import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = (props: { data: GetTabResponse }) => <Tab {...props} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await filmlist.getTab({
        user: id,
        locale: context.locale!,
        tab: context.query.tab?.toString()!,
        start: 0,
        end: 80,
        purpose: 'items_f',
      }),
    },
  };
};
