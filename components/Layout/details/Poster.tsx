import config from '@data/config.json';

const Poster = ({ data }: { data: any }) => {
  return (
    <div className='w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden' style={{ aspectRatio: '2 / 3' }}>
      <img
        src={`https://image.tmdb.org/t/p/${config.highResPosterWidth}${data?.frontend?.poster_path}`}
        alt=''
        style={{ aspectRatio: '2 / 3' }}
        className='no-drag select-none overflow-hidden relative w-full'
      />
    </div>
  );
};

export default Poster;
