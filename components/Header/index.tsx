import userClient from '@utils/user/client';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoNotifications, IoSearch } from 'react-icons/io5';
import { Dropdown } from './Dropdown';
import Notifications from './Notifications';

const Header = () => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => setAvatar(userClient.getAvatarUrl()), []);

  //? maybe fixed
  return (
    <div className='absolute top-0 left-0 right-0 z-10 w-full flex justify-center bg-primary-900'>
      <div className='w-full max-w-screen-2xl px-120 py-1 '>
        <header className='text-primary-200 w-full flex justify-between items-center h-80'>
          <div className='flex justify-start items-center'>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/browse'>
                <a>{t('pages.filmlist.menu.browse').toString()}</a>
              </Link>
            </span>

            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/tv'>
                <a>{t('pages.filmlist.menu.tv').toString()}</a>
              </Link>
            </span>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/movie' prefetch={false}>
                <a>{t('pages.filmlist.menu.movie').toString()}</a>
              </Link>
            </span>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/my list'>
                <a>{t('pages.filmlist.menu.my list').toString()}</a>
              </Link>
            </span>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/favourites'>
                <a>{t('pages.filmlist.menu.favourites').toString()}</a>
              </Link>
            </span>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/watch-it-again'>
                <a>{t('pages.filmlist.menu.watch-it-again').toString()}</a>
              </Link>
            </span>
          </div>
          <div className='flex items-center justify-end'>
            <Link href='/search' prefetch={false}>
              <a className='font-normal text-sm h-full text-center items-center cursor-pointer'>
                <IoSearch className='h-4 w-4' />
              </a>
            </Link>
            <Link href='/[tab]' as='/anime' prefetch={false}>
              <a className='font-normal text-sm text-center ml-4 l-1 h-7 flex items-center'>Anime</a>
            </Link>

            <Notifications />

            <Dropdown avatar={avatar} />
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
