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

const Home = (props: any) => {
  useEffect(() => console.log(props), [props]);

  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t('pages.filmlist.menu.browse')} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      {props?.data?.map((section: any, index: number) => {
        return <Carousel section={section} key={index} />;
      })}
    </>
  );
};

Home.layout = true;

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);
  await db.init();

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await Promise.all([
        filmlist.getTab({ user: id, locale: context.locale!, tab: 'my list', start: 0, end: 20 }),
        filmlist.getTab({ user: id, locale: context.locale!, tab: 'continue-watching', start: 0, end: 20 }),
        tmdb.getTab({ user: id, locale: context.locale!, tab: 'trending', page: 1, type: MovieDbTypeEnum.movie }),
        filmlist.getTab({ user: id, locale: context.locale!, tab: 'latest', start: 0, end: 20 }),
        filmlist.getTab({ user: id, locale: context.locale!, tab: 'soon', start: 0, end: 20 }),
      ]),
    },
  };
};
