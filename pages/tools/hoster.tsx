/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps } from 'next';
import moment from 'moment';
import { Hoster } from '@Types/rd';
import realdebrid from '@apis/rd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Home = ({ data }: { data: Hoster[] }) => {
  return (
    <div className='w-full h-full'>
      <div className='pt-11 mt-5 w-full px-120 pb-11 max-w-screen-f2xl mx-auto'>
        <table className='w-full border border-primary-700 bg-primary-900'>
          <thead>
            <tr className='text-left border border-primary-700'>
              <th className='p-2 border border-primary-700'>Hoster</th>
              <th className='p-2 border border-primary-700'>Status</th>
              <th className='p-2 border border-primary-700'>Check time</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(({ id, image, name, check_time, status }) => {
              return (
                <tr key={id}>
                  <td className='p-2 border border-primary-700 flex items-center'>
                    <img src={image} alt=' ' className='mr-2 aspect-square h-full' />

                    {name}
                  </td>
                  <td className='p-2 border border-primary-700'>{status}</td>
                  <td className='p-2 border border-primary-700'>{moment(check_time).format('DD/MM/YYYY HH:mm:ss')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await realdebrid.hoster(),
    },
  };
};
