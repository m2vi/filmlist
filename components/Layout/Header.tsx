import { useRouter } from 'next/dist/client/router';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { IoAddOutline } from 'react-icons/io5';
import { Fragment } from 'react';
import Dropdown from './Dropdown';

const Header = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();

  const routes = ['browse', 'tv', 'movies', 'my list', 'favourites'];

  return (
    <div
      className='absolute top-0 z-50 py-1 px-11 bg-transparent w-full max-w-screen-2xl'
      style={{ transform: ' translate(-50%, 0)', left: '50%' }}
    >
      <header
        className='font-normal text-base text-primary-200 w-full flex justify-end items-center md:justify-between bg-primary-900'
        style={{ height: '65px' }}
      >
        <div className='md:flex items-center hidden'>
          {routes.map((route) => (
            <span
              className={`cursor-pointer mr-4 text-primary-100 hover:opacity-80 ${
                decodeURIComponent(asPath) === `/${route}` && 'font-semibold hover:opacity-100'
              }`}
              key={route}
            >
              <Link href={`/${route}`} shallow={false} prefetch={false}>
                {t(`pages.filmlist.menu.${route}`)}
              </Link>
            </span>
          ))}
        </div>
        <div className='flex items-center justify-end'>
          <Link href='/anime'>
            <a className='font-normal text-sm h-full text-center items-center mx-4'>Anime</a>
          </Link>
          <Dropdown />
        </div>
      </header>
    </div>
  );
};

export default Header;
