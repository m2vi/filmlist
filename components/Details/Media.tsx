import { useTranslation } from 'next-i18next';
import { Fragment, useEffect } from 'react';
import Head from 'next/head';
import Item from './components/Item';
import GenreIds from './components/GenreIds';
import { durationFormat } from '@utils/apis/filmlist/helper';
import { useRouter } from 'next/router';
import { ItemProps } from '@Types/items';
import userClient from '@utils/user/client';
import TrailerModal from './components/TrailerModal';
import Rating from '@components/Card/Rating';
import Carousel from './components/Carousel';
import Ratings from './components/Ratings';

const Media = ({ data }: { data: ItemProps }) => {
  const { t } = useTranslation();
  const locale = useRouter().locale!;

  useEffect(() => console.log(data), [data]);
  return (
    <Fragment>
      <Head>
        <title>{`${data.name?.[locale]} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      <div className='w-full grid grid-cols-2 gap-80 px-80'>
        <div className='flex flex-col relative mb-2 w-full' style={{ maxWidth: '480px' }}>
          <div className='w-full flex mr-11 relative bg-primary-800 rounded-15 overflow-hidden' style={{ aspectRatio: '2 / 3' }}>
            <TrailerModal data={data} />
          </div>
        </div>
        <div className='w-full' style={{ maxWidth: '480px' }}>
          <h2 className='text-4xl leading-none font-bold'>{data.name?.[locale]}</h2>
          <p className='text-primary-300 mt-4 text-justify mb-5'>{data.overview?.[locale]}</p>

          <Ratings data={data} />

          <div className='w-full grid grid-cols-2 auto-rows-auto mt-5 gap-5'>
            <Item name={t('details.runtime')} value={data.runtime ? durationFormat(data.runtime, locale!) : '-'} />
          </div>
          <GenreIds ids={data.genre_ids} />
        </div>
      </div>

      {/*       <div className='px-80 py-8'>
        <Swiper spaceBetween={20} slidesPerView={8}>
          {data.credits?.cast.map((item, index) => {
            return (
              <SwiperSlide key={index} style={{ width: '120px' }}>
                <PersonCard id={item.id} name={item.name} popularity={item.popularity} profile_path={item.profile_path!} key={index} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div> */}

      <div className='pt-80'>
        <Carousel id={data.id_db} type={data.type} locale={locale} user={userClient} />
      </div>
    </Fragment>
  );
};

export default Media;
