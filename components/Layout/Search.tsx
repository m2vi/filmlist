import Link from 'next/link';
import { IoSearch } from 'react-icons/io5';

const Search = () => {
  return (
    <Link href='/search'>
      <a className='font-normal text-sm h-full text-center items-center cursor-pointer'>
        <IoSearch className='h-4 w-4' />
      </a>
    </Link>
  );
};

export default Search;
