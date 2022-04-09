import { PersonCredits } from '@Types/filmlist';
import Link from 'next/link';

const PersonCard = ({ id, name, profile_path, loading = false }: PersonCredits) => {
  const data = loading ? { id: 0, profile_path: null, name: '-' } : { id, profile_path, name };

  return (
    <Link href={`/person/${data.id}`}>
      <a className='block cursor-pointer aspect-square w-full'>
        <div className='aspect-square w-full p-3'>
          <div className='bg-primary-800 rounded aspect-square w-full flex justify-center items-center'>
            {data.profile_path ? (
              <img
                className='w-full rounded'
                src={`https://www.themoviedb.org/t/p/w470_and_h470_face${data.profile_path}`}
                alt={`${data.id}`}
              />
            ) : (
              <span className='text-xs leading-none text-center w-full'>...</span>
            )}
          </div>
        </div>

        <div className='py-2 pt-0'>
          <p className='w-full text-md text-center whitespace-nowrap overflow-hidden text-ellipsis'>{data.name}</p>
        </div>
      </a>
    </Link>
  );
};

export default PersonCard;
