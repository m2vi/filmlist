import { RatingCircle } from '@components/Rating/RatingCircle';
import { FrontendItemProps } from '@Types/items';

interface RatingProps extends Partial<FrontendItemProps> {}

const Rating = ({ ratings, user_rating }: RatingProps) => {
  return (
    <div className='grid grid-flow-col gap-3 cursor-pointer'>
      {user_rating ? (
        <RatingCircle provider={{ vote_average: user_rating, vote_count: 1 }} colorClassName='user' />
      ) : ratings?.imdb?.vote_count ? (
        <RatingCircle provider={ratings?.imdb} colorClassName='imdb' />
      ) : (
        <RatingCircle provider={ratings?.tmdb} colorClassName='tmdb' />
      )}
    </div>
  );
};

export default Rating;
