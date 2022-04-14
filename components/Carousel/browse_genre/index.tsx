import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import config from '@data/config.json';
import Card from '@components/Card';
import { breakpoints } from '../config';
import { GetTabResponse } from '@Types/filmlist';
import { Fragment } from 'react';
import genres from '@utils/apis/genres';

const BrowseGenreCarousel = ({ section: { items, key } }: { section: GetTabResponse }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-8 h-auto'>
      {key && (
        <Fragment>
          <Link as={`/genre/${genres.getID(key)}`} href='/genre/[id]'>
            <a className='text-3xl leading-relaxed font-bold hover:text-primary-200'>{t(`pages.filmlist.menu.${key}`).toString()}</a>
          </Link>
        </Fragment>
      )}

      <Swiper spaceBetween={20} slidesPerView={2} className='mt-2' breakpoints={breakpoints}>
        {(items ? items : []).map((props, index) => {
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

export default BrowseGenreCarousel;
