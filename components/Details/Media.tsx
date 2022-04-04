import config from '@data/config.json';
import { useTranslation } from 'next-i18next';
import { Fragment, useEffect } from 'react';
import Head from 'next/head';
import Item from './components/Item';
import ItemLink from './components/ItemLink';
import GenreIds from './components/GenreIds';
import { durationFormat } from '@utils/apis/filmlist/helper';
import { useRouter } from 'next/router';
import { ItemProps } from '@Types/items';
import AsyncCarousel from '@components/Carousel/async';
import QueryString from 'qs';
import userClient from '@utils/user/client';
import { basicFetch } from '@utils/helper/fetch';
import TrailerModal from './components/TrailerModal';

const Media = ({ data }: { data: ItemProps }) => {
  const { t } = useTranslation();
  const locale = useRouter().locale!;

  useEffect(() => console.log(data), [data]);
  return (
    <Fragment>
      <Head>
        <title>{`${data.name[locale]} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      <div className='w-full grid grid-cols-2 gap-80 px-80'>
        <div className='flex flex-col relative mb-2 w-full' style={{ maxWidth: '480px' }}>
          <div className='w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden' style={{ aspectRatio: '2 / 3' }}>
            <TrailerModal data={data} />
          </div>
        </div>
        <div className='w-full' style={{ maxWidth: '480px' }}>
          <h2 className='text-4xl leading-none font-bold'>{data.name[locale]}</h2>
          <p className='text-primary-300 mt-4 text-justify mb-5'>{data.overview[locale]}</p>

          <div className='w-full grid grid-cols-2 auto-rows-auto mt-5 gap-5'>
            <Item name={t('details.runtime')} value={durationFormat(data.runtime, locale!)} />
          </div>
          <GenreIds ids={data.genre_ids} />
        </div>
      </div>
      <div className='pt-80'>
        <AsyncCarousel
          func={async () => {
            const items = await basicFetch(
              `/api/recommendations?${QueryString.stringify({ id: data.id_db, type: data.type, locale, user: userClient.id })}`
            );

            return {
              items,
              key: null,
              length: items.length,
              query: {},
              tmdb: true,
            };
          }}
        />
      </div>
    </Fragment>
  );
};

export default Media;
