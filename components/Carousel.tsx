import { BrowseSectionProps } from '@utils/types';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from './Card';

const Carousel = ({ section: { items, length, name, route } }: { section: BrowseSectionProps }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-6 h-auto'>
      {route ? (
        <Link href={route} passHref={true}>
          <a className='carousel-title hover:text-primary-200'>{t(`pages.filmlist.menu.${name.toLowerCase()}`)}</a>
        </Link>
      ) : (
        <span className='carousel-title '>{t(`pages.filmlist.menu.${name.toLowerCase()}`)}</span>
      )}

      <Swiper
        spaceBetween={20}
        slidesPerView={2}
        lazy={true}
        className='mt-1'
        breakpoints={{
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
        {items.map((props, index) => {
          return (
            <SwiperSlide key={index} style={{ width: '150px' }}>
              <Card {...props} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Carousel;
