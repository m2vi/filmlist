import '../styles/globals.css';
import '../styles/components.css';
import 'tailwindcss/tailwind.css';
import 'swiper/css';
import 'swiper/css/lazy';
import type { AppProps } from 'next/app';
import { moment } from '@apis/moment';
import 'moment/locale/de';
import { NextPage } from 'next';
import { Fragment } from 'react';
import Layout from '@components/Layout';
import { appWithTranslation } from 'next-i18next';

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
    </Fragment>
  );
}

export default appWithTranslation(MyApp);
