import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full flex flex-col items-center'>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
