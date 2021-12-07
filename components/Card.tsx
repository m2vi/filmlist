import { FrontendItemProps } from '@utils/types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const Card = ({ _id, genre_ids, name, poster_path, release_date }: FrontendItemProps) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col flex-1 cursor-pointer relative overlay mb-2' style={{ width: '154px' }}>
      <div className='h-full w-full grid place-items-center relative bg-primary-800 rounded-0 overflow-hidden'>
        {poster_path ? (
          /* eslint-disable-next-line */
          <img
            src={`https://image.tmdb.org/t/p/w154${poster_path}`}
            alt={_id ? _id : ''}
            style={{ aspectRatio: '154 / 226', width: '100%' }}
            className='no-drag select-none w-full overflow-hidden relative'
          />
        ) : (
          <div style={{ aspectRatio: '154 / 226', width: '100%' }} className='no-drag select-none w-full overflow-hidden relative' />
        )}
      </div>
      <div className='absolute w-full h-full top-0 left-0 z-50 overlay-child flex items-end justify-start px-2'>
        <div className='w-full pb-2'>
          <p className='font-semibold text-base overflow-hidden overflow-ellipsis whitespace-nowrap' title={name.toString()}>
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
