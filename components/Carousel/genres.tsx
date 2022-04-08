import { Swiper, SwiperSlide } from 'swiper/react';
import { FilmlistGenres } from '@Types/filmlist';
import GenreCard from '@components/Card/genres';

const GenresCarousel = ({ items }: { items: FilmlistGenres }) => {
  return (
    <div className='mb-8 h-auto'>
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
