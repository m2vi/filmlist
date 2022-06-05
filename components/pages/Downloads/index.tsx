import { moment } from '@apis/moment';
import Card from '@components/Card';
import { sortByKey } from '@m2vi/iva';
import { FrontendItemProps } from '@Types/items';
import Head from 'next/head';
import CardLarge from './CardLarge';

const Page = ({ data }: { data: FrontendItemProps[] }) => {
  return (
    <div className='h-full w-full flex flex-col'>
      <Head>
        <title>Downloads</title>
      </Head>

      {sortByKey(data, 'details.date_added')
        ?.reverse()
        ?.map((data, index) => {
          return <CardLarge {...data} key={index} />;
        })}
    </div>
  );
};

export default Page;
