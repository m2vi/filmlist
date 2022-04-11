import { basicFetch } from '@m2vi/iva';
import { GetTabResponse } from '@Types/filmlist';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import QueryString from 'qs';
import { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Card from './Card';
import config from '@data/config.json';
import userClient from '@utils/user/client';

const Tab = (props: { data: GetTabResponse; name?: string }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState(props.data.items);
  const [client, setClient] = useState('');
  useEffect(() => console.log(props.data), [props.data]);

  useEffect(() => setItems(props.data.items), [props.data.items]);
  useEffect(() => setClient(userClient.getUser()?.username!), []);

  return (
    <Fragment>
      <Head>
        <title>{`${props.name ? props.name : t(`pages.filmlist.menu.${props.data.query.tab}`, { replace: { name: client } })} – ${t(
          `pages.filmlist.default`,
          { replace: { name: client } }
        )}`}</title>
      </Head>
      <InfiniteScroll
        loadMore={(page) => {
          const query = props.data.query;

          const qs = QueryString.stringify({
            ...query,
            start: items.length,
            end: items.length + 50,
            custom_config: query?.custom_config ? JSON.stringify(query?.custom_config) : undefined,
          });

          basicFetch(`/api/tab/${query.tab}?${qs}`)
            .then((section: any) => {
              if (!section?.items || section?.items?.length === 0) return;
              setItems(items.concat(section?.items));
            })
            .catch(console.error);
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

export default Tab;
