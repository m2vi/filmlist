import copy from 'copy-to-clipboard';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import config from '@data/config.json';
import Rating from './Rating';
import Link from 'next/link';
import _ from 'underscore';
import { FrontendItemProps } from '@Types/items';
import ReleaseDate from './components/ReleaseDate';
import SimilarityScore from './components/SimilarityScore';
import Poster from './components/Poster';
import Title from './components/Title';
import Wrapper from './components/Wrapper';

export interface CardProps extends FrontendItemProps {
  isLoading?: boolean;
}

const Card = ({ name, poster_path, release_date, id_db, ratings, type, isLoading = false, similarity_score, user_rating }: CardProps) => {
  return (
    <Wrapper id_db={id_db} isLoading={isLoading} type={type} user_rating={user_rating}>
      <Poster poster_path={poster_path} />
      <div className='absolute w-full h-full top-0 left-0 z-10 overlay-child flex items-end justify-start px-2'>
        <div className='w-full pb-2'>
          <Title name={name} />
          <span className='flex items-center justify-start'>
            <ReleaseDate release_date={release_date} />
            <SimilarityScore similarity_score={similarity_score} />
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default Card;
