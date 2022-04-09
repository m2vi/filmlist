import { FrontendItemProps } from '@Types/items';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import config from '@data/config.json';
import Card from '@components/Card';

const Filter = ({ data }: { data: FrontendItemProps[] }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState(data);
  useEffect(() => console.log(data), [data]);

  return (
    <Fragment>
      <Head>
        <title>{`${t(`pages.filmlist.menu.filter`)} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>
      <div className='w-full flex'>
        <div className='w-400'></div>
        <div
          className='h-full w-full grid gap-4 grid-flow-row place-items-center'
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${config.cardWidth}, 1fr))` }}
        >
          {items.map((item, index) => {
            return <Card {...item} key={index} />;
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default Filter;
