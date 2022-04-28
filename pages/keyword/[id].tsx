import Tab from '@components/Tab';
import { GetTabResponse } from '@Types/filmlist';
import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = (props: { data: GetTabResponse; name: string }) => <Tab {...props} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);
  const keyword = context.query.id?.toString();

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      name: keyword,
      data: await filmlist.getTab({
        user: id,
        locale: context.locale!,
        start: 0,
        end: 80,
        tab: 'key',
        custom_config: {
          filter: {
            keywords: keyword,
          },
        },
        purpose: 'items_f',
      }),
    },
  };
};
