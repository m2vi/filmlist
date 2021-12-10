import Card from '@components/Card';
import { Input } from '@components/Input';
import Title from '@components/Title';
import api from '@utils/backend/api';
import search from '@utils/frontend/search';
import { FrontendItemProps, ItemProps } from '@utils/types';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Search = ({ data }: { data: ItemProps[] }) => {
  const { t } = useTranslation();
  const [pattern, setPattern] = useState('');
  const [items, setItems] = useState<FrontendItemProps[]>([]);
  const { locale } = useRouter();

  const fetchMore = () => {
    search.fetchMoreData(data, pattern, locale, items.length).then((data) => {
      setItems(data);
    });
  };

  useEffect(() => {
    fetchMore();

    // eslint-disable-next-line
  }, [pattern]);

  return (
    <div className='h-full w-full flex items-center flex-col'>
      <Title title={t('pages.filmlist.menu.search')} />
      <div className='flex justify-center items-center w-full max-h-11 mt-11 pt-11 mb-11'>
        <Input placeholder='Pattern' className='max-w-lg w-full' onKeyDown={(e) => setPattern(e.currentTarget.value)} />
      </div>
      <main className='w-full overflow-y-scroll dD5d-items max-w-screen-2xl px-11 pt-11' id='scrollableDiv' style={{ overflowX: 'hidden' }}>
        <InfiniteScroll
          dataLength={items.length}
          next={() => null}
          hasMore={true}
          loader={null}
          scrollableTarget='scrollableDiv'
          className='w-full p-0 grid gap-2 auto-rows-auto place-items-center !overflow-x-hidden '
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            overflowX: 'hidden',
          }}
        >
          {items.map(({ ...props }, i: number) => {
            return <Card {...(props as FrontendItemProps)} key={i} />;
          })}
        </InfiniteScroll>
      </main>
    </div>
  );
};

Search.layout = true;

export default Search;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
      data: JSON.stringify(await api.find({})),
    },
  };
};
