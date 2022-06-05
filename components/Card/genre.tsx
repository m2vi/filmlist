import Link from 'next/link';
import config from '@data/config.json';
import { useTranslation } from 'next-i18next';
import { FilmlistGenre } from '@Types/items';

const GenreCard = ({ id, name, backdrop_path }: FilmlistGenre) => {
  const { t } = useTranslation();

  return (
    <Link href={`/genre/${id}`} key={id}>
      <a
        className='block cursor-pointer w-full relative overflow-hidden rounded-10 aspect-video'
        style={{
          width: config.pCCardWidth,
          boxShadow: '0px 8.25px 9px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div
          className='absolute aspect-video w-full'
          style={{
            backgroundImage: `url(https://www.themoviedb.org/t/p/w500${backdrop_path})`,
            backgroundSize: config.pCCardWidth,
          }}
        ></div>

        <div
          className='w-full absolute inset-0 gradient-default'
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)',
            filter: 'drop-shadow(0px 7.5px 8.4px rgba(0, 0, 0, 0.25))',
          }}
        >
          <div className='aspect-video w-full flex justify-center items-center'>
            <div className='max-h-full py-4 px-8 select-none'>
              <span className='text-primary-100 text-center font-bold text-3xl'>{t(`pages.filmlist.menu.${name}`).toString()}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default GenreCard;
