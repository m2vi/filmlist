import search from '@apis/search';
import { FrontendItemProps } from '@Types/items';
import { FilterProps } from '@Types/search';
import { useFilter } from 'context/useFilter';
import { useQuery } from 'context/useQuery';
import fileSize from 'filesize';
import Head from 'next/head';
import Card from './Card';
import Filter from './Filter';
import Search from './Search';

const Page = ({ data }: { data: FrontendItemProps[] }) => {
  const { filter } = useFilter();
  const { query } = useQuery();

  return (
    <div className='w-full h-full'>
      <div className='pt-11 mt-5 w-full px-120 pb-11 max-w-screen-f2xl mx-auto'>
        <div className='flex flex-col'>
          <div className='px-2 mb-4'>
            <Search />
          </div>
          <div className='mb-8 px-2 flex items-center gap-4 justify-between w-full mx-auto'>
            <div className='grid grid-cols-5 gap-4  w-full items-center'>
              {search.filters.map((filter, index) => (
                <Filter {...filter} key={index} />
              ))}
            </div>
          </div>
        </div>
        <div
          className='h-full w-full grid gap-2 grid-flow-row place-items-center'
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))',
          }}
        >
          <Head>
            <title>GUI</title>
            <link rel='shortcut icon' href='/favicon.ico' />
          </Head>
          {search.applyFilter(data, filter, query).map((item: FrontendItemProps, index) => {
            return <Card {...item} key={index} />;
          })}
        </div>
        <div className='px-2 my-4 w-full text-center'>
          <span>{data.length} Einträg(e)</span>
          <span>&nbsp;&#183;&nbsp;</span>
          <span>
            {fileSize(data.filter(({ details }) => details?.size.value).reduce((prev, curr) => prev + curr.details?.size.value!, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;
