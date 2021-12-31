import Full from '@components/Full';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import config from '@data/config.json';
import Title from '@components/Title';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { useRouter } from 'next/router';
import client from '@utils/themoviedb/api';
import { truncate } from '@utils/utils';
import { useEffect, useState } from 'react';
import CarouselAsync from '@components/CarouselAsync';
import { basicFetch } from '@utils/fetch';

const Person = ({ data }: any) => {
  const { t } = useTranslation();
  const locale = useRouter().locale!;
  const [appearances, setAppearances] = useState('-');
  useEffect(() => console.log(data.info));

  return (
    <Full className='pt-10 flex justify-center'>
      <Title title={`${data.info.name} – ${t(`pages.filmlist.default`)}`} />
      <main className='w-full max-w-screen-2xl px-120 py-11'>
        <div className='w-full grid grid-cols-2 gap-80 px-80'>
          <div className='flex flex-col relative mb-2 w-full' style={{ maxWidth: '480px' }}>
            <div className='h-full w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden' style={{ aspectRatio: '2 / 3' }}>
              <img
                src={`https://image.tmdb.org/t/p/w${config.highResPosterWidth}${data.info.profile_path}`}
                alt=''
                style={{ aspectRatio: '2 / 3' }}
                className='no-drag select-none overflow-hidden relative w-full'
              />
            </div>
          </div>
          <div className='w-full' style={{ maxWidth: '480px' }}>
            <h2>{data.info.name}</h2>
            <p className='text-primary-300 mt-5 text-justify'>{truncate(data.info.biography, 690)}</p>
            <div className='w-full grid grid-cols-2 auto-rows-auto mt-5 gap-5'>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>Known for</span>
                <span className='text-xl text-primary-200'>{data.info.known_for_department}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>TMDB ID</span>
                <a href={`https://www.themoviedb.org/person/${data.info.id}`} className='text-xl text-primary-200 hover:text-accent'>
                  {data.info.id}
                </a>
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>Appearances</span>
                <span className='text-xl text-primary-200'>{appearances}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>IMDb ID</span>
                <a href={`https://www.imdb.com/name/${data.info.imdb_id}`} className='text-xl text-primary-200 hover:text-accent'>
                  {data.info.imdb_id}
                </a>
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>Birthday</span>
                <span className='text-xl text-primary-200'>{moment(data.info.birthday).format('l')}</span>
              </div>
              {data.info.deathday ? (
                <div className='flex flex-col'>
                  <span className='text-base text-primary-300 mb-1 l-1'>Deathday</span>
                  <span className='text-xl text-primary-200'>{moment(data.info.deathday).format('l')}</span>
                </div>
              ) : (
                <div className='flex flex-col'>
                  <span className='text-base text-primary-300 mb-1 l-1'>Age</span>
                  <span className='text-xl text-primary-200'>{moment().diff(data.info.birthday, 'years', false)} years old</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='pt-80'>
          <CarouselAsync
            func={async () => {
              const result = (await basicFetch(`/api/manage/items/person/${data.info.id}?locale=${locale}`)).tab;
              setAppearances(result.length);
              return result.items;
            }}
          />
        </div>
      </main>
    </Full>
  );
};

Person.layout = true;

export default Person;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  const data = await client.getPerson(parseInt(query.person), locale);

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data,
    },
  };
};
