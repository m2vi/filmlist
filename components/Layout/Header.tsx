import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { IoNotifications, IoSearch } from 'react-icons/io5';
import Dropdown from './Dropdown';

const Header = () => {
  const { t } = useTranslation();

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
            <span className='cursor-pointer mr-4 text-primary-100 hover:opacity-80' key={route}>
              <Link href={`/${route}`} passHref={true}>
                <a>{t(`pages.filmlist.menu.${route}`)}</a>
              </Link>
            </span>
          ))}
        </div>
        <div className='flex items-center justify-end'>
          <span className='font-normal text-sm h-full text-center items-center ml-4 cursor-pointer'>
            <IoSearch className='h-4 w-4' />
          </span>

          <Link href='/anime'>
            <a className='font-normal text-sm text-center ml-4 l-1 h-7 flex items-center'>Anime</a>
          </Link>

          <span className='font-normal text-sm h-full text-center items-center mx-4 cursor-pointer'>
            <IoNotifications className='h-4 w-4' />
          </span>

          <Dropdown />
        </div>
      </header>
    </div>
  );
};

export default Header;
