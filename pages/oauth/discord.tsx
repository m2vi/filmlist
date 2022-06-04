import { GetServerSideProps } from 'next';

const Auth = () => null;

export default Auth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
    redirect: {
      destination: '/api/auth/provider/discord',
      permanent: true,
    },
  };
};
