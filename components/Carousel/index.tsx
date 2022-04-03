import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import config from '@data/config.json';
import Card from '@components/Card';
import { breakpoints } from './config';
import { GetTabResponse } from '@Types/filmlist';

const Carousel = ({ section: { items, key } }: { section: GetTabResponse }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-8 h-auto'>
      {key && (
        <Link as={`/${key}`} href='/[tab]'>
          <a className='text-3xl leading-relaxed font-bold hover:text-primary-200'>{t(`pages.filmlist.menu.${key}`)}</a>
        </Link>
      )}

      <Swiper spaceBetween={20} slidesPerView={2} className='mt-2' breakpoints={breakpoints}>
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
