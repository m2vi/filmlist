import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Dropdown from './Dropdown';
import PopoverEl from './Popover';
import Search from './Search';

const Header = () => {
  const { t } = useTranslation();

  const routes = ['browse', 'tv', 'movies', 'my list', 'favourites', 'hall of fame'];

  return (
    <div
      className='absolute top-0 z-50 py-1 px-120 bg-primary-900-80 backdrop-blur-xl w-full max-w-screen-2xl'
      style={{ transform: ' translate(-50%, 0)', left: '50%' }}
    >
      <header
        className='font-normal text-base text-primary-200 w-full flex justify-end items-center md:justify-between bg-transparent'
        style={{ height: '75px' }}
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
          <Search />

          <Link href='/anime'>
            <a className='font-normal text-sm text-center ml-4 l-1 h-7 flex items-center'>Anime</a>
          </Link>

          <PopoverEl />

          <Dropdown />
        </div>
      </header>
    </div>
  );
};

export default Header;
