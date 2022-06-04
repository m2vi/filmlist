import main from '@apis/main';
import Page from '@components/pages/Search';
import { FrontendItemProps } from '@Types/items';
import { FilterProvider } from 'context/useFilter';
import { QueryProvider } from 'context/useQuery';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Home = ({ data }: { data: FrontendItemProps[] }) => {
  return (
    <FilterProvider>
      <QueryProvider>
        <Page data={data} />
      </QueryProvider>
    </FilterProvider>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await main.f_local_items(context.locale!),
    },
  };
};
