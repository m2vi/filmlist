/* eslint-disable @next/next/no-img-element */

import { FrontendItemProps } from '@Types/items';
import moment from 'moment';

const Card = ({ poster_path, name, release_date, details }: FrontendItemProps) => {
  return (
    <a className='flex mb-4' style={{ width: '165px' }}>
      <div className='flex flex-col'>
        <div className='border border-primary-800 rounded-6 overflow-hidden '>
          <img
            src={`https://image.tmdb.org/t/p/w342${poster_path}`}
            alt=''
            className='rounded-6'
            style={{ width: '165px', aspectRatio: '2/3' }}
            title={details?.fileName}
          />
        </div>

        <div className='flex flex-col' style={{ width: '165px' }}>
          <span className='mb-1 mt-2 block whitespace-nowrap text-ellipsis overflow-hidden text-base font-medium' title={name!}>
            {name}
          </span>
          <span className='text-sm font-normal text-primary-300 flex items-center'>
            <span>{moment(release_date).format('YYYY')}</span>
            <span className='text-xs'>&nbsp;&#124;&nbsp;</span>
            <span> {details?.resolution_name}</span>
          </span>
        </div>
      </div>
    </a>
  );
};

export default Card;
