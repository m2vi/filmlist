import { SearchIcon } from '@heroicons/react/outline';
import { useQuery } from 'context/useQuery';
import { ChangeEvent } from 'react';

const Search = () => {
  const { update, query } = useQuery();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => update(e.target.value);

  return (
    <div className='flex w-full py-2 px-4 rounded-8 h-full overflow-hidden bg-primary-800 text-base shadow-lg'>
      <div className='h-full aspect-square flex justify-center items-center mr-2'>
        <SearchIcon className='w-3 h-3 text-primary-200' />
      </div>
      <input type='text' placeholder='Suche' className='bg-transparent w-full leading-none' onInput={handleChange} />
    </div>
  );
};

export default Search;
