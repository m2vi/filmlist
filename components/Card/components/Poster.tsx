import config from '@data/config.json';

const Poster = ({ poster_path }: { poster_path: string | undefined | null }) => {
  return (
    <div className='w-full grid place-items-center relative bg-primary-800 rounded-8 overflow-hidden'>
      {poster_path ? (
        <>
          <img
            style={{ aspectRatio: '2 / 3', width: '100%' }}
            src={`https://image.tmdb.org/t/p/w${config.posterWidth}${poster_path}`}
            alt='TMDB-Poster'
            className='no-drag select-none w-full overflow-hidden relative card-image'
          />
        </>
      ) : (
        <div style={{ aspectRatio: '2 / 3', width: '100%' }} className='no-drag select-none w-full overflow-hidden relative' />
      )}
    </div>
  );
};

export default Poster;
