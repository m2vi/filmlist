import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PersonCredits } from '@Types/filmlist';
import PersonCard from '@components/Card/person';

const PersonCarousel = ({ items }: { items: PersonCredits[] }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-8 h-auto'>
      <Link as={`/person`} href='/person'>
        <a className='text-3xl leading-relaxed font-bold hover:text-primary-200'>{t(`pages.filmlist.menu.popular_persons`).toString()}</a>
      </Link>

      <Swiper spaceBetween={20} slidesPerView={8} className='mt-2'>
        {(items ? items : []).map((item, index) => {
          return (
            <SwiperSlide key={index} style={{ width: '120px' }}>
              <PersonCard {...item} key={index} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default PersonCarousel;
