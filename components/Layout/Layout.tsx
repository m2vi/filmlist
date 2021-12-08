import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter();

  return (
    <div className='w-full flex flex-col items-center'>
      <Header />
      {children}
      {!['/[tab]', '/genre/[id]'].includes(pathname) && <Footer />}
    </div>
  );
};

export default Layout;
