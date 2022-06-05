import main from '@apis/main';
import Page from '@components/pages/Downloads';
import { FrontendItemProps } from '@Types/items';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = ({ data }: { data: FrontendItemProps[] }) => <Page data={data} />;

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await main.f_local_items(context.locale!),
    },
  };
};
