import '@styles/globals.css';
import 'nprogress/nprogress.css';
import 'tailwindcss/tailwind.css';
import 'swiper/css';
import 'swiper/css/lazy';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import { Router } from 'next/dist/client/router';
import nProgress from 'nprogress';
import { NextPage } from 'next';
import React from 'react';
import Layout from '@components/Layout/Layout';
import Null from '@components/Null';

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
  return (
    <>
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
