import Link from 'next/link';
import config from '@data/config.json';
import { FilmlistProductionCompany } from '@Types/items';

const ProductionCompanyCard = ({ id, logo_path, backdrop_path }: FilmlistProductionCompany) => {
  return (
    <Link href={`/company/${id}`} key={id}>
      <a
        className='block cursor-pointer w-full relative overflow-hidden rounded-10 aspect-video my-2'
        style={{
          width: config.pCCardWidth,
          boxShadow: '0px 4px 9px rgba(0, 0, 0, 0.2)',
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
          className='w-full absolute inset-0'
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)',
            filter: 'drop-shadow(0px 7.5px 8.4px rgba(0, 0, 0, 0.25))',
          }}
        >
          <div className='aspect-video w-full flex justify-center items-center'>
            <div className='max-h-full py-4 px-8' style={{ filter: 'grayscale(1) invert(1) brightness(2)' }}>
              <img className='max-h-80 w-full no-drag select-none' src={`https://www.themoviedb.org/t/p/w500${logo_path}`} alt={`${id}`} />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ProductionCompanyCard;
