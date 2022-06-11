import main from '@apis/main';
import user from '@apis/user';
import Person from '@components/Person';
import { GetPersonResponse } from '@Types/items';
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
      data: await main.getPerson(parseInt(context.query.id?.toString()!), context.locale, client),
    },
  };
};
