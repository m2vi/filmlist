import ProductionCompanyCard from '@components/Card/production_company';
import { FilmlistProductionCompany } from '@Types/items';
import { useTranslation } from 'next-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';

const PCCarousel = ({ items, title }: { items: FilmlistProductionCompany[]; title: boolean }) => {
  const { t } = useTranslation();

  return (
    <div className='mb-4 h-auto'>
      {title ? <span className='text-3xl leading-relaxed font-bold'>{t(`company.default`).toString()}</span> : null}

      <Swiper spaceBetween={20} slidesPerView={4}>
        {(items ? items : []).map((props, index) => {
          return (
            <SwiperSlide key={index}>
              <ProductionCompanyCard {...props} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default PCCarousel;
