import { FilmlistProductionCompany } from '@Types/filmlist';
import Link from 'next/link';
import config from '@data/config.json';

const ProductionCompanyCard = ({ id, logo_path, backdrop_path }: FilmlistProductionCompany) => {
  return (
    <Link href={`/company/${id}`} key={id}>
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
          <div className='backdrop-blur-sm bg-primary-900-20 aspect-video w-full flex justify-center items-center'>
            <div className='max-h-full py-4 px-8' style={{ filter: 'grayscale(1) invert(1)' }}>
              <img className='max-h-80 w-full no-drag select-none' src={`https://www.themoviedb.org/t/p/w500${logo_path}`} alt={`${id}`} />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ProductionCompanyCard;
