import { useRouter } from 'next/dist/client/router';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { IoAddOutline } from 'react-icons/io5';
import { Fragment } from 'react';
import Dropdown from './Dropdown';

const Header = () => {
  const Router = useRouter();

  const routes = ['browse', 'tv', 'movies', 'my list', 'favourites'];
  const { t } = useTranslation();

  return (
    <div
      className='absolute top-0 z-50 py-1 px-11 bg-transparent w-full'
      style={{ maxWidth: '2220px', transform: ' translate(-50%, 0)', left: '50%' }}
    >
      <header
        className='font-normal text-base text-primary-200 w-full flex justify-end items-center md:justify-between bg-primary-900'
        style={{ height: '65px' }}
      >
        <div className='md:flex items-center hidden'>
          {routes.map((route) => (
            <span className={`cursor-pointer mr-4 text-primary-100 hover:opacity-80`} key={route}>
              <Link href={`/${route}`} shallow={false} prefetch={false}>
                {t(`pages.filmlist.menu.${route}`)}
              </Link>
            </span>
          ))}
        </div>
        <div className='flex items-center justify-end'>
          <Dropdown />
        </div>
      </header>
    </div>
  );
};

export default Header;
