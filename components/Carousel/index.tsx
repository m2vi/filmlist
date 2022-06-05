import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import config from '@data/config.json';
import { Fragment, useEffect, useState } from 'react';
import { GetTabResponse } from '@Types/items';
import userClient from '@clients/user.client';
import Card from '@components/Card';
import { breakpoints } from '@helper/carousel';

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

      <Swiper spaceBetween={20} slidesPerView={2} lazy={true} breakpoints={breakpoints}>
        {(Array.isArray(items) ? items : []).map((props, index) => {
          return (
            <SwiperSlide key={index} style={{ width: config.cardWidth }} className='py-2'>
              <Card {...props} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Carousel;
