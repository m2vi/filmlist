import { FrontendItemProps } from '@Types/items';
import ReleaseDate from './components/ReleaseDate';
import Poster from './components/Poster';
import Title from './components/Title';
import Wrapper from './components/Wrapper';

export interface CardProps extends FrontendItemProps {
  isLoading?: boolean;
}

const Card = ({ name, poster_path, release_date, id_db, ratings, type, isLoading = false, details }: CardProps) => {
  return (
    <Wrapper id_db={id_db} isLoading={isLoading} type={type} user_rating={null}>
      <Poster poster_path={poster_path} />

      <div className='absolute w-full h-full top-0 left-0 z-10 overlay-child flex items-end justify-start px-2'>
        <div className='w-full pb-2'>
          <Title name={name} />
          <span className='flex items-center justify-start'>
            <ReleaseDate release_date={release_date} />
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default Card;
