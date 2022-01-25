import { FrontendItemProps } from '@utils/types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import QueryString from 'qs';
import { ChangeEvent, createRef } from 'react';
import Card from './Card';
import { Input } from './Input';
import Title from './Title';

const Search = ({ results }: { results: any[] }) => {
  const Router = useRouter();
  const InputRef = createRef<HTMLInputElement>();
  const { t } = useTranslation();

  const handleChange = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
    const qs = QueryString.stringify({ q: currentTarget?.value ? currentTarget?.value : undefined });
    const url = `${Router.pathname}${qs ? `?${qs}` : ''}`;

    Router.push(url);
  };

  return (
    <div className='h-full w-full flex items-center flex-col'>
      <Title title={t('pages.filmlist.menu.search')} />
      <div className='flex justify-center items-center w-full max-h-11 mt-11 pt-11 mb-11'>
        <Input placeholder='Query' className='max-w-lg w-full' ref={InputRef} onChange={handleChange} />
      </div>
      <main className='w-full flex justify-center flex-col'>
        <div
          className='w-full overflow-y-scroll dD5d-item max-w-screen-2xl px-120 mt-11 pb-11'
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
            {results.map(({ ...props }, i: number) => {
              return <Card {...(props as FrontendItemProps)} key={i} />;
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
