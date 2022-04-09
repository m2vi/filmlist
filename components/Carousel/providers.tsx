import { useTranslation } from 'next-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProviderProps } from '@Types/filmlist';
import ProviderCard from '@components/Card/provider';

const ProvidersCarousel = ({ items, title }: { items: ProviderProps[]; title: boolean }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-8 h-auto'>
      {title ? <span className='text-3xl leading-relaxed font-bold'>{t(`details.providers`).toString()}</span> : null}

      <Swiper spaceBetween={20} slidesPerView={4} className='mt-2'>
        {(items ? items : []).map((props, index) => {
          return (
            <SwiperSlide key={index}>
              <ProviderCard {...props} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ProvidersCarousel;
