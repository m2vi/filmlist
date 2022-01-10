import { FrontendItemProps, VoteProps } from '@utils/types';
import { HTMLAttributes } from 'react';

interface RatingProps extends Partial<FrontendItemProps>, HTMLAttributes<HTMLDivElement> {
  notchild?: boolean;
}

const Rating = ({ ratings, state, notchild, className, ...props }: RatingProps) => {
  return (
    <div className={`${!notchild ? 'absolute top-2 right-2 z-20' : 'w-10'} grid grid-flow-col gap-4 ${className}`} {...props}>
      <RatingCircle provider={ratings?.tmdb} colorClassName='tmdb' />
      {/*  <RatingCircle provider={ratings?.imdb} colorClassName='imdb' />
      <RatingCircle provider={ratings?.rotten_tomatoes} colorClassName='rotten'/> */}
    </div>
  );
};

export default Rating;

export interface RatingCircleProps {
  provider: VoteProps | null | undefined;
  colorClassName: string;
}

export const RatingCircle = ({ provider, colorClassName }: RatingCircleProps) => {
  const nr = !provider || !provider?.vote_average;

  return (
    <div className='flex justify-center items-center h-36 w-36 relative'>
      <span className='text-xs font-medium text-button l-1'>{nr ? 'NR' : provider?.vote_average?.toFixed(1)}</span>
      <svg x='0px' y='0px' width='36px' height='36px' viewBox='0 0 36 36' className='absolute -inset-2px h-8 w-8'>
        <circle
          fill='none'
          className={`${nr ? 'stroke-primary-500' : colorClassName} transform origin-center -rotate-90`}
          strokeWidth='3'
          cx='18'
          cy='18'
          r='16'
          strokeDasharray={`${nr ? '100' : provider?.vote_average! * 10} 100`}
          strokeDashoffset='0'
          strokeLinecap='round'
          transform='rotate(-90 18 18)'
        ></circle>
      </svg>
    </div>
  );
};
