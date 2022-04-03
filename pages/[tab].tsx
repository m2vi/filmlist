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
import Head from 'next/head';

const Handler = (props: { data: GetTabResponse }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState(props.data.items);
  useEffect(() => console.log(props.data), [props.data]);

  useEffect(() => setItems(props.data.items), [props.data.items]);

  return (
    <Fragment>
      <Head>
        <title>{`${t(`pages.filmlist.menu.${props.data.query.tab}`)} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>
      <InfiniteScroll
        loadMore={(page) => {
          const query = props.data.query;

          const qs = QueryString.stringify({ ...query, start: items.length, end: items.length + 50 });

          basicFetch(`/api/tab/${query.tab}?${qs}`).then((section: any) => {
            if (!section?.items || section?.items?.length === 0) return;
            setItems(items.concat(section?.items));
          });
        }}
        hasMore={true}
        className='h-full w-full grid gap-4 grid-flow-row place-items-center'
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${config.cardWidth}, 1fr))` }}
      >
        {items.map((item, index) => {
          return <Card {...item} key={index} />;
        })}
      </InfiniteScroll>
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
      data: await filmlist.getTab({ user: id, locale: context.locale!, tab: context.query.tab?.toString()!, start: 0, end: 80 }),
    },
  };
};
