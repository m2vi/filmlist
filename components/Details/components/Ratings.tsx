import Rating from '@components/Card/Rating';
import { RatingCircle } from '@components/Rating/RatingCircle';
import { Spinner } from '@components/Spinner';
import { Menu, Popover, Transition } from '@headlessui/react';
import { sortByKey } from '@m2vi/iva';
import { RatingsResponse } from '@Types/filmlist';
import { ItemProps } from '@Types/items';
import { basicFetch } from '@utils/helper/fetch';
import { useTranslation } from 'next-i18next';
import { Fragment, useEffect, useState } from 'react';

const Ratings = ({ data }: { data: ItemProps }) => {
  const { t } = useTranslation();
  const [ratings, setRatings] = useState<RatingsResponse>({});

  const f = async () => {
    setRatings({});
    const res = await basicFetch(`/api/ratings/${data.type}/${data.id_db}`);
    setRatings(res);
  };

  useEffect(() => {
    const f = async () => {
      setRatings({});
      const res = await basicFetch(`/api/ratings/${data.type}/${data.id_db}`);
      setRatings(res);
    };

    f();
  }, [data]);

  return (
    <Popover className='relative'>
      <Fragment>
        <Popover.Button>
          <Rating ratings={data.ratings} user_rating={data.user_rating} />
        </Popover.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <div className='grid grid-flow-row absolute left-0 bg-primary-800 w-400 mt-3 rounded-8 shadow-xl overflow-hidden border border-primary-700'>
            <div className='w-full overflow-y-auto h-full'>
              <Popover.Panel className='divide-y divide-primary-700 h-300'>
                {Object.entries(ratings).length > 0 ? (
                  <Fragment>
                    {sortByKey(Object.entries(ratings), '[1].vote_count')
                      .reverse()
                      .map(([key, value], index) => {
                        return (
                          <div className='w-full p-4 flex' key={index}>
                            <div className='mr-4'>
                              <RatingCircle colorClassName={key} provider={value} />
                            </div>

                            <div className='flex flex-col'>
                              <span className='text-primary-200'>{t(`ratings.${key}`, { defaultValue: key }).toString()}</span>
                              <span className='text-primary-300 text-sm leading-none'>
                                {value.vote_count ? value.vote_count : '-'} {t('details.votes').toString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </Fragment>
                ) : (
                  <div className='h-full w-full grid place-items-center'>
                    <Spinner size='6' />
                  </div>
                )}
              </Popover.Panel>
            </div>
          </div>
        </Transition>
      </Fragment>
    </Popover>
  );
};

export default Ratings;
