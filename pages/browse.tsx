import Header from '@components/Header';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import Carousel from '@components/Carousel';
import tmdb from '@utils/apis/tmdb';
import { MovieDbTypeEnum } from '@Types/items';
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

const Home = (props: any) => {
  useEffect(() => console.log(props), [props]);

  const { t } = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{`${t('pages.filmlist.menu.browse')} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      <GenresCarousel items={props?.genres} />

      {props?.data?.map((section: any, index: number) => {
        return <Carousel section={section} key={index} />;
      })}

      <PCCarousel items={props?.production_companies} />

      {props?.browse_genre?.map((id: number, index: number) => {
        return (
          <AsyncCarousel
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
      genres: (await cache.genres.refresh()).filter(({ items }) => items > 0),
      browse_genre: (await filmlist.browseGenre(Date.now().toString())).map(({ id }) => id),
      production_companies: (await cache.productionCompanies.get()).slice(0, 20),
      data: await Promise.all([
        filmlist.getTab({ user: client, locale: context.locale!, tab: 'my list', start: 0, end: 20 }),
        filmlist.getTab({ user: client, locale: context.locale!, tab: 'continue-watching', start: 0, end: 20 }),
        tmdb.getTab({ user: client, locale: context.locale!, tab: 'trending', page: 1, type: MovieDbTypeEnum.movie }),
        tmdb.upcoming({ user: client, locale: context.locale!, page: 1, type: MovieDbTypeEnum.movie }),
      ]),
    },
  };
};
