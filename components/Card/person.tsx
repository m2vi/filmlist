import { PersonCredits } from '@Types/filmlist';
import Link from 'next/link';

const PersonCard = ({ id, name, profile_path }: PersonCredits) => {
  return (
    <Link href={`/person/${id}`} key={id}>
      <a className='block cursor-pointer aspect-square w-full'>
        <div className='aspect-square w-full p-3'>
          <div className='bg-primary-800 rounded aspect-square w-full flex justify-center items-center'>
            {profile_path ? (
              <img className='w-full rounded' src={`https://www.themoviedb.org/t/p/w470_and_h470_face${profile_path}`} alt={`${id}`} />
            ) : (
              <span className='text-xs leading-none text-center w-full'>Not found</span>
            )}
          </div>
        </div>

        <div className='py-2 pt-0'>
          <p className='w-full text-md text-center whitespace-nowrap overflow-hidden text-ellipsis'>{name}</p>
        </div>
      </a>
    </Link>
  );
};

export default PersonCard;
