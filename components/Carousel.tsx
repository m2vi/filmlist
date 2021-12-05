import { BrowseSectionProps } from '@utils/types';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from './Card';

const Carousel = ({ section: { items, length, name, route } }: { section: BrowseSectionProps }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-6 h-auto' style={{ width: 'calc(100vw - 120px)', maxWidth: 'calc(2220px - 120px)' }}>
      {route ? (
        <Link href={route} passHref={true}>
          <a className='carousel-title hover:text-primary-200'>{t(`pages.filmlist.menu.${name.toLowerCase()}`)}</a>
        </Link>
      ) : (
        <span className='carousel-title'>{t(`pages.filmlist.menu.${name.toLowerCase()}`)}</span>
      )}

      <Swiper
        spaceBetween={20}
        slidesPerView={2}
        lazy={true}
        className='mt-1'
        breakpoints={{
          2150: {
            slidesPerView: 13,
          },
          2000: {
            slidesPerView: 12,
          },
          1800: {
            slidesPerView: 11,
          },
          1700: {
            slidesPerView: 10,
          },
          1540: {
            slidesPerView: 9,
          },
          1370: {
            slidesPerView: 8,
          },
          1200: {
            slidesPerView: 7,
          },
          1040: {
            slidesPerView: 6,
          },
          900: {
            slidesPerView: 5,
          },
          725: {
            slidesPerView: 4,
          },
          580: {
            slidesPerView: 3,
          },
        }}
      >
        {items.map(({ _id, genre_ids, name, poster_path, release_date }, index) => {
          return (
            <SwiperSlide key={index} style={{ width: '150px' }}>
              <Card _id={_id} genre_ids={genre_ids} name={name} poster_path={poster_path} release_date={release_date} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Carousel;
