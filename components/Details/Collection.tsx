import config from '@data/config.json';
import { useTranslation } from 'next-i18next';
import { Fragment, useEffect } from 'react';
import Head from 'next/head';
import { GetCollectionProps } from '@Types/filmlist';
import Carousel from '../Carousel';
import Item from './components/Item';
import ItemLink from './components/ItemLink';
import GenreIds from './components/GenreIds';
import { durationFormat } from '@utils/apis/filmlist/helper';
import { useRouter } from 'next/router';
import { RatingCircle } from '@components/Rating/RatingCircle';

const Collection = ({ data: { data, items } }: { data: GetCollectionProps }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  useEffect(() => console.log(data), [data]);
  return (
    <Fragment>
      <Head>
        <title>{`${data.name} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      <div className='w-full grid grid-cols-2 gap-80 px-80'>
        <div className='flex flex-col relative mb-2 w-full' style={{ maxWidth: '480px' }}>
          <div className='w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden' style={{ aspectRatio: '2 / 3' }}>
            <img
              src={`https://image.tmdb.org/t/p/${config.highResPosterWidth}${data.poster_path}`}
              alt=''
              style={{ aspectRatio: '2 / 3' }}
              className='no-drag select-none overflow-hidden relative w-full'
            />
          </div>
        </div>
        <div className='w-full' style={{ maxWidth: '480px' }}>
          <h2 className='text-4xl leading-none font-bold'>{data.name}</h2>
          <p className='text-primary-300 mt-4 text-justify mb-5'>{data.overview}</p>
          <RatingCircle colorClassName='tmdb' provider={{ vote_average: data.rating, vote_count: null }} />
          <div className='w-full grid grid-cols-2 auto-rows-auto mt-5 gap-5'>
            <Item name={t('collection.count')} value={data.tmdb_items.toString()} />
            <ItemLink name='TMDB ID' value={data.id?.toString()!} href={`https://www.themoviedb.org/collection/${data.id}`} />
            <Item name={t('collection.local_count')} value={data.local_items.toString()} />
            <Item name='Marathon Länge' value={durationFormat(data.local_marathon_length, locale!)} />
          </div>
          <GenreIds ids={data.genre_ids} />
        </div>
      </div>
      <div className='pt-80'>
        <Carousel section={{ key: null, items, length: items.length, query: {} }} />
      </div>
    </Fragment>
  );
};

export default Collection;
