import '@styles/globals.css';
import 'nprogress/nprogress.css';
import 'tailwindcss/tailwind.css';
import 'swiper/css';
import 'swiper/css/lazy';
import 'react-toastify/dist/ReactToastify.min.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import { Router } from 'next/dist/client/router';
import nProgress from 'nprogress';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import Layout from '@components/Layout/Layout';
import Null from '@components/Null';
import 'moment/locale/en-gb';
import 'moment/locale/de';
import Manage from '@components/Manage';
import { ToastContainer } from 'react-toastify';

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

type NextPageWithLayout = NextPage & {
  layout: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const SeoWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => console.log(Buffer.from(JSON.stringify({ tab: 'lol' }), 'utf8').toString('base64')), []);
  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <Manage />
      <NextSeo defaultTitle='Filmlist' />
      {children}
    </>
  );
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const L = Component.layout ? Layout : Null;

  return (
    <L>
      <SeoWrapper>
        <Component {...pageProps} />
      </SeoWrapper>
    </L>
  );
};

export default appWithTranslation(MyApp);
