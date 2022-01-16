import config from '@data/config.json';
import { IoPlay } from 'react-icons/io5';

const Poster = ({ data }: { data: any }) => {
  return (
    <div className='w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden overlay' style={{ aspectRatio: '2 / 3' }}>
      <img
        src={`https://image.tmdb.org/t/p/${config.highResPosterWidth}${data?.frontend?.poster_path}`}
        alt=''
        style={{ aspectRatio: '2 / 3' }}
        className='no-drag select-none overflow-hidden relative w-full'
      />
      <div className='h-full w-full absolute inset-0 grid place-items-center overlay-child transform hover:scale-150'>
        <IoPlay className='h-11 w-11' />
      </div>
    </div>
  );
};

export default Poster;
