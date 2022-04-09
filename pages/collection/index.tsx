import CollectionCard from '@components/Card/collection';
import PersonCard from '@components/Card/person';
import { basicFetch } from '@m2vi/iva';
import { CollectionProps, PersonsCredits } from '@Types/filmlist';
import filmlist from '@utils/apis/filmlist';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Fragment, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

const Handler = (props: any) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<CollectionProps[]>(props?.data);

  return (
    <Fragment>
      <Head>
        <title>{`${t(`collection.main_title`)} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      <div
        className='h-full w-full grid gap-6 grid-flow-row overflow-x-hidden'
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(190px, 1fr))` }}
      >
        {items.map((item, index) => {
          return <CollectionCard {...item} key={index} />;
        })}
      </div>
    </Fragment>
  );
};

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: (await filmlist.collections(context.locale!)).map(({ items, ...props }) => props),
    },
  };
};
