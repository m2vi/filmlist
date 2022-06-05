import cache from '@apis/cache';
import PCCarousel from '@components/Carousel/production_companies';
import { FilmlistGenre, FilmlistGenres, FrontendItemProps, GetTabResponse } from '@Types/items';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Fragment } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import user from '@apis/user';
import main from '@apis/main';
import Carousel from '@components/Carousel';
import tmdb from '@apis/tmdb';
import GenresCarousel from '@components/Carousel/genres';

const Home = (props: { production_companies: FilmlistGenre[]; items: GetTabResponse[]; genres: FilmlistGenres }) => {
  return (
    <Fragment>
      <Head>
        <title>Browse</title>
      </Head>

      <GenresCarousel items={props?.genres} title={false} />

      {props?.items?.map((section: any, index: number) => {
        return <Carousel section={section} key={index} />;
      })}

      <PCCarousel items={props?.production_companies} title={true} />
    </Fragment>
  );
};

Home.layout = true;

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = await user.find(user.getIdFromRequest(context.req));

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      genres: (await cache.get<FilmlistGenres>('genres')).filter(({ items }) => items > 0),
      production_companies: (await cache.get<FilmlistGenre[]>('companies')).slice(0, 20),
      items: await Promise.all([
        main.getTab({ user: client, locale: context.locale!, tab: 'my list', start: 0, end: 20, purpose: 'items_l' }),
        main.getTab({ user: client, locale: context.locale!, tab: 'new', start: 0, end: 20, purpose: 'items_l' }),
        tmdb.getTab({ user: client, locale: context.locale!, tab: 'trending', page: 1, type: 1 }),
        tmdb.upcoming({ user: client, locale: context.locale!, page: 1, type: 1 }),
      ]),
    },
  };
};
