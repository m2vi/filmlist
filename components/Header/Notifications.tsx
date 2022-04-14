import { Popover, Transition } from '@headlessui/react';
import { FrontendItemProps } from '@Types/items';
import { moment } from '@utils/apis/moment';
import { basicFetch } from '@utils/helper/fetch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { IoNotifications } from 'react-icons/io5';

async function getNotifications(locale: string = 'en'): Promise<Array<FrontendItemProps>> {
  const tab = await basicFetch(`/api/notifications?locale=${locale}`);

  return tab;
}

const Notifications = () => {
  const [data, setData] = useState<FrontendItemProps[]>([]);
  const { locale } = useRouter();

  useEffect(() => {
    getNotifications(locale).then(setData).catch(console.error);
  }, [locale]);

  return (
    <Popover className='relative'>
      <Popover.Button>
        <div className='font-normal text-sm text-center flex justify-center items-center mx-4 cursor-pointer h-7 w-7'>
          <IoNotifications className='h-4 w-4' />
        </div>
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
        <div className='grid grid-flow-row absolute right-0 bg-primary-800 w-400 mt-3 origin-top-right rounded-8 shadow-xl overflow-hidden  border border-primary-700'>
          <div className='w-full overflow-y-auto h-full'>
            <Popover.Panel className='divide-y divide-primary-700 h-300'>
              {(Array.isArray(data) ? data : []).map(({ id_db, type, name, release_date, backdrop_path }, i) => {
                return (
                  <Link href={`/${type ? 'movie' : 'tv'}/[id]`} as={`/${type ? 'movie' : 'tv'}/${id_db}`} key={i}>
                    <a className='flex p-3 hover:bg-primary-900 cursor-pointer'>
                      <div className='flex'>
                        <img className='max-h-11 rounded-3 mr-4' src={`https://image.tmdb.org/t/p/w342${backdrop_path}`} alt={name!} />
                        <div className='flex flex-col pt-1'>
                          <span className=''>{name}</span>
                          <span className='text-primary-300 text-sm'>{moment(release_date).format('LL')}</span>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
              <Link as='/notifications' href='/[tab]'>
                <a
                  className='w-full flex justify-center px-3 rounded-b-8 py-3 border border-transparent border-t-primary-700 hover:bg-primary-900 cursor-pointer'
                  title='View more'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </a>
              </Link>
            </Popover.Panel>
          </div>
        </div>
      </Transition>
    </Popover>
  );
};

export default Notifications;
