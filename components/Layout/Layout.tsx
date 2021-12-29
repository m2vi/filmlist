import { ReactNode } from 'react';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full flex flex-col items-center'>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
