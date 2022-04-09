import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import user from '@utils/user';
import { useEffect } from 'react';
import db from '@utils/db/main';
import { useTranslation } from 'next-i18next';
import cache from '@utils/apis/cache';
import PCCarousel from '@components/Carousel/pc';
import GenresCarousel from '@components/Carousel/genres';
import { basicFetch } from '@utils/helper/fetch';
import QueryString from 'qs';
import { useRouter } from 'next/router';
import { FilmlistGenre, FilmlistProductionCompany, ProviderProps } from '@Types/filmlist';
import AsyncPersonCarousel from '@components/Carousel/person/async';
import ProvidersCarousel from '@components/Carousel/providers';

const Home = (props: { production_companies: FilmlistProductionCompany[]; genres: FilmlistGenre[]; providers: ProviderProps[] }) => {
  useEffect(() => console.log(props), [props]);

  const { t } = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{`${t('pages.filmlist.menu.browse')} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>
      <GenresCarousel items={props?.genres} title={true} />
      <PCCarousel items={props?.production_companies} title={true} />
      <ProvidersCarousel items={props?.providers} title={true} />
      <AsyncPersonCarousel
        func={async () => {
          return await basicFetch(`/api/person/popular?${QueryString.stringify({ page: 1, locale })}`);
        }}
      />
    </>
  );
};

Home.layout = true;

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  await db.init();

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      genres: (await cache.genres.refresh()).filter(({ items }) => items > 0),
      production_companies: (await cache.production_companies.get()).slice(0, 20),
      providers: await cache.providers.get(),
    },
  };
};
