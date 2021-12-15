import { Button } from '@components/Button';
import Full from '@components/Full';
import Title from '@components/Title';
import api from '@utils/backend/api';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

const Update = ({ data }: any) => {
  useEffect(() => console.log(data), [data]);

  return (
    <Full className='grid place-items-center'>
      <Title title='Update' />
      <div className='flex flex-col max-w-4xl w-full max-h-screen bg-primary-800 rounded-8'>
        <div className='w-full p-4 flex justify-between items-center border-b border-primary-600'>
          <span className='font-bold text-2xl l-1'>Update Entries</span>
          <Button>Start</Button>
        </div>
        <div className='flex w-full h-full' style={{ aspectRatio: '22 / 10' }}>
          <div className='w-full h-full'>
            <div className='w-full p-4'></div>
          </div>
          <div className='h-full p-4 flex flex-col border-l border-primary-600' style={{ aspectRatio: '1 / 3' }}>
            <span className='text-primary-300'>0 Updated</span>
            <span className='text-primary-300'>0 Modified</span>
          </div>
        </div>
        <div className='w-full p-4 flex justify-between items-center border-t border-primary-600'>
          <span className='text-primary-300'>{data.entries.length} Entries</span>
        </div>
      </div>
    </Full>
  );
};

export default Update;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
      data: {
        ...(await api.stats(true)),
      },
    },
  };
};
