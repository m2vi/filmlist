import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoDownload, IoSearch } from 'react-icons/io5';
import { FiDownload } from 'react-icons/fi';
import Image from 'next/image';
import userClient from '@clients/user.client';
import { DownloadIcon } from '@heroicons/react/solid';

const Header = () => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => setAvatar(userClient.getAvatarUrl()), []);

  return (
    <div className='absolute top-0 left-0 right-0 z-10 w-full flex justify-center'>
      <div className='w-full max-w-screen-2xl px-120 py-1 '>
        <header className='text-primary-200 w-full flex justify-between items-center h-80'>
          <div className='flex justify-start items-center'>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/'>
                <a>{t('pages.filmlist.menu.browse')}</a>
              </Link>
            </span>

            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/tv'>
                <a>{t('pages.filmlist.menu.tv')}</a>
              </Link>
            </span>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/movie' prefetch={false}>
                <a>{t('pages.filmlist.menu.movie')}</a>
              </Link>
            </span>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/my list'>
                <a>{t('pages.filmlist.menu.my list')}</a>
              </Link>
            </span>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/favourites'>
                <a>{t('pages.filmlist.menu.favourites')}</a>
              </Link>
            </span>
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80'>
              <Link href='/[tab]' as='/watch-it-again'>
                <a>{t('pages.filmlist.menu.watch-it-again')}</a>
              </Link>
            </span>
          </div>
          <div className='flex items-center justify-end'>
            <Link href='/search'>
              <a className='font-normal text-sm h-full text-center items-center cursor-pointer'>
                <IoSearch className='h-4 w-4' />
              </a>
            </Link>
            <Link href='/downloads'>
              <a className='font-normal text-sm h-full text-center items-center cursor-pointer ml-4'>
                <DownloadIcon className='h-4 w-4' />
              </a>
            </Link>
            <div className='flex justify-center h-7 w-7 bg-primary-800 text-sm font-medium rounded cursor-pointer ml-4'>
              {avatar && <Image src={avatar} alt='Avatar' height='35px' width='35px' className='rounded no-drag' />}
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;
