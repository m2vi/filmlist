import Card from '@components/Card';
import { Input } from '@components/Input';
import Title from '@components/Title';
import search from '@utils/backend/search';
import { FrontendItemProps } from '@utils/types';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { performance } from 'perf_hooks';
import { createRef, useEffect } from 'react';

const Search = ({ results, log }: any) => {
  const { t } = useTranslation();
  const InputRef = createRef<HTMLInputElement>();
  const Router = useRouter();

  useEffect(() => console.log(log), [log]);

  return (
    <div className='h-full w-full flex items-center flex-col'>
      <Title title={t('pages.filmlist.menu.search')} />
      <div className='flex justify-center items-center w-full max-h-11 mt-11 pt-11 mb-11'>
        <Input
          placeholder='Titles, Ids'
          className='max-w-lg w-full'
          ref={InputRef}
          onChange={(e) => Router.push(`/search?q=${e.currentTarget.value}`)}
        />
      </div>
      <main className='w-full flex flex-col'>
        <div className='w-full overflow-y-scroll dD5d-items max-w-screen-2xl px-11' id='scrollableDiv' style={{ overflowX: 'hidden' }}>
          <div
            className='w-full p-0 grid gap-2 auto-rows-auto place-items-center !overflow-x-hidden '
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              overflowX: 'hidden',
            }}
          >
            {results.map(({ ...props }, i: number) => {
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
  const start = performance.now();
  const query = context.query.q?.toString();
  const props = {
    ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
    results: query ? await search.get(query, { locale: context.locale! }) : [],
  };

  return {
    props: {
      ...props,
      log: {
        query,
        locale: context.locale,
        time: performance.now() - start,
        results: {
          count: props.results.length,
          items: props.results,
        },
      },
    },
  };
};

// Könnte dämlich sein
