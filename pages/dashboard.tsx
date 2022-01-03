import Title from '@components/Title';
import api from '@utils/backend/api';
import streaming from '@data/streaming.json';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

const Dashboard = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <div className='pt-100 w-full flex flex-col items-center px-120 max-w-screen-2xl'>
      <Title title='Dashboard' />
      <div className='w-full grid grid-cols-4 auto-rows-auto py-11 gap-4'>
        {Object.entries(data.general).map(([name, value]: any, i) => {
          return (
            <Link href={`/${name}`} key={i}>
              <a className='flex flex-col justify-center items-center text-center bg-primary-800 p-6 rounded-xl'>
                <span className='text-3xl text-primary-200'>{value}</span>
                <span className='text-base text-primary-300 mb-1 l-1'>{t(`pages.filmlist.menu.${name}`)}</span>
              </a>
            </Link>
          );
        })}
      </div>
      <div className='w-full text-center flex items-center justify-center font-bold text-lg pb-4'>Quick links</div>
      <div className='w-full grid grid-cols-3 auto-rows auto pb-11 gap-4'>
        {Object.entries(streaming.subscribed).map(([key, { name, homepage }], i) => {
          return (
            <a href={homepage} className='flex flex-col justify-center items-center text-center bg-primary-800 p-6 rounded-xl' key={i}>
              <span className='text-base l-1 text-accent font-bold'>{name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

Dashboard.layout = true;

export default Dashboard;

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