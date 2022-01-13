import { BrowseSectionProps } from '@utils/types';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from './Card';
import config from '@data/config.json';

const Carousel = ({ section: { items, length, name, route } }: { section: BrowseSectionProps }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-6 h-auto'>
      {name ? (
        <>
          {route ? (
            <Link as={route} href={'/[tab]'}>
              <a className='carousel-title hover:text-primary-200'>
                {t(`pages.filmlist.menu.${name.toLowerCase()}`, { defaultValue: name })}
              </a>
            </Link>
          ) : (
            <span className='carousel-title '>{t(`pages.filmlist.menu.${name.toLowerCase()}`)}</span>
          )}
        </>
      ) : null}

      <Swiper
        spaceBetween={20}
        slidesPerView={2}
        lazy={true}
        className='mt-1'
        breakpoints={{
          1440: {
            slidesPerView: 7,
          },
          1290: {
            slidesPerView: 6,
          },
          1100: {
            slidesPerView: 5,
          },
          920: {
            slidesPerView: 4,
          },
          750: {
            slidesPerView: 3,
          },
          580: {
            slidesPerView: 2,
          },
        }}
      >
        {items.map((props, index) => {
          return (
            <SwiperSlide key={index} style={{ width: config.cardWidth }}>
              <Card {...props} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Carousel;
