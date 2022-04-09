import '../styles/globals.css';
import 'nprogress/nprogress.css';
import 'tailwindcss/tailwind.css';
import 'plyr-react/dist/plyr.css';
import 'swiper/css';
import 'swiper/css/lazy';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Fragment } from 'react';
import CookieConsent from '@components/CookieConsent';
import Layout from '@components/Layout';

import 'moment/locale/de';
import { Router } from 'next/router';
import nProgress from 'nprogress';
import { NextPage } from 'next';
import moment from 'moment';

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

type NextPageWithLayout = NextPage & {
  layout: boolean;
  spacing: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

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

      <CookieConsent />
    </Fragment>
  );
}

export default appWithTranslation(MyApp);
