import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import Carousel from '@components/Carousel';
import { useEffect } from 'react';
import db from '@utils/db/main';
import { useTranslation } from 'next-i18next';
import cache from '@utils/apis/cache';
import PCCarousel from '@components/Carousel/pc';
import GenresCarousel from '@components/Carousel/genres';
import AsyncCarousel from '@components/Carousel/async';
import { basicFetch } from '@utils/helper/fetch';
import QueryString from 'qs';
import { useRouter } from 'next/router';
import { FilmlistGenre, FilmlistProductionCompany, GetTabResponse } from '@Types/filmlist';
import AsyncBrowseGenreCarousel from '@components/Carousel/browse_genre/async';
import AsyncPersonCarousel from '@components/Carousel/person/async';
import fsm from '@utils/apis/filmlist/small';

const Home = (props: {
  data: GetTabResponse[];
  production_companies: FilmlistProductionCompany[];
  browse_genre: number[];
  genres: FilmlistGenre[];
}) => {
  useEffect(() => console.log(props), [props]);

  const { t } = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{`${t('pages.filmlist.menu.browse')} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      <GenresCarousel items={props?.genres} title={false} />

      {props?.data?.map((section: any, index: number) => {
        return <Carousel section={section} key={index} />;
      })}

      <AsyncCarousel
        func={async () => {
          const data = await basicFetch(`/api/similarity/fu?${QueryString.stringify({ locale })}`);

          return data;
        }}
      />

      <AsyncCarousel
        func={async () => {
          return basicFetch(`/api/tmdb-tab/trending?${QueryString.stringify({ locale, page: 1, type: 'movie' })}`);
        }}
      />

      <AsyncCarousel
        func={async () => {
          return basicFetch(`/api/tmdb-tab/upcoming?${QueryString.stringify({ locale, page: 1, type: 'movie' })}`);
        }}
      />

      <PCCarousel items={props?.production_companies} title={true} />

      {props?.browse_genre?.slice(0, 2)?.map((id: number, index: number) => {
        return (
          <AsyncBrowseGenreCarousel
            func={async () => {
              return await basicFetch(`/api/genre/browse?${QueryString.stringify({ id, locale })}`);
            }}
            key={index}
          />
        );
      })}

      <AsyncPersonCarousel
        func={async () => {
          return await basicFetch(`/api/person/popular?${QueryString.stringify({ page: 1, locale })}`);
        }}
      />

      {props?.browse_genre?.slice(2, 10)?.map((id: number, index: number) => {
        return (
          <AsyncBrowseGenreCarousel
            func={async () => {
              return await basicFetch(`/api/genre/browse?${QueryString.stringify({ id, locale })}`);
            }}
            key={index}
          />
        );
      })}
    </>
  );
};

Home.layout = true;

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);
  const client = await user.find(id);
  await db.init();

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      genres: (await cache.genres.get()).filter(({ items }) => items > 0),
      browse_genre: (await fsm.browseGenre(Date.now().toString())).map(({ id }) => id),
      production_companies: (await cache.production_companies.get()).slice(0, 20),
      data: await Promise.all([
        filmlist.getTab({ user: client, locale: context.locale!, tab: 'my list', start: 0, end: 20, purpose: 'items_f' }),
        filmlist.getTab({ user: client, locale: context.locale!, tab: 'continue-watching', start: 0, end: 20, purpose: 'items_f' }),
      ]),
    },
  };
};
