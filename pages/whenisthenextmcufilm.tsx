import Card from '@components/Card';
import { basicFetch } from '@m2vi/iva';
import { GetTabResponse } from '@Types/filmlist';
import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import config from '@data/config.json';
import QueryString from 'qs';
import tmdb from '@utils/apis/tmdb';
import { FrontendItemProps } from '@Types/items';

const Handler = (props: { data: FrontendItemProps[] }) => {
  const { t } = useTranslation();

  useEffect(() => console.log(props.data), [props.data]);

  return (
    <Fragment>
      <title>{`When is the next MCU film – ${t(`pages.filmlist.default`)}`}</title>
      <div
        className='h-full w-full grid gap-4 grid-flow-row'
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${config.cardWidth}, 1fr))` }}
      >
        {props.data.map((item, index) => {
          return <Card {...item} key={index} />;
        })}
      </div>
    </Fragment>
  );
};

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await tmdb.whenisthenextmcufilm(context.locale!),
    },
  };
};
