import { BrowseSectionProps, FrontendItemProps } from '@utils/types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from './Card';

const Carousel = ({ section: { items, length, name, route } }: { section: BrowseSectionProps }) => {
  const { t } = useTranslation();

  return (
    <div className='w-screen py-11'>
      <h3 className='mb-2'> {t(`pages.filmlist.menu.${name}`)}</h3>
      <Swiper spaceBetween={20} slidesPerView={10}>
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
