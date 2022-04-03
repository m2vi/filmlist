import Header from '@components/Header';
import { ReactNode } from 'react';

const Layout = ({ children, spacing = true }: { children: ReactNode; spacing: boolean }) => {
  return (
    <div className='h-full w-full '>
      <Header />
      <div className={`pt-100 mt-5 w-full px-120 pb-11 max-w-screen-2xl mx-auto`}>{children}</div>
    </div>
  );
};

export default Layout;
