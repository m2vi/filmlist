import Header from '@components/Header';
import { ReactNode } from 'react';

const Layout = ({ children, spacing = true }: { children: ReactNode; spacing: boolean }) => {
  return (
    <div className='h-full w-full relative'>
      <style jsx global>{`
        :root {
          --color-primary-900: #000000;
          --color-primary-800: #222222;

          --color-primary-200: #ffffff7f
          --color-primary-100: #ffffff;
        }
      `}</style>
      <Header />
      <div className={`pt-100 mt-5 w-full px-120 pb-11 max-w-screen-2xl mx-auto`}>{children}</div>
    </div>
  );
};

export default Layout;
