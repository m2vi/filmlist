import '../styles/colors.css';
import '../styles/common.css';
import '../styles/components.css';
import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import 'nprogress/nprogress.css';
import 'swiper/css';
import 'swiper/css/lazy';
import type { AppProps } from 'next/app';
import { moment } from '@apis/moment';
import 'moment/locale/de';
import { NextPage } from 'next';
import { Fragment } from 'react';
import Layout from '@components/Layout';
import { appWithTranslation } from 'next-i18next';
import { Router } from 'next/router';
import nProgress from 'nprogress';

type NextPageWithLayout = NextPage & {
  layout: boolean;
  spacing: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  moment.locale('de');

  return (
    <Fragment>
      {Component.layout ? (
        <Layout spacing={Component.spacing}>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </Fragment>
  );
}

export default appWithTranslation(MyApp);
