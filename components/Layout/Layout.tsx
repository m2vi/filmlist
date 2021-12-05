import { ReactNode } from 'react';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='h-full w-full flex justify-center'>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
