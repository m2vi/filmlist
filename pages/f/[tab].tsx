import main from '@apis/main';
import user from '@apis/user';
import Tab from '@components/Tab';
import { GetTabResponse } from '@Types/items';
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
      data: await main.getTab({
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
