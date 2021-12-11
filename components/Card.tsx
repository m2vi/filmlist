import { FrontendItemProps } from '@utils/types';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import config from '@data/config.json';

const Card = ({ _id, genre_ids, name, poster_path, release_date, id_db }: FrontendItemProps) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col flex-1 cursor-pointer relative overlay mb-2' style={{ width: '154px' }}>
      <div className='h-full w-full grid place-items-center relative bg-primary-800 rounded-0 overflow-hidden'>
        {poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w${config.posterWidth}${poster_path}`}
            alt={_id ? _id : ''}
            style={{ aspectRatio: '2 / 3', width: '100%' }}
            className='no-drag select-none w-full overflow-hidden relative'
          />
        ) : (
          <div style={{ aspectRatio: '2 / 3', width: '100%' }} className='no-drag select-none w-full overflow-hidden relative' />
        )}
      </div>
      <div className='absolute w-full h-full top-0 left-0 z-10 overlay-child flex items-end justify-start px-2'>
        <div className='w-full pb-2'>
          <p
            className='font-semibold text-base overflow-hidden overflow-ellipsis whitespace-nowrap'
            title={name.toString()}
            onClick={(e) => copy(id_db.toString())}
          >
            {t(`pages.filmlist.menu.${name}`, {
              defaultValue: name,
            })}
          </p>
          <span className='flex items-center justify-between'>
            <span
              className='font-normal opacity-80 text-base overflow-hidden overflow-ellipsis whitespace-nowrap'
              title={moment(release_date).format('YYYY-MM-DD')}
            >
              {moment(release_date).format('YYYY')}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
