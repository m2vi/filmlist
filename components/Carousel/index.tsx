import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import config from '@data/config.json';
import Card from '@components/Card';
import { breakpoints } from './config';
import { GetTabResponse } from '@Types/filmlist';
import { Fragment, useEffect, useState } from 'react';
import userClient from '@utils/user/client';

const Carousel = ({ section: { items, key, tmdb } }: { section: GetTabResponse }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  useEffect(() => setName(userClient.getUser()?.username!), []);

  return (
    <div className='mb-8 h-auto'>
      {key && (
        <Fragment>
          {!tmdb ? (
            <Link as={`/${key}`} href='/[tab]'>
              <a className='text-3xl leading-relaxed font-bold hover:text-primary-200'>
                {t(`pages.filmlist.menu.${key}`, { replace: { name } }).toString()}
              </a>
            </Link>
          ) : (
            <span className='text-3xl leading-relaxed font-bold hover:text-primary-200'>
              {t(`pages.filmlist.menu.${key}`, { replace: { name } }).toString()}
            </span>
          )}
        </Fragment>
      )}

      <Swiper spaceBetween={20} slidesPerView={2} className='mt-2' lazy={true} breakpoints={breakpoints}>
        {(Array.isArray(items) ? items : []).map((props, index) => {
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
