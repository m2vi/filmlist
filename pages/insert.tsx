import { Button } from '@components/Button';
import Card from '@components/Card';
import Full from '@components/Full';
import { Input } from '@components/Input';
import Listbox from '@components/Listbox';
import { FrontendItemProps } from '@utils/types';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

const Insert = () => {
  const [cardProps, setCardProps] = useState({
    _id: null,
    name: 'Title',
    poster_path: '',
    release_date: Date.now(),
  } as Partial<FrontendItemProps>);

  return (
    <Full className='flex justify-center items-center'>
      <div className='grid grid-cols-2 max-w-xl w-full gap-3'>
        <div className='w-full h-full'>
          <p className='mb-2'>&nbsp;</p>
          <div className='flex flex-col justify-between'>
            <div className='h-auto'>
              <Input placeholder='Identifier' className='mb-2' />
              <Listbox />
            </div>
            <Button className='w-full'>Insert</Button>
          </div>
        </div>
        <div className='w-full flex flex-col'>
          <p className='mb-2'>Preview:</p>
          <Card {...(cardProps as any)} />
        </div>
      </div>
    </Full>
  );
};

export default Insert;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common', 'footer'])),
    },
  };
};
