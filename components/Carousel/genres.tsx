import { Swiper, SwiperSlide } from 'swiper/react';

import { useTranslation } from 'next-i18next';
import { FilmlistGenres } from '@Types/items';
import GenreCard from '@components/Card/genre';

const GenresCarousel = ({ items, title }: { items: FilmlistGenres; title: boolean }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-4 h-auto'>
      {title ? <span className='text-3xl leading-relaxed font-bold'>{t(`details.genres`).toString()}</span> : null}

      <Swiper spaceBetween={20} slidesPerView={4}>
        {(items ? items : []).map((props, index) => {
          if ([10759].includes(props?.id)) return null;
          return (
            <SwiperSlide key={index}>
              <GenreCard {...props} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default GenresCarousel;
