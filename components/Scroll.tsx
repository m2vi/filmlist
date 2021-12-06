import { FrontendItemProps } from '@utils/types';
import { useRouter } from 'next/router';
import { createRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from './Card';
import Full from './Full';
import Title from './Title';

const Scroll = ({ data }: { data: { items: FrontendItemProps[]; length: number } }) => {
  const ScrollRef = createRef<HTMLDivElement>();
  const [items, setItems] = useState(data.items);
  const { t } = useTranslation();
  const { query, locale } = useRouter();

  useEffect(() => setItems(data.items), [data]);
  useEffect(() => {
    if (ScrollRef.current) {
      if (ScrollRef.current.scrollTop === 0) return;
      ScrollRef.current.scrollTop = 0;
    }
    // eslint-disable-next-line
  }, [data]);

  const fetchMoreData = () => {
    fetch(
      `/api/manage/tab?tab=${query.tab ? query.tab : 'none'}&locale=${locale}&start=${items.length}&end=${items.length + 50}${
        query.id ? `&includeGenres=${query.id}` : ''
      }`
    )
      .then((data) => data.json())
      .then((data) => data.items && setItems(items.concat(data.items)));
  };

  return (
    <Full className='pt-10 flex justify-center'>
      <Title title={`${t(`pages.filmlist.menu.${query.tab!}`)} – ${t(`pages.filmlist.default`)}`} />
      <main className='w-full overflow-y-scroll dD5d-items px-11 pt-11' ref={ScrollRef} id='scrollableDiv'>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={data.length >= items.length}
          loader={null}
          scrollableTarget='scrollableDiv'
          className='w-full p-0 grid gap-2 auto-rows-auto place-items-center'
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
