import config from '@data/config.json';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { truncate } from '@utils/utils';
import Head from 'next/head';
import { GetPersonResponse } from '@Types/filmlist';
import Carousel from '../Carousel';
import Item from './components/Item';
import ItemLink from './components/ItemLink';
import AsyncCarousel from '@components/Carousel/async';
import QueryString from 'qs';
import { basicFetch } from '@utils/helper/fetch';
import { useRouter } from 'next/router';

const Person = ({ data }: { data: GetPersonResponse }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [length, setLength] = useState(0);

  useEffect(() => console.log(data), [data]);

  return (
    <Fragment>
      <Head>
        <title>{`${data.info.name} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      <div className='w-full grid grid-cols-2 gap-80 px-80'>
        <div className='flex flex-col relative mb-2 w-full' style={{ maxWidth: '480px' }}>
          <div className='w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden' style={{ aspectRatio: '2 / 3' }}>
            <img
              src={`https://image.tmdb.org/t/p/${config.highResPosterWidth}${data.info.profile_path}`}
              alt=''
              style={{ aspectRatio: '2 / 3' }}
              className='no-drag select-none overflow-hidden relative w-full'
            />
          </div>
        </div>
        <div className='w-full' style={{ maxWidth: '480px' }}>
          <h2 className='text-4xl leading-none font-bold'>{data.info.name}</h2>
          <p className='text-primary-300 mt-4 text-justify'>{truncate(data.info.biography!, 690)}</p>
          <div className='w-full grid grid-cols-2 auto-rows-auto mt-5 gap-5'>
            <Item name={t('person.known_for')} value={data.info.known_for_department!} />
            <ItemLink name='TMDB ID' value={data.info.id?.toString()!} href={`https://www.themoviedb.org/person/${data.info.id}`} />
            <Item name={t('person.appearances')} value={`${length} (${data.items.length.toString()})`} />
            <ItemLink name='IMDb ID' value={data.info.imdb_id!} href={`https://www.imdb.com/name/${data.info.imdb_id}`} />
            <Item name={t('person.birthday')} value={moment(data.info.birthday).format('l')} />
            {data.info.deathday ? (
              <Item name={t('person.deathday')} value={moment(data.info.deathday).format('l')} />
            ) : (
              <Item name={t('person.age')} value={`${moment().diff(data.info.birthday, 'years', false)} ${t('details.yo')}`} />
            )}
          </div>
        </div>
      </div>
      <div className='pt-80'>
        <AsyncCarousel
          func={async () => {
            const items = await basicFetch(`/api/person/${data.info.id}/known_for?${QueryString.stringify({ locale })}`);
            setLength(items?.length);
            return {
              items: items.slice(0, 20),
              key: null,
              length: 20,
              query: {},
              tmdb: true,
            };
          }}
        />
      </div>
    </Fragment>
  );
};

export default Person;
