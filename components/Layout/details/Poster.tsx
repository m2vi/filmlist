import config from '@data/config.json';

const Poster = ({ data }: { data: any }) => {
  return (
    <a
      href={`https://image.tmdb.org/t/p/original${data?.frontend?.poster_path}`}
      rel='noreferrer nooper'
      target='_blank'
      className='w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden overlay'
      style={{ aspectRatio: '2 / 3' }}
    >
      <img
        src={`https://image.tmdb.org/t/p/${config.highResPosterWidth}${data?.frontend?.poster_path}`}
        alt=''
        style={{ aspectRatio: '2 / 3' }}
        className='no-drag select-none overflow-hidden relative w-full'
      />
    </a>
  );
};

export default Poster;
