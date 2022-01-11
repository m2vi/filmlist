import Full from '@components/Full';
import config from '@data/config.json';
import Rating from '@components/Rating';
import Title from '@components/Title';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import Carousel from '@components/Carousel';
import Link from 'next/link';
import genres from '@utils/themoviedb/genres';

const Collection = ({ data }: any) => {
  const { t } = useTranslation();

  useEffect(() => console.log(data));
  useEffect(() => console.log(data), [data]);

  return (
    <Full className='pt-10 flex justify-center'>
      <Title title={`${data.name} – ${t(`pages.filmlist.default`)}`} />
      <main className='w-full max-w-screen-2xl px-120 py-11'>
        <div className='w-full grid grid-cols-2 gap-80 px-80'>
          <div className='flex flex-col cursor-pointer relative mb-2 w-full' style={{ maxWidth: '480px' }}>
            <div className='w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden' style={{ aspectRatio: '2 / 3' }}>
              <img
                src={`https://image.tmdb.org/t/p/${config.highResPosterWidth}${data.poster_path}`}
                alt={data.id}
                style={{ aspectRatio: '2 / 3' }}
                className='no-drag select-none overflow-hidden relative w-full'
              />
            </div>
          </div>
          <div className='w-full' style={{ maxWidth: '480px' }}>
            <h2>{data.name}</h2>
            <p className='text-primary-300 mt-5 text-justify'>{data.overview}</p>
            <Rating
              className='mt-5'
              ratings={{
                imdb: {
                  vote_average: null,
                  vote_count: null,
                },
                rotten_tomatoes: {
                  vote_average: null,
                  vote_count: null,
                },
                tmdb: {
                  vote_average: data.vote_average,
                  vote_count: null,
                },
              }}
              notchild={true}
            />
            <div className='w-full grid grid-cols-2 auto-rows-auto mt-5 gap-5'>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>{t('collection.count')}</span>
                <span className='text-xl text-primary-200'>{data.tmdb_count}</span>
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>TMDB ID</span>
                <a href={`https://www.themoviedb.org/collection/${data.id}`} className='text-xl text-primary-200 hover:text-accent'>
                  {data.id}
                </a>
              </div>
              <div className='flex flex-col'>
                <span className='text-base text-primary-300 mb-1 l-1'>{t('collection.local_count')}</span>
                <span className='text-xl text-primary-200'>{data.local_count}</span>
              </div>
            </div>
            <div className='flex flex-col mt-5'>
              <span className='text-base text-primary-300 mb-1 l-1'>{t('collection.genres')}</span>
              <span className='text-xl text-primary-200'>
                {data.genre_ids.map((id: number, i: number) => {
                  return (
                    <span key={i}>
                      <Link href='/genre/[id]' as={`/genre/${id}`}>
                        <a className='text-xl text-primary-200 hover:text-accent'>
                          {t(`pages.filmlist.menu.${genres.getName(id).toLowerCase()}`)}
                        </a>
                      </Link>

                      <span>{data.genre_ids.length > i + 1 ? ', ' : ''}</span>
                    </span>
                  );
                })}
              </span>
            </div>
          </div>
        </div>
        <div className='pt-80'>
          <Carousel section={{ name: null, items: data.items, length: data.items.length, route: null }} />
        </div>
      </main>
    </Full>
  );
};

export default Collection;
