import { ReactNode } from 'react';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='h-full w-full flex justify-center' style={{ maxWidth: '2220px' }}>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
