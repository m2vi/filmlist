import { UserClient } from '@utils/user/client';
import QueryString from 'qs';
import { basicFetch } from '@utils/helper/fetch';
import AsyncCarousel from '@components/Carousel/async';
import { useTranslation } from 'next-i18next';

const Carousel = ({ id, type, locale, user }: { id: number; type: number; locale: string; user: UserClient }) => {
  const { t } = useTranslation();

  return (
    <div className='w-full px-2 py-16 sm:px-0'>
      <div className='mt-3'>
        <AsyncCarousel
          func={async () => {
            const items = await basicFetch(`/api/similarity?${QueryString.stringify({ id, type, locale, user: user.id })}`);

            return {
              items,
              key: null,
              length: items.length,
              query: {},
              tmdb: true,
            };
          }}
        />
      </div>
    </div>
  );
};

export default Carousel;
