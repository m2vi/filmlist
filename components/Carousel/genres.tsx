import { Swiper, SwiperSlide } from 'swiper/react';
import { FilmlistGenres } from '@Types/filmlist';
import GenreCard from '@components/Card/genre';
import { useTranslation } from 'next-i18next';

const GenresCarousel = ({ items, title }: { items: FilmlistGenres; title: boolean }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-8 h-auto'>
      {title ? <span className='text-3xl leading-relaxed font-bold'>{t(`details.genres`).toString()}</span> : null}

      <Swiper spaceBetween={20} slidesPerView={4} className='mt-2'>
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
