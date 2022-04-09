import { FrontendItemProps } from '@Types/items';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { ChangeEvent, ChangeEventHandler, Fragment, useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import config from '@data/config.json';
import Card from '@components/Card';
import { useRouter } from 'next/router';
import QueryString from 'qs';
import { debounce } from 'lodash';
import { basicFetch } from '@utils/helper/fetch';

const Search = ({ data }: { data: FrontendItemProps[] }) => {
  const { t } = useTranslation();
  const { locale, asPath } = useRouter();
  const [items, setItems] = useState(data);
  useEffect(() => console.log(data), [data]);

  const search = async (query: string) => {
    if (!query) return data;
    return await basicFetch(
      `/api/search?${QueryString.stringify({ query, locale, page: asPath.includes('external') ? 'tmdb' : 'filmlist' })}`
    ).catch(console.error);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    search(value).then((data) => {
      if (!data) return;
      setItems(data);
    });
  };

  const searchDebounce = debounce(handleChange, 150);

  return (
    <Fragment>
      <Head>
        <title>{`${t(`pages.filmlist.menu.search`)} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>
      <div className='flex w-full'>
        <div className='flex h-8 w-full bg-primary-800 border rounded-8 border-primary-700'>
          <div className='h-full px-3 flex justify-center items-center'>
            <span className='font-normal text-sm text-center items-center cursor-pointer text-primary-300'>
              <IoSearch className='h-35 w-35' />
            </span>
          </div>
          <input
            className='bg-transparent placeholder-primary-300 text-primary-200 w-full py-2 p pr-4 rounded-8'
            onChange={searchDebounce}
          />
        </div>
      </div>

      <div className='w-full flex flex-col mt-10'>
        <div
          className='h-full w-full grid gap-4 grid-flow-row place-items-center'
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${config.cardWidth}, 1fr))` }}
        >
          {items.map((item, index) => {
            return <Card {...item} key={index} />;
          })}
        </div>
        <div className='w-full mt-4'>
          <span className='text-primary-300'>Showing {items.length} results</span>
        </div>
      </div>
    </Fragment>
  );
};

export default Search;
