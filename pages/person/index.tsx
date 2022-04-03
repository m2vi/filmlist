import PersonCard from '@components/Card/person';
import { basicFetch } from '@m2vi/iva';
import { PersonsCredits } from '@Types/filmlist';
import filmlist from '@utils/apis/filmlist';
import { Cast, Crew } from 'moviedb-promise/dist/request-types';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Fragment, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

const Handler = (props: any) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<PersonsCredits>(props?.data);

  return (
    <Fragment>
      <Head>
        <title>{`${t('person.main_title')} – ${t(`pages.filmlist.default`)}`}</title>
      </Head>

      <InfiniteScroll
        loadMore={(page) =>
          basicFetch<any>(`/api/person?page=${page}`)
            .then((data) => setItems(items.concat(data)))
            .catch(console.log)
        }
        hasMore={true}
        className='h-full w-full grid gap-4 grid-flow-row overflow-x-hidden'
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(130px, 1fr))` }}
      >
        {items.map(PersonCard)}
      </InfiniteScroll>
    </Fragment>
  );
};

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await filmlist.persons(0),
    },
  };
};
