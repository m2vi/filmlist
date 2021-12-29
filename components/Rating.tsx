import { FrontendItemProps } from '@utils/types';
import { StarIcon } from '@heroicons/react/outline';

interface RatingProps extends Partial<FrontendItemProps> {
  notchild?: boolean;
}

const Rating = ({ vote_average, notchild }: RatingProps) => {
  const nr = !vote_average;

  return (
    <div
      className={`${
        !notchild ? 'absolute top-1 left-1 z-20' : ''
      } p-1 w-auto flex items-center justify-center bg-black bg-opacity-80 rounded-5 ${nr ? 'opacity-60' : ''}`}
    >
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
  );
};

export default Rating;
