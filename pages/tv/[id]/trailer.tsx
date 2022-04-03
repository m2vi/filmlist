import Trailer from '@components/Trailer';
import { ItemProps } from '@Types/items';
import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

const Page = (props: { data: ItemProps }) => {
  useEffect(() => console.log(props.data), [props.data]);

  return (
    <div className='h-full w-full grid place-items-center'>
      <Trailer trailers={props.data.trailers} />
    </div>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await filmlist.getFast(parseInt(context.query.id?.toString()!), 0, id),
    },
  };
};
