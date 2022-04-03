import copy from 'copy-to-clipboard';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import config from '@data/config.json';
import Rating from './Rating';
import Link from 'next/link';
import _ from 'underscore';
import { FrontendItemProps } from '@Types/items';

export interface CardProps extends FrontendItemProps {
  isLoading?: boolean;
}

const Card = ({ name, poster_path, release_date, id_db, ratings, type, isLoading = false, similarity_score, user_rating }: CardProps) => {
  const Wrapper = ({ children }: any) => (
    <Link href={`/${type ? 'movie' : 'tv'}/[id]`} as={`/${type ? 'movie' : 'tv'}/${id_db}`} prefetch={false}>
      <a className='flex flex-col flex-1 cursor-pointer relative overlay mb-2' style={{ width: config.cardWidth }}>
        {children}
      </a>
    </Link>
  );

  if (isLoading) {
    return (
      <Wrapper>
        <div className='w-full grid place-items-center relative loading-animation rounded-8 overflow-hidden'>
          <div style={{ aspectRatio: '2 / 3', width: '100%' }} className='no-drag select-none w-full overflow-hidden relative'></div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className='w-full grid place-items-center relative bg-primary-800 rounded-8 overflow-hidden'>
        {poster_path ? (
          <>
            <img
              style={{ aspectRatio: '2 / 3', width: '100%' }}
              src={`https://image.tmdb.org/t/p/w${config.posterWidth}${poster_path}`}
              alt='TMDB-Poster'
              className='no-drag select-none w-full overflow-hidden relative card-image'
            />
          </>
        ) : (
          <div style={{ aspectRatio: '2 / 3', width: '100%' }} className='no-drag select-none w-full overflow-hidden relative' />
        )}
      </div>
      <div className='absolute w-full h-full top-0 left-0 z-10 overlay-child flex items-end justify-start px-2'>
        <Rating ratings={ratings} user_rating={user_rating} />
        <div className='w-full pb-2'>
          <p
            className='font-semibold text-base overflow-hidden overflow-ellipsis whitespace-nowrap'
            title={name?.toString()}
            onClick={(e) => copy(id_db?.toString())}
          >
            {name}
          </p>
          <span className='flex items-center justify-start'>
            <span
              className='font-normal opacity-80 text-base overflow-hidden overflow-ellipsis whitespace-nowrap'
              title={moment(release_date).format('YYYY-MM-DD')}
            >
              {moment(release_date).format('YYYY')}
            </span>

            {similarity_score ? (
              <>
                <span className='mx-1 font-bold text-primary-200'>·</span>
                <div className='green font-semibold'>{(similarity_score * 100).toFixed(0)}%</div>
              </>
            ) : null}
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default Card;
