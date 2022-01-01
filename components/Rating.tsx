import { FrontendItemProps } from '@utils/types';
import { StarIcon } from '@heroicons/react/outline';
import { HTMLAttributes } from 'react';

interface RatingProps extends Partial<FrontendItemProps>, HTMLAttributes<HTMLDivElement> {
  notchild?: boolean;
}

const Rating = ({ vote_average, state, notchild, className, ...props }: RatingProps) => {
  const nr = !vote_average;

  return (
    <div className={`${!notchild ? 'absolute top-1 left-1 z-20' : 'w-10'} grid gap-1 grid-cols-2`} {...props}>
      <div className={`p-1 flex items-center justify-center bg-black bg-opacity-80 rounded-5 ${nr ? 'opacity-60' : ''} ${className}`}>
        <span className={`flex items-center l-1 ${nr ? 'text-primary-300' : 'text-amber-500'}`}>
          {nr ? (
            'NR'
          ) : (
            <>
              <StarIcon className='h-3 w-3 mr-1' />
              {vote_average?.toFixed(1)}
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default Rating;
