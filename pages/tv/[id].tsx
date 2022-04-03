import Media from '@components/Details/Media';
import { ItemProps } from '@Types/items';
import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Page = ({ data }: { data: ItemProps }) => {
  return <Media data={data} />;
};

Page.layout = true;

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await filmlist.getFast(parseInt(context.query.id?.toString()!), 0, id),
    },
  };
};
