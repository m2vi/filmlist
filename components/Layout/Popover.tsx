import { Menu, Transition } from '@headlessui/react';
import api from '@utils/frontend/api';
import { NotificationItemProps } from '@utils/types';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { IoNotifications } from 'react-icons/io5';
import config from '@data/config.json';
import { Spinner } from '@components/Spinner';
import Link from 'next/link';

const PopoverEl = () => {
  const [data, setData] = useState<NotificationItemProps[]>([]);
  const { locale } = useRouter();

  const fetchData = () => {
    if (data.length > 0) return;

    api
      .getNotifications(locale)
      .then((items) => setData(items))
      .catch((err) => console.log(err));
  };

  return (
    <div className=' flex justify-end'>
      <Menu as='div' className='relative h-full'>
        {({ open }) => {
          if (!(typeof window === 'undefined')) fetchData();

          return (
            <>
              <div className='h-full flex justify-center'>
                <Menu.Button
                  className='font-normal text-sm text-center flex justify-center items-center mx-4 cursor-pointer h-7 w-7'
                  aria-label='Notifications'
                >
                  <IoNotifications className='h-4 w-4' />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <div className='absolute right-0 overflow-y-auto w-400 mt-3 origin-top-right bg-primary-800 rounded-5 border border-primary-700'>
                  <Menu.Items className='divide-y divide-primary-700 h-300' unmount={false}>
                    {data.length > 0 ? (
                      <>
                        {data.map(({ _id, name, backdrop_path, release_date }) => (
                          <Link href={`/details/${_id}`} passHref key={_id}>
                            <div className='p-3 hover:bg-primary-900 cursor-pointer' key={_id}>
                              <Menu.Item>
                                <div className='flex'>
                                  <img
                                    className='max-h-11 rounded-3 mr-4'
                                    src={`https://image.tmdb.org/t/p/w${config.posterWidth}${backdrop_path}`}
                                    alt={_id ? _id : ''}
                                  />
                                  <div className='flex flex-col pt-1'>
                                    <span className=''>{name}</span>
                                    <span className='text-primary-300 text-sm'>{release_date}</span>
                                  </div>
                                </div>
                              </Menu.Item>
                            </div>
                          </Link>
                        ))}
                        <div className='px-3 py-2 hover:bg-primary-900 cursor-pointer'>
                          <Menu.Item>
                            <Link href='/notifications'>
                              <a className='w-full flex justify-center' title='View more'>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='h-4 w-4 mr-1'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                              </a>
                            </Link>
                          </Menu.Item>
                        </div>
                      </>
                    ) : (
                      <div className='h-full w-full grid place-items-center'>
                        <Spinner size='6' />
                      </div>
                    )}
                  </Menu.Items>
                </div>
              </Transition>
            </>
          );
        }}
      </Menu>
    </div>
  );
};

export default PopoverEl;
