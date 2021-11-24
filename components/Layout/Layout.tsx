import { ReactNode } from 'react';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
