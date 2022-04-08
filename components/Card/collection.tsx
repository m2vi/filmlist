import { CollectionProps } from '@Types/filmlist';
import Link from 'next/link';

const CollectionCard = ({ id, name, poster_path }: CollectionProps) => {
  if (!poster_path) return null;
  return (
    <Link href={`/collection/${id}`} key={id}>
      <a className='block cursor-pointer w-full'>
        <div className='aspect-square w-full mb-4'>
          <div className='bg-primary-800 rounded-15 aspect-square w-full flex justify-center items-center'>
            {poster_path ? (
              <img className='w-full rounded-15' src={`https://www.themoviedb.org/t/p/w470_and_h470_face${poster_path}`} alt={`${id}`} />
            ) : (
              <span className='text-xs leading-none text-center w-full'>Not found</span>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default CollectionCard;
