import { Video } from 'moviedb-promise/dist/request-types';
import Plyr from 'plyr-react';

const Trailer = ({ trailers }: { trailers: Video[] | null }) => {
  return (
    <div className='w-full max-w-screen-lg'>
      <Plyr
        source={{
          type: 'video',
          sources: [{ src: `https://www.youtube.com/watch?v=${trailers?.[0]?.key}`, provider: 'youtube' }],
        }}
        options={{
          autoplay: true,
          settings: [],
        }}
      />
    </div>
  );
};

export default Trailer;
