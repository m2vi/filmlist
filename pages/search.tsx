import Card from '@components/Card';
import { Input } from '@components/Input';
import Title from '@components/Title';
import search from '@utils/frontend/search';
import { FrontendItemProps } from '@utils/types';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { createRef, useState } from 'react';

const Search = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<FrontendItemProps[][]>([[], []]);
  const { locale } = useRouter();
  const InputRef = createRef<HTMLInputElement>();

  const fetchMore = () => {
    if (!InputRef.current) return;
    const start = window.performance.now();
    const value = InputRef.current.value;
    search
      .fetchMoreData(value, locale)
      .then((data) => {
        setItems(data);
        const end = window.performance.now();
        const time = end - start;

        console.log({
          query: value,
          locale,
          time: `${moment(time).valueOf()}ms`,
          results: data,
        });
      })
      .catch(console.log);
  };

  return (
    <div className='h-full w-full flex items-center flex-col'>
      <Title title={t('pages.filmlist.menu.search')} />
      <div className='flex justify-center items-center w-full max-h-11 mt-11 pt-11 mb-11'>
        <Input placeholder='Titles, Ids' className='max-w-lg w-full' ref={InputRef} onKeyDown={(e) => e.code === 'Enter' && fetchMore()} />
      </div>
      <main className='w-full flex flex-col'>
        <div
          className='w-full overflow-y-scroll dD5d-items max-w-screen-2xl px-11 pt-11'
          id='scrollableDiv'
          style={{ overflowX: 'hidden' }}
        >
          <div
            className='w-full p-0 grid gap-2 auto-rows-auto place-items-center !overflow-x-hidden '
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              overflowX: 'hidden',
            }}
          >
            {items[0].map(({ ...props }, i: number) => {
              return <Card {...(props as FrontendItemProps)} key={i} />;
            })}
          </div>
        </div>
        <h2 className='w-full max-w-screen-2xl px-11 pt-11 pb-4'>TMDB Results</h2>
        <div className='w-full overflow-y-scroll dD5d-items max-w-screen-2xl px-11' id='scrollableDiv' style={{ overflowX: 'hidden' }}>
          <div
            className='w-full p-0 grid gap-2 auto-rows-auto place-items-center !overflow-x-hidden '
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              overflowX: 'hidden',
            }}
          >
            {items[1].map(({ ...props }, i: number) => {
              return <Card {...(props as FrontendItemProps)} key={i} />;
            })}
          </div>
        </div>
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
    },
  };
};

// Könnte dämlich sein
