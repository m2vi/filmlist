import api from '@utils/frontend/api';
import { FrontendItemProps } from '@utils/types';
import { useRouter } from 'next/router';
import { createRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import _ from 'underscore';
import Card from './Card';
import Full from './Full';
import Title from './Title';
import config from '@data/config.json';

const Scroll = ({ data }: { data: { items: FrontendItemProps[]; length: number; extra: any } }) => {
  const ScrollRef = createRef<HTMLDivElement>();
  const [items, setItems] = useState(data.items);
  const { t } = useTranslation();
  const { query, locale } = useRouter();

  useEffect(() => setItems(data.items), [data]);
  useEffect(() => {
    if (ScrollRef.current) {
      if (!(ScrollRef.current.scrollTop === 0)) ScrollRef.current.scrollTop = 0;
    }
    // eslint-disable-next-line
  }, [data]);

  const fetchMoreData = () => {
    try {
      api
        .fetchMoreData(query, locale, items.length)
        .then((toConcat) => setItems(items.concat(toConcat)))
        .catch((err) => console.log(err));
    } catch (error) {}
  };

  return (
    <Full className='pt-10 flex justify-center'>
      <Title
        title={`${
          query.tab
            ? t(`pages.filmlist.menu.${query.tab}`)
            : _.has(data, 'name')
            ? `Company ${(data as any).name ? (data as any).name : (data as any).id}`
            : data.extra
            ? `${data.extra.original_name}`
            : `Genre ${query.id}`
        } – ${t(`pages.filmlist.default`)}`}
      />
      <main
        className='w-full overflow-y-scroll dD5d-item max-w-screen-2xl px-120 py-11'
        ref={ScrollRef}
        id='scrollableDiv'
        style={{ overflowX: 'hidden' }}
      >
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={data.length >= items.length}
          loader={null}
          scrollableTarget='scrollableDiv'
          className='w-full p-0 grid gap-2 auto-rows-auto place-items-center !overflow-x-hidden '
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(${config.cardWidth}, 1fr))`,
            overflowX: 'hidden',
          }}
        >
          {items.map(({ ...props }, i: number) => {
            return <Card {...(props as FrontendItemProps)} key={i} />;
          })}
        </InfiniteScroll>
      </main>
    </Full>
  );
};

export default Scroll;
