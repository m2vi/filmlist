import { FilmlistGenre } from '@Types/filmlist';
import Link from 'next/link';
import config from '@data/config.json';
import { useTranslation } from 'next-i18next';

const GenreCard = ({ id, name, items, backdrop_path }: FilmlistGenre) => {
  const { t } = useTranslation();

  return (
    <Link href={`/genre/${id}`} key={id}>
      <a
        className='block cursor-pointer w-full relative overflow-hidden rounded-15 aspect-video border border-primary-800'
        style={{
          width: config.pCCardWidth,
        }}
      >
        <div
          className='absolute aspect-video w-full'
          style={{
            backgroundImage: `url(https://www.themoviedb.org/t/p/w500${backdrop_path})`,
            backgroundSize: config.pCCardWidth,
          }}
        ></div>

        <div className='w-full absolute inset-0 gradient-default'>
          <div className='bg-primary-900-20 aspect-video w-full flex justify-center items-center'>
            <div className='max-h-full py-4 px-8'>
              <span className='text-primary-100 text-center font-bold text-3xl'>{t(`pages.filmlist.menu.${name}`).toString()}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default GenreCard;
