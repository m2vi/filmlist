import { Button } from '@components/Button';
import Full from '@components/Full';
import { Input } from '@components/Input';
import Listbox from '@components/Listbox';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Insert = () => {
  return (
    <Full className='flex justify-center items-center'>
      <div className='w-full max-w-xs'>
        <Input placeholder='Title' className='mb-2' />
        <Listbox />
        <Button className='w-full'>Insert</Button>
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
