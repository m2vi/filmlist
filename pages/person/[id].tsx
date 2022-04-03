import Person from '@components/Details/Person';
import { GetPersonResponse } from '@Types/filmlist';
import filmlist from '@utils/apis/filmlist';
import user from '@utils/user';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Handler = (props: { data: GetPersonResponse }) => {
  return <Person {...props} />;
};

Handler.layout = true;

export default Handler;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = user.getIdFromRequest(context.req);
  const client = await user.find(id);

  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ['common'])),
      data: await filmlist.getPerson(parseInt(context.query.id?.toString()!), context.locale, client),
    },
  };
};
