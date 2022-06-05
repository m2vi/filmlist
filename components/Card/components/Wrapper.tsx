import Link from 'next/link';
import { ReactNode } from 'react';
import config from '@data/config.json';

const Wrapper = ({
  children,
  type,
  isLoading,
  id_db,
  user_rating,
}: {
  children: ReactNode;
  type: number;
  isLoading: boolean;
  id_db: number;
  user_rating: number | null | undefined;
}) => {
  return (
    <Link href={`/${type ? 'movie' : 'tv'}/[id]`} as={`/${type ? 'movie' : 'tv'}/${id_db}`}>
      {isLoading ? (
        <div className='w-full grid place-items-center relative loading-animation rounded-8 overflow-hidden mt-1'>
          <div style={{ aspectRatio: '2 / 3', width: '100%' }} className='no-drag select-none w-full overflow-hidden relative'></div>
        </div>
      ) : (
        <a
          className={`flex flex-col flex-1 cursor-pointer relative overlay mb-2 rounded-10 mt-1 ${
            (user_rating ? user_rating : 10) <= 5 ? 'grayscale' : ''
          } transform hover:-translate-y-1 transition-all duration-150`}
          style={{
            width: config.cardWidth,
            border: '0.4px solid hsla(0, 0%, 13.5%, 0.2)',
            boxShadow: '0px 8.25px 9px rgba(0, 0, 0, 0.25)',
          }}
        >
          {children}
        </a>
      )}
    </Link>
  );
};

export default Wrapper;
