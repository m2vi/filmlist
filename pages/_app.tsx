import '@styles/globals.css';
import 'nprogress/nprogress.css';
import 'tailwindcss/tailwind.css';
import 'swiper/css';
import 'swiper/css/lazy';
import 'react-toastify/dist/ReactToastify.min.css';
import '@styles/rc-slider.css';
import '@styles/notifications.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import nProgress from 'nprogress';
import { NextPage } from 'next';
import { ReactNode } from 'react';
import Layout from '@components/Layout/Layout';
import Null from '@components/Null';
import 'moment/locale/en-gb';
import 'moment/locale/de';
import { ToastContainer } from 'react-toastify';
import Router from 'next/router';
import NotificationWrapper from '@components/NotificationWrapper';

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

type NextPageWithLayout = NextPage & {
  layout: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const SeoWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full h-full'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={false}
        pauseOnHover={true}
        closeButton={false}
        theme='dark'
      />

      <NextSeo defaultTitle='Filmlist' />
      {children}
    </div>
  );
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const L = Component.layout ? Layout : Null;

  return (
    <L>
      <SeoWrapper>
        <NotificationWrapper />
        <Component {...pageProps} />
      </SeoWrapper>
    </L>
  );
};

export default appWithTranslation(MyApp);
