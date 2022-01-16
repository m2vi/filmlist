import Full from '@components/Full';
import Rating from '@components/Rating';
import Title from '@components/Title';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import genres from '@utils/themoviedb/genres';
import Link from 'next/link';
import frontend from '@utils/frontend/api';
import { useRouter } from 'next/router';
import CarouselAsync from '../../CarouselAsync';
import { basicFetch } from '@utils/fetch';
import InfoBar from '../../InfoBar';
import { useEffect, useState } from 'react';
import momentDurationFormatSetup from 'moment-duration-format';
import Poster from './Poster';
import { IoPlay } from 'react-icons/io5';

momentDurationFormatSetup(moment as any);

const Details = ({ data }: any) => {
  const [showBar, setShowBar] = useState(false);
  const { t } = useTranslation();
  const locale = useRouter().locale!;

  useEffect(() => setShowBar(!data.raw.state), [data]);
  useEffect(() => console.log(data), [data]);

  const mainCrew = frontend.getMainCrew(data.raw);

  return (
    <Full className='pt-10 flex justify-center'>
      {showBar ? <InfoBar name={data.frontend.name} setState={setShowBar} /> : null}
      <Title title={`${data.frontend.name} – ${t(`pages.filmlist.default`)}`} />
      <main className='w-full max-w-screen-2xl px-120 py-11'>
        <div className='w-full grid grid-cols-2 gap-80 px-80'>
          <div className='flex flex-col cursor-pointer relative mb-2 w-full' style={{ maxWidth: '480px' }}>
            <Poster data={data} />
          </div>
          <div className='w-full' style={{ maxWidth: '480px' }}>
            {data?.subscribedProvider?.length > 0 ? (
              <a
                href={data?.subscribedProvider[0]?.url}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center text-3xl font-bold hover:text-accent cursor-pointer'
              >
                <span className='mr-2'>{data.frontend.name}</span> <IoPlay className='h-4 w-4' />
              </a>
            ) : (
              <span className='text-3xl font-bold'>{data.frontend.name}</span>
            )}

            <p className='text-primary-300 mt-5 text-justify'>{data.raw.overview[locale]}</p>
            <Rating
              className='mt-5'
              ratings={data.frontend.ratings}
              notchild={true}
              state={data.frontend.state}
              id_db={data.frontend.id_db}
              type={data.frontend.type}
            />
            <div className='w-full grid grid-cols-2 auto-rows-auto mt-5 gap-5'>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>{t('details.type.title')}</span>
                <span className='text-xl text-primary-200'>{t(`details.type.${data.raw.type ? 'movie' : 'tv show'}`)}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>TMDB ID</span>
                <a
                  href={`https://www.themoviedb.org/${data.raw.type ? 'movie' : 'tv'}/${data.raw.id_db}`}
                  className='text-xl text-primary-200 hover:text-accent'
                >
                  {data.raw.id_db}
                </a>
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>
                  {t(`details.${data.raw.type ? 'release_date' : 'first_air_date'}`)}
                </span>
                {data.raw.release_date ? (
                  <span className='text-xl text-primary-200' title={moment(data.raw.release_date).format('YYYY-MM-DD')}>
                    {moment(data.raw.release_date).locale(locale).format('L')}
                  </span>
                ) : (
                  <span className='text-xl text-primary-200'>-</span>
                )}
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>IMDb ID</span>
                <a
                  href={`https://www.imdb.com/title/${data.raw.external_ids.imdb_id}`}
                  className='text-xl text-primary-200 hover:text-accent'
                >
                  {data.raw.external_ids.imdb_id}
                </a>
              </div>

              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>
                  {t(`details.${data.raw.type ? 'runtime' : 'episode_run_time'}`)}
                </span>
                {data.raw.runtime ? (
                  <span className='text-xl text-primary-200' title={data.raw.runtime}>
                    {frontend.duration(data.raw.runtime, locale)}
                  </span>
                ) : (
                  <span className='text-xl text-primary-200'>-</span>
                )}
              </div>

              {data.raw.collection ? (
                <div className='flex flex-col'>
                  <span className='text-base text-primary-300 mb-1 l-1'>{t('details.collection')} ID</span>
                  <Link href='/collection/[id]' as={`/collection/${data.raw.collection.id}`} prefetch={false}>
                    <a className='text-xl text-primary-200 hover:text-accent'>{data.raw.collection.id}</a>
                  </Link>
                </div>
              ) : null}
              {mainCrew ? (
                <div className='flex flex-col'>
                  <span className='text-base text-primary-300 mb-1 l-1'>{mainCrew?.job}</span>
                  {mainCrew.crew.map(({ id, original_name }, i) => {
                    return (
                      <Link href='/person/[person]' as={`/person/${id}`} key={i} prefetch={false}>
                        <a className='text-xl text-primary-200 hover:text-accent'>{original_name}</a>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className='flex flex-col mt-5'>
              <span className='text-base text-primary-300 mb-1 l-1'>{t('details.genres')}</span>
              <span className='text-xl text-primary-200'>
                {data.raw.genre_ids.map((id: number, i: number) => {
                  return (
                    <span key={i}>
                      <Link href='/genre/[id]' as={`/genre/${id}`} prefetch={false}>
                        <a className='text-xl text-primary-200 hover:text-accent'>
                          {t(`pages.filmlist.menu.${genres.getName(id).toLowerCase()}`)}
                        </a>
                      </Link>

                      <span>{data.raw.genre_ids.length > i + 1 ? ', ' : ''}</span>
                    </span>
                  );
                })}
              </span>
            </div>
            <div className='flex flex-col mt-5'>
              <span className='text-base text-primary-300 mb-1 l-1'>{t('details.stars')}</span>
              <span className='text-xl text-primary-200'>
                {data.raw.credits.cast.slice(0, 3).map(({ id, original_name }: any, i: number) => {
                  return (
                    <span key={i}>
                      <Link href='/person/[person]' as={`/person/${id}`} prefetch={false}>
                        <a className='text-xl text-primary-200 hover:text-accent'>{original_name}</a>
                      </Link>

                      <span>{3 > i + 1 ? ', ' : ''}</span>
                    </span>
                  );
                })}
              </span>
            </div>

            {data?.subscribedProvider?.length > 0 ? (
              <div className='flex flex-col mt-5'>
                <span className='text-base text-primary-300 mb-1 l-1'>{t('details.subscribedProviders')}</span>
                <span className='text-xl text-primary-200'>
                  {data?.subscribedProvider?.map(({ name, url }: any, i: number) => {
                    return (
                      <span key={i}>
                        <a href={url} target='_blank' rel='noopener noreferrer' className='text-xl text-primary-200 hover:text-accent'>
                          {name}
                        </a>

                        <span>{data?.subscribedProvider?.length > i + 1 ? ', ' : ''}</span>
                      </span>
                    );
                  })}
                </span>
              </div>
            ) : (
              <div className='flex flex-col mt-5'>
                <span className='text-base text-primary-300 mb-1 l-1'>{t('details.providers')}</span>
                <span className='text-xl text-primary-200'>
                  {data?.importantProviders?.map(({ name, url }: any, i: number) => {
                    return (
                      <span key={i}>
                        <a
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-xl text-primary-200 hover:text-accent cursor-pointer'
                        >
                          {name}
                        </a>

                        <span>{data?.importantProviders?.length > i + 1 ? ', ' : ''}</span>
                      </span>
                    );
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className='pt-80'>
          <CarouselAsync
            func={async () => {
              const result = await basicFetch(
                `/api/manage/items/item/${data.raw.id_db}?locale=${locale}&isMovie=${Boolean(data.raw.type)}`
              );

              return result;
            }}
          />
        </div>
      </main>
    </Full>
  );
};

export default Details;
