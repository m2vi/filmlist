import { Dialog, Transition } from '@headlessui/react';
import { FrontendItemProps, RatingsProps, VoteProps } from '@utils/types';
import { isDefined } from '@utils/utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Slider from 'rc-slider';
import { Fragment, HTMLAttributes, useEffect, useState } from 'react';
import { Spinner } from './Spinner';

interface RatingProps extends Partial<FrontendItemProps>, HTMLAttributes<HTMLDivElement> {
  notchild?: boolean;
}

const Rating = ({ ratings, state, notchild, className, type, id_db, ...props }: RatingProps) => {
  const Router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<RatingsProps | null>(null);
  const [userValue, setUserValue] = useState(ratings?.user?.vote_average ? ratings?.user?.vote_average * 10 : 10);
  const { t } = useTranslation();

  useEffect(() => setData(null), [id_db, type]);

  const fetchData = () => {
    fetch(`/api/ratings/${type ? 'movie' : 'tv'}/${id_db}`)
      .then((data) => data.json())
      .then((data) => {
        if (data) setData(data);
      })
      .catch(console.log);
  };

  const openModal = () => {
    if (!notchild) return;
    setIsOpen(true);
    fetchData();
  };
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div
        className={`${!notchild ? 'absolute top-2 right-2 z-20' : 'w-10'} grid grid-flow-col gap-3 cursor-pointer ${className}`}
        onClick={openModal}
        {...props}
      >
        {ratings?.user?.vote_count ? (
          <RatingCircle provider={ratings?.user} colorClassName='user' />
        ) : ratings?.imdb?.vote_count ? (
          <RatingCircle provider={ratings?.imdb} colorClassName='imdb' />
        ) : (
          <RatingCircle provider={ratings?.tmdb} colorClassName='tmdb' />
        )}
      </div>
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={closeModal}>
            <div className='min-h-screen px-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-0' />
              </Transition.Child>
              <span className='inline-block h-screen align-middle' aria-hidden='true'>
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <div className='border border-primary-700 inline-block w-full max-w-md px-8 py-6 my-8 overflow-hidden text-left align-middle bg-primary-900-80 rounded-8 shadow-1 relative'>
                  <div className={`absolute inset-0 w-full h-full grid place-items-center ${!data ? 'visible' : 'invisible'}`}>
                    <Spinner size='6' />
                  </div>
                  <div className={`grid grid-cols-2 auto-rows-auto justify-between gap-2 w-full ${data ? 'visible' : 'invisible'}`}>
                    <div className='grid grid-flow-col justify-start'>
                      <RatingCircle provider={data?.tmdb} colorClassName='tmdb' />
                      <div className='flex flex-col justify-center ml-2'>
                        <span className='leading-5 text-primary-200'>TMDB</span>
                        <span className='l-1 text-primary-300 text-sm'>
                          {data?.tmdb?.vote_count ? data?.tmdb?.vote_count?.toLocaleString(Router.locale) : 0} {t('details.votes')}
                        </span>
                      </div>
                    </div>
                    <div className='grid grid-flow-col justify-start'>
                      <RatingCircle provider={data?.imdb} colorClassName='imdb' />
                      <div className='flex flex-col justify-center ml-2'>
                        <span className='leading-5 text-primary-200'>IMDb</span>
                        <span className='l-1 text-primary-300 text-sm'>
                          {data?.imdb?.vote_count ? data?.imdb?.vote_count?.toLocaleString(Router.locale) : 0} {t('details.votes')}
                        </span>
                      </div>
                    </div>
                    {isDefined(data?.rt?.vote_average) ? (
                      <div className='grid grid-flow-col justify-start mt-2'>
                        <RatingCircle provider={data?.rt} colorClassName='rt' />
                        <div className='flex flex-col justify-center ml-2'>
                          <span className='leading-5 text-primary-200'>Tomatometer</span>
                          <span className='l-1 text-primary-300 text-sm'>- {t('details.votes')}</span>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {isDefined(ratings?.user?.vote_average) ? (
                      <div className='grid grid-flow-col justify-start mt-2'>
                        <RatingCircle provider={ratings?.user} colorClassName='user' />
                        <div className='flex flex-col justify-center ml-2'>
                          <span className='leading-5 text-primary-200'>User rating(s)</span>
                          <span className='l-1 text-primary-300 text-sm'>
                            {ratings?.user?.vote_count} {t('details.votes')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    </>
  );
};

export default Rating;

export interface RatingCircleProps {
  provider: VoteProps | null | undefined;
  colorClassName: string;
}

export const RatingCircle = ({ provider, colorClassName }: RatingCircleProps) => {
  const nr = !provider || !provider?.vote_average;

  return (
    <div className='flex justify-center items-center h-36 w-36 relative'>
      <span className='text-xs font-medium text-button l-1'>{nr ? 'NR' : provider?.vote_average?.toFixed(1)}</span>
      <svg x='0px' y='0px' width='36px' height='36px' viewBox='0 0 36 36' className='absolute -inset-2px h-8 w-8'>
        <circle
          fill='none'
          className={`${nr ? 'stroke-primary-500' : colorClassName} transform origin-center -rotate-90`}
          strokeWidth='3'
          cx='18'
          cy='18'
          r='16'
          strokeDasharray={`${nr ? '100' : provider?.vote_average! * 10} 100`}
          strokeDashoffset='0'
          strokeLinecap='round'
          transform='rotate(-90 18 18)'
        ></circle>
      </svg>
    </div>
  );
};
