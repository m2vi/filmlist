import Full from '@components/Full';
import api from '@utils/backend/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import config from '@data/config.json';
import Rating from '@components/Rating';
import { useEffect } from 'react';

const Details = ({ data }: any) => {
  const { _id, poster_path } = data.frontend;
  useEffect(() => console.log(data));

  return (
    <Full className='pt-10 flex justify-center'>
      <main className='w-full overflow-y-scroll dD5d-item max-w-screen-2xl px-11 pt-11' style={{ overflowX: 'hidden' }}>
        <div className='w-full grid grid-cols-2'>
          <div className='flex flex-col cursor-pointer relative mb-2' style={{ width: '350px' }}>
            <div className='h-full w-full flex mr-11 relative bg-primary-800 rounded-0 overflow-hidden'>
              <img
                src={`https://image.tmdb.org/t/p/w${config.highResPosterWidth}${poster_path}`}
                alt={_id ? _id : ''}
                style={{ aspectRatio: '2 / 3', width: '100%' }}
                className='no-drag select-none w-full overflow-hidden relative'
              />
            </div>
          </div>
          <div className='flex flex-col text-left'>
            <h2>{data.frontend.name}</h2>
            <Rating vote_average={data.frontend.vote_average} />
          </div>
        </div>
      </main>
    </Full>
  );
};

Details.layout = true;

export default Details;

export const getServerSideProps: GetServerSideProps = async ({ locale, query }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'footer'])),
      data: await api.details(query.objectId, locale),
    },
  };
};
