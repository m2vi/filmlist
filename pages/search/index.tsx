import Search from '@components/Search';
import { FrontendItemProps } from '@Types/items';
import search from '@utils/apis/search';
import user from '@utils/user';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = (props: { data: FrontendItemProps[] }) => <Search {...props} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      data: await search.get({ query: '', locale: context.locale!, user_id: user.getIdFromRequest(context.req), page: 'filmlist' }),
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
  };
};
